/* =====================================================================
   KAFE PRO POS — server (Node.js 22.13+ / 24, qo'shimcha paket kerak emas)

   - Ma'lumotlar: data/kafe.db (Node.js ichidagi SQLite)
   - Har bir amal alohida so'rov: bir vaqtda ishlagan qurilmalar
     bir-birining o'zgarishini o'chirib yubormaydi
   - PIN kodlar faqat serverda tekshiriladi, brauzerga yuborilmaydi
   - Har kuni avtomatik zaxira: backups/kafe-YYYY-MM-DD.db (oxirgi 30 kun)
   ===================================================================== */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const Shared = require("./shared");

process.removeAllListeners("warning"); // SQLite "experimental" ogohlantirishini yashiramiz
let DatabaseSync;
try { ({ DatabaseSync } = require("node:sqlite")); } catch (e) {
  console.error(`\nNode.js versiyasi eski (${process.version}). Kerak: 22.13 yoki undan yangi (tavsiya: 24 LTS).\nhttps://nodejs.org dan yangi LTS versiyani o'rnating.\n`);
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;
const BASE = __dirname;
const DATA_DIR = path.join(BASE, "data");
const BACKUP_DIR = path.join(BASE, "backups");
const LEGACY_FILE = path.join(BASE, "pos_data.json");
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// ---------------------------------------------------------------------
// 1. Ma'lumotlar bazasi
// ---------------------------------------------------------------------
const db = new DatabaseSync(path.join(DATA_DIR, "kafe.db"));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY, no INTEGER, hall TEXT, tbl INTEGER, status TEXT,
    created TEXT, closed TEXT, data TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS orders_created ON orders(created);
  CREATE INDEX IF NOT EXISTS orders_closed ON orders(closed);
  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY, orderId INTEGER, status TEXT, created TEXT, data TEXT NOT NULL);
  CREATE INDEX IF NOT EXISTS tickets_status ON tickets(status);
  CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, staffId INTEGER, created TEXT);
`);

const q = {
  getMeta: db.prepare("SELECT value FROM meta WHERE key = ?"),
  setMeta: db.prepare("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"),
  getOrder: db.prepare("SELECT data FROM orders WHERE id = ?"),
  openOrderAt: db.prepare("SELECT data FROM orders WHERE status = 'open' AND hall = ? AND tbl = ?"),
  putOrder: db.prepare(`INSERT INTO orders (id, no, hall, tbl, status, created, closed, data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET no = excluded.no, hall = excluded.hall, tbl = excluded.tbl, status = excluded.status,
      closed = excluded.closed, data = excluded.data`),
  delOrder: db.prepare("DELETE FROM orders WHERE id = ?"),
  maxOrderId: db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM orders"),
  maxOrderNo: db.prepare("SELECT COALESCE(MAX(no), 0) AS m FROM orders"),
  recentOrders: db.prepare("SELECT data FROM orders WHERE status = 'open' OR created >= ? OR closed >= ? ORDER BY id"),
  rangeOrders: db.prepare("SELECT data FROM orders WHERE (created >= ? AND created < ?) OR (closed >= ? AND closed < ?) ORDER BY id"),
  allOrders: db.prepare("SELECT data FROM orders ORDER BY id"),
  openCountInHall: db.prepare("SELECT COUNT(*) AS n FROM orders WHERE status = 'open' AND hall = ?"),
  openTablesInHall: db.prepare("SELECT tbl FROM orders WHERE status = 'open' AND hall = ?"),
  getTicket: db.prepare("SELECT data FROM tickets WHERE id = ?"),
  putTicket: db.prepare(`INSERT INTO tickets (id, orderId, status, created, data) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET status = excluded.status, data = excluded.data`),
  ticketsOfOrder: db.prepare("SELECT data FROM tickets WHERE orderId = ?"),
  liveTickets: db.prepare("SELECT data FROM tickets WHERE status != 'served' OR created >= ? ORDER BY id"),
  allTickets: db.prepare("SELECT data FROM tickets ORDER BY id"),
  maxTicketId: db.prepare("SELECT COALESCE(MAX(id), 0) AS m FROM tickets"),
  dropOldTickets: db.prepare("DELETE FROM tickets WHERE status = 'served' AND created < ?"),
  getSession: db.prepare("SELECT staffId FROM sessions WHERE token = ?"),
  addSession: db.prepare("INSERT INTO sessions (token, staffId, created) VALUES (?, ?, ?)"),
  delSession: db.prepare("DELETE FROM sessions WHERE token = ?"),
  delStaffSessions: db.prepare("DELETE FROM sessions WHERE staffId = ?")
};

const meta = (k, def) => { const r = q.getMeta.get(k); return r ? JSON.parse(r.value) : def; };
const setMeta = (k, v) => q.setMeta.run(k, JSON.stringify(v));
const rowsData = (rows) => rows.map((r) => JSON.parse(r.data));

function saveOrder(o) {
  const closed = o.paidAt || o.cancelledAt || o.splitAt || null;
  q.putOrder.run(o.id, o.no, o.hall, o.table, o.status, o.createdAt, closed, JSON.stringify(o));
}
function saveTicket(k) { q.putTicket.run(k.id, k.orderId, k.status, k.createdAt, JSON.stringify(k)); }

function tx(fn) {
  db.exec("BEGIN IMMEDIATE");
  try { const r = fn(); db.exec("COMMIT"); return r; } catch (e) { db.exec("ROLLBACK"); throw e; }
}

// Birinchi ishga tushishda: eski pos_data.json bo'lsa — ko'chiramiz, bo'lmasa standart
function initData() {
  if (q.getMeta.get("config")) return;
  let imported = null;
  if (fs.existsSync(LEGACY_FILE)) {
    try { imported = Shared.fromLegacy(JSON.parse(fs.readFileSync(LEGACY_FILE, "utf8"))); } catch (e) { console.error("pos_data.json o'qilmadi:", e.message); }
  }
  tx(() => {
    if (imported) {
      setMeta("config", imported.config);
      imported.orders.forEach(saveOrder);
      imported.tickets.forEach(saveTicket);
      setMeta("nextOrderNo", imported.nextOrderNo);
    } else {
      setMeta("config", Shared.defaultConfig());
      setMeta("nextOrderNo", 1);
    }
    setMeta("rev", 1);
  });
  if (imported) {
    fs.renameSync(LEGACY_FILE, LEGACY_FILE + ".imported");
    console.log(`Eski ma'lumotlar ko'chirildi: ${imported.orders.length} ta buyurtma (pos_data.json → pos_data.json.imported)`);
  }
}
initData();

// ---------------------------------------------------------------------
// 2. Holat (brauzerga yuboriladigan qism)
// ---------------------------------------------------------------------
const config = () => meta("config");
const publicStaff = (cfg) => cfg.staff.map((u) => ({ id: u.id, name: u.name, role: u.role }));
const isoAgo = (ms) => new Date(Date.now() - ms).toISOString();

function clientState() {
  const cfg = config();
  const since = isoAgo(2 * 864e5); // ochiq + oxirgi 2 kun (Bugun / Kecha uchun yetadi)
  return {
    rev: meta("rev", 1),
    settings: cfg.settings,
    staff: publicStaff(cfg),
    categories: cfg.categories,
    menu: cfg.menu,
    halls: cfg.halls,
    orders: rowsData(q.recentOrders.all(since, since)),
    tickets: rowsData(q.liveTickets.all(isoAgo(864e5)))
  };
}

// ---------------------------------------------------------------------
// 3. Amallar (har biri bitta tranzaksiyada bajariladi)
// ---------------------------------------------------------------------
class UserError extends Error {}
const fail = (msg) => { throw new UserError(msg); };
const nowIso = () => new Date().toISOString();
const CASH = ["admin", "kassir"];
const TAKE = ["admin", "kassir", "ofitsiant"]; // buyurtma olish (to'lovsiz)
const ADMIN = ["admin"];

// Buyurtma raqami hech qachon takrorlanmaydi
function newOrderNo() {
  const no = Math.max(meta("nextOrderNo", 1), q.maxOrderNo.get().m + 1);
  setMeta("nextOrderNo", no + 1);
  return no;
}

// To'lov ma'lumotlarini buyurtmaga yozish (to'liq va bo'lib to'lashda bir xil)
function markPaid(cfg, o, p, user) {
  const c = Shared.calc(cfg, o);
  const n = Shared.payNums(p.method, c.total, p.given, p.card, p.cash);
  if (!n.ok) fail(p.method === "aralash" && n.card > c.total ? "Karta summasi jami summadan oshmasligi kerak" : "To'lov summasi yetarli emas");
  Object.assign(o, {
    status: "paid", paidAt: nowIso(), sub: c.sub, discountSum: c.disc, serviceSum: c.svc, servicePct: c.svcPct, total: c.total,
    cashierId: user.id, cashierName: user.name,
    payment: { method: p.method, card: n.card, cash: c.total - n.card, given: n.paid, change: n.change }
  });
}

function loadOrder(id) {
  const r = q.getOrder.get(Number(id));
  if (!r) fail("Buyurtma topilmadi");
  return JSON.parse(r.data);
}
function openOrder(id) {
  const o = loadOrder(id);
  if (o.status !== "open") fail("Bu buyurtma allaqachon yopilgan");
  return o;
}
function itemAt(o, idx, pid) {
  let i = Number(idx);
  if (!o.items[i] || (pid != null && o.items[i].pid !== Number(pid))) i = o.items.findIndex((x) => x.pid === Number(pid));
  if (i < 0 || !o.items[i]) fail("Taom buyurtmada topilmadi (boshqa qurilmada o'zgargan bo'lishi mumkin)");
  return i;
}
function dropIfEmpty(o) {
  if (!o.items.length && !q.ticketsOfOrder.all(o.id).length) { q.delOrder.run(o.id); return true; }
  return false;
}
const str = (v, max = 200) => String(v ?? "").trim().slice(0, max);

const ACTIONS = {
  // ---- Kassa ----
  "order.add": { roles: TAKE, run(p, user) {
    const cfg = config();
    const hall = Shared.hallOf(cfg, p.hall);
    const table = Number(p.table);
    if (!cfg.halls.some((h) => h.id === p.hall) || !(table >= 1 && table <= hall.count)) fail("Bunday stol yo'q");
    const m = cfg.menu.find((x) => x.id === Number(p.pid));
    if (!m) fail("Taom topilmadi");
    if (m.available === false) fail(`"${m.name}" hozir sotuvda yo'q`);
    const row = q.openOrderAt.get(p.hall, table);
    let o = row ? JSON.parse(row.data) : null;
    if (!o) {
      const no = newOrderNo();
      o = { id: q.maxOrderId.get().m + 1, no, hall: p.hall, table, items: [], note: "", discount: 0, status: "open", createdAt: nowIso(), createdBy: user.name,
        waiterId: user.id, waiterName: user.name }; // stolga xizmat qiluvchi — xizmat haqi shu xodimga yoziladi
    }
    const it = o.items.find((i) => i.pid === m.id && i.price === m.price);
    if (it) it.qty++;
    else o.items.push({ pid: m.id, name: m.name, price: m.price, qty: 1, sent: 0 });
    saveOrder(o);
    return { orderId: o.id };
  } },
  "order.qty": { roles: TAKE, run(p) {
    const o = openOrder(p.orderId);
    const i = itemAt(o, p.idx, p.pid);
    const it = o.items[i];
    const nq = it.qty + (Number(p.delta) > 0 ? 1 : -1);
    if (nq < it.sent) it.sent = Math.max(0, nq);
    it.qty = nq;
    if (it.qty <= 0) o.items.splice(i, 1);
    if (!dropIfEmpty(o)) saveOrder(o);
  } },
  "order.remove": { roles: TAKE, run(p) {
    const o = openOrder(p.orderId);
    o.items.splice(itemAt(o, p.idx, p.pid), 1);
    if (!dropIfEmpty(o)) saveOrder(o);
  } },
  "order.note": { roles: TAKE, run(p) {
    const o = openOrder(p.orderId);
    o.note = str(p.note, 300);
    saveOrder(o);
  } },
  // Kassir buyurtmani boshqa ofitsiantga biriktirishi mumkin (xizmat haqi o'shanga yoziladi)
  "order.waiter": { roles: CASH, run(p) {
    const o = openOrder(p.orderId);
    const u = config().staff.find((x) => x.id === Number(p.staffId));
    if (!u || u.role === "oshpaz") fail("Xodim topilmadi");
    Object.assign(o, { waiterId: u.id, waiterName: u.name });
    saveOrder(o);
    // hali topshirilmagan chiptalar ham yangi ofitsiantga o'tadi
    rowsData(q.ticketsOfOrder.all(o.id)).forEach((k) => { if (k.status !== "served") { Object.assign(k, { waiterId: u.id, waiterName: u.name }); saveTicket(k); } });
  } },
  // Stolni almashtirish: ochiq buyurtma boshqa (bo'sh) stolga ko'chadi
  "order.move": { roles: CASH, run(p) {
    const cfg = config();
    const o = openOrder(p.orderId);
    const hall = cfg.halls.find((h) => h.id === p.hall);
    const table = Number(p.table);
    if (!hall || !(table >= 1 && table <= hall.count)) fail("Bunday stol yo'q");
    if (q.openOrderAt.get(p.hall, table)) fail(`${hall.name}, ${table}-stol band`);
    Object.assign(o, { hall: p.hall, table });
    saveOrder(o);
    rowsData(q.ticketsOfOrder.all(o.id)).forEach((k) => { Object.assign(k, { hall: p.hall, table }); saveTicket(k); });
  } },
  "order.discount": { roles: CASH, run(p) {
    const o = openOrder(p.orderId);
    o.discount = Math.min(100, Math.max(0, Math.round(Number(p.discount) || 0)));
    saveOrder(o);
  } },
  "order.kitchen": { roles: TAKE, run(p) {
    const o = openOrder(p.orderId);
    const items = o.items.filter((i) => i.qty > i.sent).map((i) => ({ name: i.name, qty: i.qty - i.sent }));
    if (!items.length) fail("Yuboriladigan yangi taom yo'q");
    const w = Shared.waiterOf(o);
    const ticket = { id: q.maxTicketId.get().m + 1, orderId: o.id, orderNo: o.no, hall: o.hall, table: o.table, items, note: o.note, status: "new", createdAt: nowIso(),
      waiterId: w.id, waiterName: w.name };
    saveTicket(ticket);
    o.items.forEach((i) => (i.sent = i.qty));
    saveOrder(o);
    return { ticket };
  } },
  "order.pay": { roles: CASH, run(p, user) {
    const cfg = config();
    const o = openOrder(p.orderId);
    if (!o.items.length) fail("Buyurtma bo'sh");
    if (!Shared.PAY_LABEL[p.method]) fail("To'lov turini tanlang");
    markPaid(cfg, o, p, user);
    saveOrder(o);
    return { orderId: o.id };
  } },
  // Hisobni bo'lib to'lash: tanlangan taomlar alohida chek bo'lib to'lanadi, qolgani stolda ochiq qoladi
  "order.payPart": { roles: CASH, run(p, user) {
    const cfg = config();
    const o = openOrder(p.orderId);
    if (!Shared.PAY_LABEL[p.method]) fail("To'lov turini tanlang");
    const parts = Array.isArray(p.parts) ? p.parts : [];
    const items = [];
    parts.forEach((x) => {
      const qty = Math.floor(Number(x.qty) || 0);
      if (qty <= 0) return;
      const it = o.items.find((i) => i.pid === Number(x.pid) && i.price === Number(x.price));
      if (!it || qty > it.qty) fail("Tanlangan taom soni buyurtmadagidan ko'p (boshqa qurilmada o'zgargan bo'lishi mumkin)");
      items.push({ ...it, qty, sent: Math.min(it.sent, qty) });
      it.sent = Math.max(0, it.sent - Math.min(it.sent, qty));
      it.qty -= qty;
    });
    if (!items.length) fail("To'lash uchun taom tanlang");
    const part = {
      id: q.maxOrderId.get().m + 1, no: newOrderNo(), hall: o.hall, table: o.table, items, note: o.note, discount: o.discount,
      status: "open", createdAt: o.createdAt, createdBy: o.createdBy, waiterId: o.waiterId, waiterName: o.waiterName, splitFrom: o.no
    };
    markPaid(cfg, part, p, user);
    saveOrder(part);
    o.items = o.items.filter((i) => i.qty > 0);
    if (!o.items.length) {
      // hammasi bo'lib to'landi: asosiy buyurtma yopiladi (oshxona chiptalari bog'langan bo'lishi mumkin)
      if (!dropIfEmpty(o)) { Object.assign(o, { status: "split", splitAt: nowIso() }); saveOrder(o); }
    } else saveOrder(o);
    return { orderId: part.id, remaining: o.items.length };
  } },
  "order.cancel": { roles: ADMIN, run(p, user) {
    const o = openOrder(p.orderId);
    Object.assign(o, { status: "cancelled", cancelledAt: nowIso(), cancelledBy: user.name });
    saveOrder(o);
    rowsData(q.ticketsOfOrder.all(o.id)).forEach((k) => { if (k.status !== "served") { k.status = "served"; saveTicket(k); } });
  } },

  // ---- Oshxona ----
  "ticket.set": { roles: ["admin", "oshpaz", "kassir", "ofitsiant"], run(p, user) {
    if (!["new", "cooking", "ready", "served"].includes(p.status)) fail("Noto'g'ri holat");
    // Ofitsiant va kassir faqat tayyor taomni "oldim" (topshirildi) deb belgilay oladi
    if (["kassir", "ofitsiant"].includes(user.role) && p.status !== "served") fail("Bu amal uchun ruxsatingiz yo'q");
    const r = q.getTicket.get(Number(p.id));
    if (!r) fail("Chipta topilmadi");
    const k = JSON.parse(r.data);
    if (["kassir", "ofitsiant"].includes(user.role) && k.status !== "ready") fail("Bu buyurtma hali tayyor emas");
    k.status = p.status;
    k[p.status + "At"] = nowIso();
    if (p.status === "served") k.servedBy = user.name;
    saveTicket(k);
  } },

  // ---- Menyu ----
  "cat.save": { roles: ADMIN, run(p) {
    const cfg = config();
    const name = str(p.name, 60);
    if (!name) fail("Nomini kiriting");
    if (p.id) { const c = cfg.categories.find((x) => x.id === p.id); if (!c) fail("Kategoriya topilmadi"); c.name = name; }
    else cfg.categories.push({ id: "c" + (cfg.categories.reduce((m, c) => Math.max(m, Number(String(c.id).slice(1)) || 0), 0) + 1), name });
    setMeta("config", cfg);
  } },
  "cat.reorder": { roles: ADMIN, run(p) {
    const cfg = config();
    const ids = Array.isArray(p.ids) ? p.ids : [];
    const rank = (c) => { const i = ids.indexOf(c.id); return i < 0 ? 1e9 : i; };
    cfg.categories.sort((a, b) => rank(a) - rank(b));
    setMeta("config", cfg);
  } },
  "cat.delete": { roles: ADMIN, run(p) {
    const cfg = config();
    const c = cfg.categories.find((x) => x.id === p.id);
    if (!c) fail("Kategoriya topilmadi");
    if (cfg.menu.some((m) => m.catId === p.id)) fail(`"${c.name}" ichida taomlar bor. Avval ularni boshqa kategoriyaga o'tkazing.`);
    cfg.categories = cfg.categories.filter((x) => x.id !== p.id);
    setMeta("config", cfg);
  } },
  "dish.save": { roles: ADMIN, run(p) {
    const cfg = config();
    const name = str(p.name, 80);
    const price = Math.round(Number(p.price));
    if (!name) fail("Taom nomini kiriting");
    if (!(price > 0)) fail("Narxni to'g'ri kiriting");
    if (!cfg.categories.some((c) => c.id === p.catId)) fail("Kategoriyani tanlang");
    const data = { name, price, catId: p.catId, available: p.available !== false };
    if (p.id) { const m = cfg.menu.find((x) => x.id === Number(p.id)); if (!m) fail("Taom topilmadi"); Object.assign(m, data); }
    else cfg.menu.push({ id: Shared.nextId(cfg.menu), ...data });
    setMeta("config", cfg);
  } },
  "dish.delete": { roles: ADMIN, run(p) {
    const cfg = config();
    cfg.menu = cfg.menu.filter((x) => x.id !== Number(p.id));
    setMeta("config", cfg);
  } },

  // ---- Stollar (joylar) ----
  "hall.save": { roles: ADMIN, run(p) {
    const cfg = config();
    const name = str(p.name, 40);
    const count = Math.round(Number(p.count));
    const service = Math.min(100, Math.max(0, Number(p.service) || 0));
    if (!name) fail("Nomini kiriting");
    if (!(count >= 0 && count <= 200)) fail("Stollar soni 0 dan 200 gacha");
    if (p.id) {
      const h = cfg.halls.find((x) => x.id === p.id);
      if (!h) fail("Joy topilmadi");
      const busy = q.openTablesInHall.all(p.id).map((r) => r.tbl).filter((t) => t > count);
      if (busy.length) fail(`${busy.join(", ")}-stol(lar)da ochiq buyurtma bor`);
      Object.assign(h, { name, count, service });
    } else {
      cfg.halls.push({ id: "h" + (cfg.halls.reduce((m, h) => Math.max(m, Number(String(h.id).slice(1)) || 0), 0) + 1), name, count, service });
    }
    setMeta("config", cfg);
  } },
  "hall.delete": { roles: ADMIN, run(p) {
    const cfg = config();
    const h = cfg.halls.find((x) => x.id === p.id);
    if (!h) fail("Joy topilmadi");
    if (q.openCountInHall.get(p.id).n) fail(`"${h.name}"da ochiq buyurtmalar bor`);
    cfg.halls = cfg.halls.filter((x) => x.id !== p.id);
    setMeta("config", cfg);
  } },

  // ---- Sozlamalar ----
  "settings.save": { roles: ADMIN, run(p) {
    const cfg = config();
    const name = str(p.name, 60);
    if (!name) fail("Restoran nomini kiriting");
    Object.assign(cfg.settings, { name, phone: str(p.phone, 40), address: str(p.address, 120) });
    setMeta("config", cfg);
  } },
  "printer.save": { roles: ADMIN, run(p) {
    const cfg = config();
    const x = p.printer || {};
    cfg.settings.printer = {
      paper: x.paper === "58" ? "58" : "80",
      fontSize: [11, 12, 14].includes(Number(x.fontSize)) ? Number(x.fontSize) : 12,
      copies: Math.min(3, Math.max(1, Number(x.copies) || 1)),
      header: str(x.header, 80),
      showAddress: !!x.showAddress, showPhone: !!x.showPhone, showCashier: !!x.showCashier,
      autoPrint: !!x.autoPrint, kitchenPrint: !!x.kitchenPrint,
      kitchenPrintAt: x.kitchenPrintAt === "oshxona" ? "oshxona" : "kassa"
    };
    cfg.settings.receiptFooter = str(p.receiptFooter, 120);
    setMeta("config", cfg);
  } },
  "staff.save": { roles: ADMIN, run(p, user) {
    const cfg = config();
    const name = str(p.name, 40);
    const role = p.role;
    const pin = str(p.pin, 6);
    if (!name) fail("Ismni kiriting");
    if (!Shared.ROLES[role]) fail("Rolni tanlang");
    if (pin && !/^\d{4,6}$/.test(pin)) fail("PIN 4–6 ta raqamdan iborat bo'lsin");
    if (p.id) {
      const u = cfg.staff.find((x) => x.id === Number(p.id));
      if (!u) fail("Xodim topilmadi");
      if (u.id === user.id && role !== "admin") fail("O'zingizning admin rolingizni olib tashlay olmaysiz");
      const pinChanged = pin && pin !== u.pin;
      Object.assign(u, { name, role }, pin ? { pin } : {});
      if (pinChanged && u.id !== user.id) q.delStaffSessions.run(u.id); // eski PIN bilan kirganlar chiqariladi
    } else {
      if (!pin) fail("PIN kodni kiriting");
      cfg.staff.push({ id: Shared.nextId(cfg.staff), name, role, pin });
    }
    if (new Set(cfg.staff.map((u) => u.pin)).size !== cfg.staff.length) fail("Bu PIN boshqa xodimda bor — boshqa PIN tanlang");
    setMeta("config", cfg);
  } },
  "staff.delete": { roles: ADMIN, run(p, user) {
    const cfg = config();
    const id = Number(p.id);
    if (id === user.id) fail("O'zingizni o'chira olmaysiz");
    cfg.staff = cfg.staff.filter((x) => x.id !== id);
    q.delStaffSessions.run(id);
    setMeta("config", cfg);
  } },
  "data.reset": { roles: ADMIN, run(p, user, token) {
    // zaxira nusxa so'rov kelganda tranzaksiyadan oldin olinadi (pastda)
    db.exec("DELETE FROM orders; DELETE FROM tickets; DELETE FROM sessions;");
    const cfg = Shared.defaultConfig();
    setMeta("config", cfg);
    setMeta("nextOrderNo", 1);
    q.addSession.run(token, cfg.staff[0].id, nowIso()); // tozalagan admin tizimda qoladi
  } }
};

function runAction(type, payload, user, token) {
  const a = ACTIONS[type];
  if (!a) fail("Noma'lum amal");
  if (!a.roles.includes(user.role)) fail("Bu amal uchun ruxsatingiz yo'q");
  return tx(() => {
    const result = a.run(payload || {}, user, token) || {};
    setMeta("rev", meta("rev", 1) + 1);
    return result;
  });
}

// ---------------------------------------------------------------------
// 4. Kirish (PIN) va sessiyalar
// ---------------------------------------------------------------------
const attempts = new Map(); // ip -> { n, until }

function userByToken(req) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!token) return null;
  const s = q.getSession.get(token);
  if (!s) return null;
  const u = config().staff.find((x) => x.id === s.staffId);
  return u ? { user: { id: u.id, name: u.name, role: u.role }, token } : null;
}

function login(req, body) {
  const ip = req.socket.remoteAddress || "?";
  const a = attempts.get(ip) || { n: 0, until: 0 };
  if (a.until > Date.now()) return [429, { error: `Juda ko'p urinish. ${Math.ceil((a.until - Date.now()) / 1000)} soniyadan keyin qayta urining.` }];
  const u = config().staff.find((x) => x.id === Number(body.id));
  if (!u || String(body.pin || "") !== String(u.pin)) {
    a.n++;
    if (a.n >= 5) { a.until = Date.now() + 30000; a.n = 0; }
    attempts.set(ip, a);
    return [401, { error: "PIN kod noto'g'ri" }];
  }
  attempts.delete(ip);
  const token = crypto.randomBytes(24).toString("hex");
  q.addSession.run(token, u.id, nowIso());
  return [200, { token, user: { id: u.id, name: u.name, role: u.role } }];
}

// ---------------------------------------------------------------------
// 5. Zaxira nusxa (har kuni, oxirgi 30 tasi saqlanadi)
// ---------------------------------------------------------------------
const pad = (n) => String(n).padStart(2, "0");
const localYmd = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function backup(force = false) {
  try {
    const name = force ? `kafe-${localYmd()}-${pad(new Date().getHours())}${pad(new Date().getMinutes())}${pad(new Date().getSeconds())}.db` : `kafe-${localYmd()}.db`;
    const file = path.join(BACKUP_DIR, name);
    if (fs.existsSync(file)) return;
    db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
    const all = fs.readdirSync(BACKUP_DIR).filter((f) => /^kafe-.*\.db$/.test(f)).sort();
    all.slice(0, Math.max(0, all.length - 30)).forEach((f) => fs.unlinkSync(path.join(BACKUP_DIR, f)));
    q.dropOldTickets.run(isoAgo(3 * 864e5));
    console.log("Zaxira nusxa:", path.relative(BASE, file));
  } catch (e) { console.error("Zaxira xatosi:", e.message); }
}
backup();
setInterval(() => { backup(); try { db.exec("PRAGMA wal_checkpoint(TRUNCATE)"); } catch (e) {} }, 60 * 60 * 1000);

// To'xtatilganda (Ctrl+C yoki oyna yopilganda) bazani to'g'ri yopamiz
function shutdown() {
  try { db.exec("PRAGMA wal_checkpoint(TRUNCATE)"); db.close(); } catch (e) {}
  process.exit(0);
}
["SIGINT", "SIGTERM", "SIGHUP"].forEach((sig) => process.on(sig, shutdown));

// ---------------------------------------------------------------------
// 6. HTTP server
// ---------------------------------------------------------------------
const STATIC = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/app.js": ["app.js", "application/javascript; charset=utf-8"],
  "/shared.js": ["shared.js", "application/javascript; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"]
};

function send(res, code, obj, headers = {}) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  res.end(JSON.stringify(obj));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (c) => { body += c; if (body.length > 1e6) { reject(new UserError("So'rov juda katta")); req.destroy(); } });
    req.on("end", () => { try { resolve(body ? JSON.parse(body) : {}); } catch (e) { reject(new UserError("Noto'g'ri so'rov")); } });
    req.on("error", reject);
  });
}

// Mahalliy kun oralig'i → ISO chegaralar (kun boshidan keyingi kun boshigacha)
function rangeBounds(from, to) {
  const start = from ? new Date(from + "T00:00:00") : new Date(0);
  const end = to ? new Date(new Date(to + "T00:00:00").getTime() + 864e5) : new Date(8.64e15);
  return [start.toISOString(), end.toISOString()];
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname;
  try {
    if (!p.startsWith("/api/")) {
      if (STATIC[p]) {
        const [file, type] = STATIC[p];
        res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
        return res.end(fs.readFileSync(path.join(BASE, file)));
      }
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Topilmadi");
    }

    // Kirish oynasi uchun: faqat ismlar va rollar (PIN emas)
    if (p === "/api/public" && req.method === "GET") {
      const cfg = config();
      return send(res, 200, { name: cfg.settings.name, staff: publicStaff(cfg) });
    }
    if (p === "/api/login" && req.method === "POST") {
      const [code, body] = login(req, await readBody(req));
      return send(res, code, body);
    }

    const auth = userByToken(req);
    if (!auth) return send(res, 401, { error: "Qayta kiring" });

    if (p === "/api/logout" && req.method === "POST") {
      q.delSession.run(auth.token);
      return send(res, 200, { ok: true });
    }
    if (p === "/api/state" && req.method === "GET") {
      const rev = meta("rev", 1);
      if (Number(url.searchParams.get("rev")) === rev) return send(res, 200, { rev, same: true, me: auth.user });
      return send(res, 200, { ...clientState(), me: auth.user });
    }
    if (p === "/api/orders" && req.method === "GET") {
      if (!["admin", "kassir"].includes(auth.user.role)) return send(res, 403, { error: "Ruxsat yo'q" });
      const [a, b] = rangeBounds(url.searchParams.get("from"), url.searchParams.get("to"));
      return send(res, 200, { orders: rowsData(q.rangeOrders.all(a, b, a, b)) });
    }
    if (p === "/api/action" && req.method === "POST") {
      const body = await readBody(req);
      if (body.type === "data.reset" && auth.user.role === "admin") backup(true); // tozalashdan oldin albatta zaxira
      const result = runAction(body.type, body.payload, auth.user, auth.token);
      return send(res, 200, { ok: true, result, state: { ...clientState(), me: userByToken(req)?.user || auth.user } });
    }
    if (p === "/api/export" && req.method === "GET") {
      if (auth.user.role !== "admin") return send(res, 403, { error: "Ruxsat yo'q" });
      const data = { exportedAt: nowIso(), config: config(), nextOrderNo: meta("nextOrderNo", 1), orders: rowsData(q.allOrders.all()), tickets: rowsData(q.allTickets.all()) };
      return send(res, 200, data, { "Content-Disposition": `attachment; filename="kafe-zaxira-${localYmd()}.json"` });
    }
    return send(res, 404, { error: "Topilmadi" });
  } catch (e) {
    if (e instanceof UserError) return send(res, 400, { error: e.message });
    console.error(e);
    return send(res, 500, { error: "Server xatosi: " + e.message });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`\n🍽️  Kafe Pro ishga tushdi:  http://localhost:${PORT}`);
  const ips = Object.values(os.networkInterfaces()).flat().filter((i) => i && i.family === "IPv4" && !i.internal).map((i) => i.address);
  if (ips.length) console.log(`   Boshqa qurilmalardan (planshet, oshxona ekrani): ${ips.map((ip) => `http://${ip}:${PORT}`).join("  ")}`);
  console.log("   To'xtatish: Ctrl+C\n");
});
