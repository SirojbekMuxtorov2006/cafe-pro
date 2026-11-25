/* =====================================================================
   KAFE PRO POS — asosiy mantiq
   Kassa · Oshxona · Stollar · Menyu · Buyurtmalar · Sozlamalar
   ===================================================================== */

// ---------------------------------------------------------------------
// 1. Boshlang'ich ma'lumotlar (umumiy qism shared.js da)
// ---------------------------------------------------------------------
const { ROLES, PAY_LABEL } = Shared;

const NAV = [
  { id: "admin", label: "Admin panel", icon: "chart", roles: ["admin"] },
  { id: "kassa", label: "Kassa", icon: "cash", roles: ["kassir"] },
  { id: "waiter", label: "Ofitsiant", icon: "users", roles: ["ofitsiant"] },
  { id: "kitchen", label: "Oshxona", icon: "chef", roles: ["admin", "oshpaz"] },
  { id: "halls", label: "Stollar", icon: "seat", roles: ["admin"] },
  { id: "menu", label: "Menyu", icon: "book", roles: ["admin"] },
  { id: "orders", label: "Buyurtmalar", icon: "list", roles: ["admin", "kassir"] },
  { id: "settings", label: "Sozlamalar", icon: "gear", roles: ["admin"] }
];

// ---------------------------------------------------------------------
// 2. Yordamchi funksiyalar
// ---------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => Math.round(n || 0).toLocaleString("ru-RU");
const money = (n) => fmt(n) + " so'm";
const num = Shared.num;
const nowIso = () => new Date().toISOString();
const pad = (n) => String(n).padStart(2, "0");
const dateStr = (d) => { d = new Date(d); return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`; };
const tm = (d) => { d = new Date(d); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const dt = (d) => `${dateStr(d)} ${tm(d)}`;
const mins = (d) => Math.max(0, Math.floor((Date.now() - new Date(d)) / 60000));
const initials = (name) => String(name).split(/\s+/).map((w) => w[0] || "").join("").slice(0, 2).toUpperCase();

const ICONS = {
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  chef: '<path d="M6 13.9A4 4 0 0 1 7.4 6a5.1 5.1 0 0 1 9.2 0A4 4 0 0 1 18 13.9V20H6z"/><path d="M6 16.5h12"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5V21h16"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  split: '<path d="M16 3h5v5M8 3H3v5M21 3l-7 7M3 3l7 7M12 14v7"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  print: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  wallet: '<path d="M20 7H5a2 2 0 0 1 0-4h13v4"/><path d="M3 5v14a2 2 0 0 0 2 2h15V7"/><path d="M16 14h.01"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  seat: '<rect x="4" y="8" width="16" height="5" rx="1.5"/><path d="M7 13v7M17 13v7M8 4h8"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>'
};
const icon = (name) => `<svg class="i" viewBox="0 0 24 24">${ICONS[name] || ""}</svg>`;

function toast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  $("toasts").appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function openModal(html, size = "") {
  $("modalBox").className = "modal-box " + size;
  $("modalBox").innerHTML = html;
  $("modal").classList.remove("hidden");
  const first = $("modalBox").querySelector("input:not([type=file]),select,textarea");
  if (first) setTimeout(() => first.focus(), 30);
}
function closeModal() {
  $("modal").classList.add("hidden");
  // Yopilgan oynadagi maydonda fokus qolmasin (aks holda Esc va yangilanish ishlamaydi)
  const a = document.activeElement;
  if (a && $("modal").contains(a)) a.blur();
}
const modalOpen = () => !$("modal").classList.contains("hidden");

// ---------------------------------------------------------------------
// 3. Server bilan aloqa (barcha ma'lumot serverda — data/kafe.db)
// ---------------------------------------------------------------------
const TOKEN_KEY = "kafe_pro_token";
let S = { rev: 0, settings: { name: "Kafe Pro", printer: Shared.defaultConfig().settings.printer }, staff: [], categories: [], menu: [], halls: [], orders: [], tickets: [] };
let online = true;

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsSet(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* xotira yopiq */ } }

async function api(path, opts = {}) {
  const token = lsGet(TOKEN_KEY);
  let r;
  try {
    r = await fetch(path, {
      method: opts.body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: "Bearer " + token } : {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    });
  } catch (e) {
    setOnline(false);
    throw new Error("Server bilan aloqa yo'q. Server yoqilganini tekshiring.");
  }
  setOnline(true);
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && path !== "/api/login") { sessionLost(); throw new Error(d.error || "Qayta kiring"); }
  if (!r.ok) throw new Error(d.error || "Xatolik");
  return d;
}

function setOnline(v) {
  if (v === online) return;
  online = v;
  toast(v ? "Server bilan aloqa tiklandi" : "Server bilan aloqa yo'q!", v ? "success" : "error");
}

function applyState(d) {
  if (!d || d.same) return;
  S = d;
  if (d.me) me = d.me;
}

// Har bir o'zgarish serverga alohida amal bo'lib boradi; javobda yangi holat keladi
async function act(type, payload) {
  try {
    const d = await api("/api/action", { body: { type, payload } });
    applyState(d.state);
    renderAll();
    return d.result || {};
  } catch (e) {
    toast(e.message, "error");
    return null;
  }
}

function isBusy() {
  const a = document.activeElement;
  return modalOpen() || (a && ["INPUT", "TEXTAREA", "SELECT"].includes(a.tagName));
}

// Boshqa qurilmalardagi o'zgarishlarni olish (kassa ↔ oshxona)
let polling = false;
async function poll() {
  if (!me || polling || isBusy()) return;
  polling = true;
  try {
    const d = await api("/api/state?rev=" + S.rev);
    if (!d.same && !isBusy()) { applyState(d); renderAll(); }
  } catch (e) { /* aloqa yo'q — setOnline xabar beradi */ }
  polling = false;
}

async function load() {
  try {
    if (lsGet(TOKEN_KEY)) applyState(await api("/api/state"));
  } catch (e) { /* token eskirgan — kirish oynasi */ }
  if (!me) await loadPublic();
  if (me) view = firstAllowed();
  renderAll();
}

async function loadPublic() {
  try {
    const d = await api("/api/public");
    S.settings = { ...S.settings, name: d.name };
    S.staff = d.staff;
  } catch (e) { toast(e.message, "error"); }
}

function sessionLost() {
  if (!me) return;
  me = null;
  lsSet(TOKEN_KEY, null);
  closeModal();
  loadPublic().then(renderAll);
}

// ---------------------------------------------------------------------
// 4. Kirish / chiqish
// ---------------------------------------------------------------------
let me = null;
let loginPick = null;
let view = "kassa";
let shownView = null;

function renderLogin() {
  $("app").classList.add("hidden");
  const el = $("login");
  el.classList.remove("hidden");
  el.innerHTML = `
    <div class="login-card">
      <div class="login-logo">🍽️</div>
      <h1>${esc(S.settings.name)}</h1>
      <p class="muted">Tizimga kirish uchun xodimni tanlang va PIN kodni kiriting</p>
      <div class="login-users">
        ${S.staff.map((u) => `
          <button class="login-user ${loginPick === u.id ? "active" : ""}" onclick="pickUser(${u.id})">
            <span class="avatar">${esc(initials(u.name))}</span>
            <b>${esc(u.name)}</b><small>${ROLES[u.role] || ""}</small>
          </button>`).join("")}
      </div>
      <input id="pin" type="password" inputmode="numeric" autocomplete="off" placeholder="PIN" onkeydown="if(event.key==='Enter')doLogin()">
      <div id="loginErr" class="err"></div>
      <button class="btn primary big" onclick="doLogin()">Kirish</button>
    </div>`;
}

function pickUser(id) {
  loginPick = id;
  renderLogin();
  $("pin").focus();
}

async function doLogin() {
  if (!loginPick) { $("loginErr").textContent = "Xodimni tanlang"; return; }
  try {
    const d = await api("/api/login", { body: { id: loginPick, pin: $("pin").value } });
    lsSet(TOKEN_KEY, d.token);
    applyState(await api("/api/state"));
    me = d.user;
    view = firstAllowed();
    shownView = null;
    renderAll();
    toast(`Xush kelibsiz, ${d.user.name}!`, "success");
  } catch (e) {
    $("loginErr").textContent = e.message;
    $("pin").value = "";
    $("pin").focus();
  }
}

async function logout() {
  readyKnown = null;
  try { await api("/api/logout", { body: {} }); } catch (e) {}
  me = null;
  loginPick = null;
  selTable = null;
  lsSet(TOKEN_KEY, null);
  closeModal();
  await loadPublic();
  renderAll();
}

const can = (v) => !!me && NAV.some((n) => n.id === v && n.roles.includes(me.role));
const firstAllowed = () => NAV.find((n) => n.roles.includes(me.role)).id;

function go(v) {
  if (!can(v)) return;
  view = v;
  renderAll();
}

// ---------------------------------------------------------------------
// 5. Umumiy ko'rinish: sidebar, header, bildirishnomalar
// ---------------------------------------------------------------------

function renderAll() {
  if (!me) { shownView = null; $("readyDock").classList.add("hidden"); renderLogin(); return; }
  $("login").classList.add("hidden");
  $("app").classList.remove("hidden");
  if (!can(view)) view = firstAllowed();
  if (shownView !== view) { $("content").innerHTML = ""; shownView = view; }
  renderSidebar();
  renderHeader();
  VIEWS[view]();
  kitchenAutoPrint();
  renderReadyDock();
}

function renderSidebar() {
  $("sideBrand").textContent = S.settings.name;
  $("sideNav").innerHTML = NAV.filter((n) => n.roles.includes(me.role)).map((n) => `
    <button class="nav ${n.id === view ? "active" : ""}" onclick="go('${n.id}')" title="${n.label}">
      ${icon(n.icon)}<span>${n.label}</span>
      ${n.id === "kitchen" && kitchenCount() ? `<em class="pill">${kitchenCount()}</em>` : ""}
    </button>`).join("");
  $("sideUser").innerHTML = `
    <div class="side-user">
      <span class="avatar">${esc(initials(me.name))}</span>
      <div><b>${esc(me.name)}</b><small>${ROLES[me.role]}</small></div>
    </div>
    <button class="nav logout" onclick="logout()" title="Chiqish">${icon("logout")}<span>Chiqish</span></button>`;
}

function renderHeader() {
  const n = NAV.find((x) => x.id === view);
  $("menuToggle").innerHTML = icon("menu");
  $("hdrTitle").textContent = n.label;
  $("hdrSub").textContent = S.settings.name;
  tickClock();
}

// Sidebar: foydalanuvchi tanlovi saqlanadi, bo'lmasa kichik ekranda avtomatik yig'iladi
const SIDEBAR_KEY = "kafe_pro_sidebar";
function applySidebar() {
  const pref = lsGet(SIDEBAR_KEY);
  const mini = pref ? pref === "mini" : window.innerWidth < 1400;
  document.body.classList.toggle("side-mini", mini);
}
function toggleSidebar() {
  const mini = !document.body.classList.contains("side-mini");
  lsSet(SIDEBAR_KEY, mini ? "mini" : "full");
  applySidebar();
// Oshxona panelida "necha daqiqa o'tdi" yangilanib tursin
setInterval(() => { if (me && view === "kitchen" && !isBusy()) renderKitchen(); }, 30000);
}
window.addEventListener("resize", applySidebar);

function tickClock() {
  const d = new Date();
  const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  $("hdrTime").textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  $("hdrDate").textContent = `${days[d.getDay()]}, ${dateStr(d)}`;
}

// ---------------------------------------------------------------------
// 6. Buyurtma yordamchilari
// ---------------------------------------------------------------------
const hallOf = (id) => Shared.hallOf(S, id);
const placeName = (h, t) => Shared.placeName(S, h, t);
const activeOrder = (h, t) => S.orders.find((o) => o.hall === h && o.table === t && o.status === "open");
const curOrder = () => (selTable ? activeOrder(selHall, selTable) : null);

// Jami = taomlar − chegirma + xizmat haqi (hisob shared.js da — server ham xuddi shunday hisoblaydi)
const calc = (o) => Shared.calc(S, o);

const orderTickets = (o) => S.tickets.filter((k) => k.orderId === o.id);
const kitchenCount = () => S.tickets.filter((k) => k.status === "new" || k.status === "cooking").length;

// Oshxonadagi holat: yo'q / tayyorlanmoqda / tayyor (olib ketish kerak) / berildi
function kitchenState(o) {
  const ts = orderTickets(o);
  if (ts.some((k) => k.status === "ready")) return "ready";
  if (ts.some((k) => k.status === "new" || k.status === "cooking")) return "cooking";
  return ts.length ? "served" : "none";
}

function tableStatus(h, t) {
  const o = activeOrder(h, t);
  if (!o) return "free";
  const k = kitchenState(o);
  return k === "cooking" || k === "ready" ? k : "busy";
}
const TABLE_LABEL = { free: "Bo'sh", busy: "Band", cooking: "Oshxonada", ready: "Tayyor!" };

function orderStatus(o) {
  if (o.status === "paid") return ["To'langan", "green"];
  if (o.status === "cancelled") return ["Bekor qilingan", "red"];
  if (o.status === "refunded") return ["Qaytarilgan", "red"];
  if (o.status === "split") return ["Bo'lib to'langan", "green"];
  return { none: ["Ochiq", "blue"], cooking: ["Oshxonada", "orange"], ready: ["Tayyor", "purple"], served: ["Berildi", "blue"] }[kitchenState(o)];
}

// ---------------------------------------------------------------------
// 7. KASSA
// ---------------------------------------------------------------------
let selHall = null;
let selTable = null;
let selCat = "all";
let menuSearch = "";
let lastAdded = null;
let pay = newPay();
function newPay() { return { method: "naqd", given: "", card: "", cash: "" }; }

// Ofitsiant paneli = kassa, lekin to'lov va chegirmasiz (faqat buyurtma olish va oshxonaga yuborish)
const isWaiter = () => view === "waiter";

function renderKassa() {
  if (!S.halls.some((h) => h.id === selHall)) selHall = (S.halls.find((h) => h.count > 0) || S.halls[0] || {}).id || null;
  if (selTable && selTable > hallOf(selHall).count) selTable = null;
  const mode = (selTable ? "order" : "tables") + (isWaiter() ? "-w" : "");
  const root = $("kassaRoot");
  if (!root || root.dataset.mode !== mode) {
    $("content").innerHTML = !selTable ? `
      <div id="kassaRoot" data-mode="${mode}">
        ${isWaiter() ? `<div id="kMine" class="card mine mb"></div>` : ""}
        <div id="kHalls" class="hall-tabs"></div>
        <div class="page-head">
          <div><h2 id="kHallTitle">Stollar</h2><p class="muted">Buyurtma olish uchun stolni tanlang</p></div>
          <div class="tstats" id="kTblStats"></div>
        </div>
        <div id="kTables" class="tables-page"></div>
      </div>` : `
      <div class="kassa order-mode ${isWaiter() ? "waiter" : ""}" id="kassaRoot" data-mode="${mode}">
        <div class="order-top">
          <button class="btn back-btn" onclick="backToTables()">← Stollar</button>
          <h2 id="kTitle"></h2>
          <span class="kbd-hint">Esc — stollarga qaytish</span>
        </div>
        <section class="panel menu-panel">
          <div class="search">${icon("search")}<input id="kSearch" placeholder="Taom qidirish..." oninput="menuSearch=this.value;renderKassaMenu()"></div>
          <div id="kCats" class="cats"></div>
          <div id="kMenu" class="prod-grid"></div>
        </section>
        <section class="panel order-panel" id="kOrder"></section>
        ${isWaiter() ? "" : `<section class="panel pay-bar" id="kPay"></section>`}
      </div>`;
    if ($("kSearch")) $("kSearch").value = menuSearch;
  }
  if (!selTable) { renderKassaTables(); return; }
  $("kTitle").textContent = placeName(selHall, selTable);
  renderKassaMenu();
  renderOrderPanel();
  if (!isWaiter()) renderPayBar();
}

// Ofitsiantning bugungi ishi va puli (xizmat haqi)
function renderMine() {
  if (!$("kMine")) return;
  const today = { from: todayYmd(), to: todayYmd() };
  const mine = S.orders.filter((o) => Shared.waiterOf(o).id === me.id || (Shared.waiterOf(o).id == null && o.createdBy === me.name));
  const paid = mine.filter((o) => o.status === "paid" && inRange(o.paidAt, today));
  const open = mine.filter((o) => o.status === "open");
  const earned = paid.reduce((s, o) => s + (o.serviceSum || 0), 0);
  const waiting = open.reduce((s, o) => s + calc(o).svc, 0);
  $("kMine").innerHTML = `
    <div class="mine-item main"><span>${icon("wallet")} Bugungi pulim (xizmat haqi)</span><b>${money(earned)}</b></div>
    <div class="mine-item"><span>Yopilgan stollar</span><b>${paid.length} ta</b><small>${money(paid.reduce((s, o) => s + o.total, 0))} savdo</small></div>
    <div class="mine-item"><span>Hozir ochiq stollarim</span><b>${open.length} ta</b><small>yopilsa +${money(waiting)}</small></div>`;
}

function renderKassaTables() {
  renderMine();
  const openIn = (h) => S.orders.filter((o) => o.status === "open" && o.hall === h).length;
  $("kHalls").innerHTML = S.halls.map((h) => `
    <button class="hall-tab ${h.id === selHall ? "active" : ""}" onclick="selHall='${h.id}';renderKassa()">
      ${icon("seat")}<span><b>${esc(h.name)}</b><small>${h.count} ta stol${h.service ? ` · ${h.service}% xizmat` : ""}</small></span>
      ${openIn(h.id) ? `<em>${openIn(h.id)}</em>` : ""}
    </button>`).join("") || `<div class="muted">Joy yo'q — "Stollar" bo'limida zal qo'shing</div>`;
  const hall = hallOf(selHall);
  $("kHallTitle").textContent = selHall ? hall.name : "Stollar";
  const counts = { free: 0, busy: 0, cooking: 0, ready: 0 };
  let html = "";
  for (let t = 1; t <= hall.count; t++) {
    const st = tableStatus(selHall, t);
    const o = activeOrder(selHall, t);
    counts[st]++;
    const qty = o ? o.items.reduce((s, i) => s + i.qty, 0) : 0;
    html += `<button class="tcard ${st}" onclick="selectTable(${t})">
      <span class="tcard-top"><span class="tcard-no">${t}</span><span class="tcard-st">${TABLE_LABEL[st]}</span></span>
      ${o ? `<span class="tcard-sum">${money(calc(o).total)}</span>
             <span class="tcard-meta">${qty} ta taom · ${mins(o.createdAt)} daq · ${esc(o.createdBy || "")}</span>`
          : `<span class="tcard-meta">Stol bo'sh</span>`}
    </button>`;
  }
  $("kTables").innerHTML = html || `<div class="empty-state"><b>Bu joyda stol yo'q</b><span>"Stollar" bo'limida stollar sonini kiriting</span></div>`;
  $("kTblStats").innerHTML = `
    <span class="tstat free"><i></i>Bo'sh <b>${counts.free}</b></span>
    <span class="tstat busy"><i></i>Band <b>${counts.busy}</b></span>
    <span class="tstat order"><i></i>Oshxonada <b>${counts.cooking}</b></span>
    <span class="tstat ready"><i></i>Tayyor <b>${counts.ready}</b></span>`;
}

function backToTables() {
  selTable = null;
  pay = newPay();
  renderKassa();
}

function selectTable(t) {
  if (selTable !== t) { selCat = "all"; menuSearch = ""; if ($("kSearch")) $("kSearch").value = ""; }
  selTable = t;
  pay = newPay();
  renderKassa();
}

function renderKassaMenu() {
  // Menyu faqat stol tanlangandan keyin ochiladi
  $("kSearch").parentElement.classList.toggle("hidden", !selTable);
  if (!selTable) {
    $("kCats").innerHTML = "";
    $("kMenu").innerHTML = `<div class="empty-state menu-closed">${icon("book")}<b>Menyu yopiq</b><span>Menyuni ochish uchun stolni tanlang</span></div>`;
    return;
  }
  const q = menuSearch.trim().toLowerCase();
  const count = (cid) => S.menu.filter((m) => cid === "all" || m.catId === cid).length;
  if (selCat !== "all" && !S.categories.some((c) => c.id === selCat)) selCat = "all";
  $("kCats").innerHTML = [{ id: "all", name: "Barchasi" }, ...S.categories].map((c) =>
    `<button class="cat ${c.id === selCat ? "active" : ""}" onclick="selCat='${c.id}';renderKassaMenu()">${esc(c.name)}<em>${count(c.id)}</em></button>`).join("");

  const o = curOrder();
  const list = S.menu.filter((m) => (selCat === "all" || m.catId === selCat) && (!q || m.name.toLowerCase().includes(q)));
  $("kMenu").innerHTML = list.map((p) => {
    const inOrder = o ? o.items.filter((i) => i.pid === p.id).reduce((s, i) => s + i.qty, 0) : 0;
    const off = !p.available;
    return `<button class="prod ${off ? "off" : ""} ${p.id === lastAdded ? "added" : ""}" onclick="addProduct(${p.id})" ${off ? `disabled title="Mavjud emas"` : ""}>
      <div class="prod-body"><b>${esc(p.name)}</b><span>${money(p.price)}</span></div>
      ${inOrder ? `<em class="prod-qty">${inOrder}</em>` : ""}
    </button>`;
  }).join("") || `<div class="empty-state small"><span>Taom topilmadi</span></div>`;
}

async function addProduct(pid) {
  if (!selTable) { toast("Avval stolni tanlang", "warn"); return; }
  const p = S.menu.find((m) => m.id === pid);
  if (!p || !p.available) return;
  lastAdded = pid;
  await act("order.add", { hall: selHall, table: selTable, pid });
  lastAdded = null;
}

function changeQty(idx, d) {
  const o = curOrder();
  const it = o && o.items[idx];
  if (!it) return;
  if (it.qty + d < it.sent && !confirm(`"${it.name}" oshxonaga yuborilgan. Baribir kamaytirilsinmi?`)) return;
  act("order.qty", { orderId: o.id, idx, pid: it.pid, delta: d });
}

function removeItem(idx) {
  const o = curOrder();
  const it = o && o.items[idx];
  if (!it) return;
  if (it.sent && !confirm(`"${it.name}" oshxonaga yuborilgan. Buyurtmadan o'chirilsinmi?`)) return;
  act("order.remove", { orderId: o.id, idx, pid: it.pid });
}

function setNote(v) {
  const o = curOrder();
  if (o && o.note !== v.trim()) act("order.note", { orderId: o.id, note: v });
}

function setDiscount(p) {
  const o = curOrder();
  if (o) act("order.discount", { orderId: o.id, discount: Math.round(num(p)) });
}

function renderOrderPanel() {
  const el = $("kOrder");
  if (!selTable) {
    el.innerHTML = `<div class="empty-state">${icon("cash")}<b>Stol tanlanmagan</b><span>Buyurtma boshlash uchun stolni tanlang</span></div>`;
    return;
  }
  const o = curOrder();
  const st = o ? orderStatus(o) : ["Yangi", "gray"];
  const items = o ? o.items : [];
  const c = o ? calc(o) : { sub: 0, disc: 0, svc: 0, svcPct: hallOf(selHall).service || 0, total: 0 };
  const unsent = items.some((i) => i.qty > i.sent);
  const dis = o ? "" : "disabled";
  el.innerHTML = `
    <div class="order-head">
      <div><h3>Buyurtma</h3><span class="muted">${o ? `#${o.no} · ${tm(o.createdAt)} da ochilgan` : "Yangi buyurtma"}</span></div>
      <div class="row">
        ${o && !isWaiter() ? `<button class="btn sm" onclick="openMove()" title="Buyurtmani boshqa stolga ko'chirish">${icon("seat")} Stolni almashtirish</button>` : ""}
        <span class="badge ${st[1]}">${st[0]}</span>
      </div>
    </div>
    ${o ? waiterRowHtml(o) : ""}
    <div class="order-items">
      ${items.length ? items.map((i, idx) => `
        <div class="oi">
          <div class="oi-info"><b title="${esc(i.name)}">${esc(i.name)}</b>
            <span>${money(i.price)}${i.sent ? ` · <em class="sent">🍳 ${i.sent} yuborilgan</em>` : ""}</span></div>
          <div class="qty"><button onclick="changeQty(${idx},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${idx},1)">+</button></div>
          <div class="oi-sum">${fmt(i.price * i.qty)}</div>
          <button class="icon-btn" title="O'chirish" onclick="removeItem(${idx})">${icon("trash")}</button>
        </div>`).join("") : `<div class="empty-state small"><span>Menyudan taom tanlang</span></div>`}
    </div>
    <div class="order-foot">
      <textarea rows="2" placeholder="Buyurtma izohi (masalan: achchiq bo'lmasin)" onchange="setNote(this.value)" ${dis}>${esc(o ? o.note : "")}</textarea>
      ${isWaiter() ? "" : `<div class="disc-row"><span>Chegirma</span>
        <div class="disc-btns">
          ${[0, 5, 10, 15].map((p) => `<button class="chip-btn ${o && o.discount === p ? "active" : ""}" onclick="setDiscount(${p})" ${dis}>${p}%</button>`).join("")}
          <input type="number" min="0" max="100" value="${o ? o.discount : 0}" onchange="setDiscount(this.value)" ${dis}>%
        </div>
      </div>`}
      <div class="sum-row"><span>Oraliq summa</span><span>${money(c.sub)}</span></div>
      <div class="sum-row"><span>Chegirma</span><span class="red-t">− ${money(c.disc)}</span></div>
      ${c.svcPct ? `<div class="sum-row"><span>Xizmat haqi (${c.svcPct}%)</span><span>+ ${money(c.svc)}</span></div>` : ""}
      <div class="sum-row total"><span>Jami</span><span>${money(c.total)}</span></div>
      <div class="foot-btns">
        <button class="btn primary big" onclick="sendToKitchen()" ${unsent ? "" : "disabled"}>${icon("chef")} Oshxonaga yuborish</button>
        <button class="btn big bill-btn" onclick="printBill()" ${o && o.items.length ? "" : "disabled"} title="To'lovdan oldin mijozga hisob">${icon("print")} Hisob cheki</button>
      </div>
      ${isWaiter() && o && !unsent ? `<p class="muted waiter-hint">To'lovni kassir qabul qiladi.</p>` : ""}
    </div>`;
}

// Buyurtmaga xizmat qilayotgan ofitsiant (xizmat haqi shu xodimga yoziladi)
function waiterRowHtml(o) {
  const w = Shared.waiterOf(o);
  if (isWaiter()) return `<div class="waiter-row">${icon("users")}<span>Ofitsiant: <b>${esc(w.name)}</b></span></div>`;
  const list = S.staff.filter((u) => u.role !== "oshpaz").sort((a, b) => (a.role === "ofitsiant" ? 0 : 1) - (b.role === "ofitsiant" ? 0 : 1));
  return `<div class="waiter-row">${icon("users")}<span>Ofitsiant:</span>
    <select onchange="act('order.waiter',{orderId:${o.id},staffId:Number(this.value)})">
      ${w.id == null ? `<option value="" selected>${esc(w.name)}</option>` : ""}
      ${list.map((u) => `<option value="${u.id}" ${u.id === w.id ? "selected" : ""}>${esc(u.name)}${u.role === "ofitsiant" ? "" : ` (${ROLES[u.role]})`}</option>`).join("")}
    </select></div>`;
}

// Oshxonaga yuborish: Oshxona paneliga chipta tushadi (printer yoqilgan bo'lsa chek ham chiqadi)
async function sendToKitchen() {
  const o = curOrder();
  if (!o) return;
  const r = await act("order.kitchen", { orderId: o.id });
  if (!r) return;
  const pc = S.settings.printer;
  if (pc.kitchenPrint && pc.kitchenPrintAt !== "oshxona" && me.role !== "ofitsiant") printKitchenTicket(r.ticket);
  toast(`${placeName(o.hall, o.table)} oshxonaga yuborildi`, "success");
}

// --- To'lov ---
const payNums = (total) => Shared.payNums(pay.method, total, pay.given, pay.card, pay.cash);

function renderPayBar() {
  const o = curOrder();
  const total = o ? calc(o).total : 0;
  // Buyurtma yo'q bo'lsa — to'lov paneli bo'sh, chalg'itmaydi
  if (!o || !o.items.length) {
    $("kPay").innerHTML = `<div class="pay-empty">${icon("cash")}<span>${selTable ? "Menyudan taom qo'shing — to'lov shu yerda chiqadi" : "To'lov uchun stol va taom tanlang"}</span></div>`;
    return;
  }
  const enter = `onkeydown="if(event.key==='Enter')confirmPayment()"`;
  const inputs = {
    naqd: `<label>Mijoz bergan pul<input id="pGiven" inputmode="numeric" placeholder="0" value="${esc(pay.given)}" oninput="pay.given=this.value;updatePayNums()" ${enter}></label>
      <div class="quick">${[["Aniq", total], ["50 000", 50000], ["100 000", 100000], ["200 000", 200000]].map(([l, v]) =>
        `<button class="chip-btn" onclick="pay.given='${v}';renderPayBar()">${l}</button>`).join("")}</div>`,
    karta: `<div class="muted pay-note">${icon("card")} Terminal orqali <b>${money(total)}</b> o'tkazing va to'lovni tasdiqlang.</div>`,
    aralash: `<label>Karta orqali<input id="pCard" inputmode="numeric" placeholder="0" value="${esc(pay.card)}" oninput="pay.card=this.value;updatePayNums()" ${enter}></label>
      <label>Naqd pul<input id="pCash" inputmode="numeric" placeholder="0" value="${esc(pay.cash)}" oninput="pay.cash=this.value;updatePayNums()" ${enter}></label>
      <button class="chip-btn" onclick="fillMixed()">Qolganini naqd</button>`
  };
  $("kPay").innerHTML = `
    <div class="pay-methods">
      ${[["naqd", "Naqd pul", "cash"], ["karta", "Karta", "card"], ["aralash", "Aralash", "split"]].map(([k, l, ic]) =>
        `<button class="pm ${pay.method === k ? "active" : ""}" onclick="pay.method='${k}';renderPayBar()">${icon(ic)}<span>${l}</span></button>`).join("")}
      <button class="pm split-pm" onclick="openSplit()" title="Har kim o'z taomini alohida to'laydi">${icon("users")}<span>Bo'lib to'lash</span></button>
    </div>
    <div class="pay-inputs">${inputs[pay.method]}</div>
    <div class="pay-sums">
      <div><span>To'lanadigan</span><b>${money(total)}</b></div>
      <div><span>Berilgan</span><b id="pPaid"></b></div>
      <div><span id="pChangeLbl">Qaytim</span><b id="pChange"></b></div>
    </div>
    <button class="btn green pay-btn" onclick="confirmPayment()" title="Enter">${icon("check")} To'lovni tasdiqlash</button>`;
  updatePayNums();
}

function updatePayNums() {
  const o = curOrder();
  const total = o ? calc(o).total : 0;
  const n = payNums(total);
  $("pPaid").textContent = money(n.paid);
  const short = n.change < 0;
  $("pChangeLbl").textContent = short ? "Yetmaydi" : "Qaytim";
  $("pChange").textContent = money(Math.abs(n.change));
  $("pChange").className = short ? "red-t" : "green-t";
}

function fillMixed() {
  const o = curOrder();
  if (!o) return;
  pay.cash = String(Math.max(0, calc(o).total - num(pay.card)));
  renderPayBar();
}

let paying = false;
async function confirmPayment() {
  const o = curOrder();
  if (!o || !o.items.length || paying) return;
  const c = calc(o);
  const n = payNums(c.total);
  if (!n.ok) {
    toast(pay.method === "aralash" && n.card > c.total ? "Karta summasi jami summadan oshmasligi kerak" : "To'lov summasi yetarli emas", "error");
    return;
  }
  paying = true; // ikki marta bosilsa ikki marta to'lanmasin
  const r = await act("order.pay", { orderId: o.id, method: pay.method, given: pay.given, card: pay.card, cash: pay.cash });
  paying = false;
  if (!r) return;
  selTable = null;
  pay = newPay();
  renderAll();
  showReceipt(r.orderId, true);
  if (S.settings.printer.autoPrint) setTimeout(() => printReceipt(r.orderId), 300);
}

// Stolni almashtirish: bo'sh stolni tanlash oynasi
let moveHall = null;
function openMove() {
  const o = curOrder();
  if (!o) return;
  moveHall = moveHall && S.halls.some((h) => h.id === moveHall) ? moveHall : o.hall;
  const h = hallOf(moveHall);
  const tables = Array.from({ length: h.count }, (_, i) => i + 1);
  openModal(`
    <div class="modal-title"><h2>Stolni almashtirish</h2></div>
    <p class="muted">#${o.no} buyurtma (${esc(placeName(o.hall, o.table))}) qaysi stolga ko'chirilsin?</p>
    <div class="seg move-halls">${S.halls.map((x) => `<button class="${x.id === moveHall ? "active" : ""}" onclick="moveHall='${x.id}';openMove()">${esc(x.name)}</button>`).join("")}</div>
    <div class="move-grid">${tables.map((t) => {
      const busy = !!activeOrder(moveHall, t);
      return `<button class="move-t ${busy ? "busy" : ""}" ${busy ? "disabled" : ""} onclick="doMove('${moveHall}',${t})">${t}<small>${busy ? "band" : "bo'sh"}</small></button>`;
    }).join("") || `<div class="muted">Bu joyda stol yo'q</div>`}</div>
    <div class="modal-actions"><button class="btn" onclick="closeModal()">Bekor qilish</button></div>`);
}

async function doMove(hall, table) {
  const o = curOrder();
  if (!o) return;
  if (await act("order.move", { orderId: o.id, hall, table })) {
    closeModal();
    selHall = hall;
    selTable = table;
    renderAll();
    toast(`Buyurtma ${placeName(hall, table)} ga ko'chirildi`, "success");
  }
}

// Mijozga to'lovdan oldin hisob cheki ("TO'LANMAGAN")
function printBill() {
  const o = curOrder();
  if (o && o.items.length) printHtml(receiptHtml(o));
}

// --- Hisobni bo'lib to'lash: har kim o'z taomini alohida to'laydi ---
let split = null;

function openSplit() {
  const o = curOrder();
  if (!o || !o.items.length) return;
  split = { orderId: o.id, sel: o.items.map(() => 0), method: "naqd", given: "", people: 2 };
  openModal(`<div id="splitBox"></div>`, "lg");
  renderSplit();
}

function splitOrder() {
  const o = curOrder();
  return o && split && o.id === split.orderId ? o : null;
}

function renderSplit() {
  const o = splitOrder();
  if (!o) { closeModal(); return; }
  if (split.sel.length !== o.items.length) split.sel = o.items.map((_, i) => Math.min(split.sel[i] || 0, o.items[i].qty));
  const part = { hall: o.hall, discount: o.discount, items: o.items.map((i, k) => ({ ...i, qty: split.sel[k] })).filter((i) => i.qty > 0) };
  const c = calc(part);
  const all = calc(o).total;
  const n = Shared.payNums(split.method, c.total, split.given);
  $("splitBox").innerHTML = `
    <div class="modal-title"><h2>Bo'lib to'lash — ${esc(placeName(o.hall, o.table))}</h2></div>
    <p class="muted">Mijoz to'laydigan taomlarni tanlang. Qolgani stolda ochiq qoladi va keyin to'lanadi.</p>
    <div class="split-list">
      ${o.items.map((i, k) => `
        <div class="split-row ${split.sel[k] ? "on" : ""}">
          <div class="grow"><b>${esc(i.name)}</b><small>${money(i.price)} · stolda ${i.qty} ta</small></div>
          <div class="qty"><button onclick="splitQty(${k},-1)">−</button><b>${split.sel[k]}</b><button onclick="splitQty(${k},1)">+</button></div>
          <button class="chip-btn" onclick="split.sel[${k}]=${i.qty};renderSplit()">Hammasi</button>
          <div class="oi-sum">${fmt(i.price * split.sel[k])}</div>
        </div>`).join("")}
    </div>
    <div class="split-foot">
      <div>
        ${c.disc ? `<div class="sum-row"><span>Chegirma (${o.discount}%)</span><span class="red-t">− ${money(c.disc)}</span></div>` : ""}
        ${c.svcPct ? `<div class="sum-row"><span>Xizmat haqi (${c.svcPct}%)</span><span>+ ${money(c.svc)}</span></div>` : ""}
        <div class="sum-row total"><span>Bu mijoz to'laydi</span><span>${money(c.total)}</span></div>
        <div class="split-even">
          <span>Teng bo'lish: stol jami ${money(all)} ÷</span>
          <input type="number" min="2" max="30" value="${split.people}" oninput="split.people=Math.max(2,Number(this.value)||2);$('splitEach').textContent=money(Math.ceil(${all}/split.people/100)*100)">
          <span>kishi = har biri <b id="splitEach">${money(Math.ceil(all / split.people / 100) * 100)}</b></span>
        </div>
      </div>
      <div>
        <div class="seg">${[["naqd", "Naqd"], ["karta", "Karta"]].map(([k, l]) => `<button class="${split.method === k ? "active" : ""}" onclick="split.method='${k}';renderSplit()">${l}</button>`).join("")}</div>
        ${split.method === "naqd" ? `<label class="muted split-given">Mijoz bergan pul<input id="splitGiven" inputmode="numeric" placeholder="0" value="${esc(split.given)}" oninput="split.given=this.value;$('splitChange').textContent=money(Math.max(0,Shared.num(this.value)-${c.total}))"></label>
          <div class="muted">Qaytim: <b id="splitChange">${money(Math.max(0, n.change))}</b></div>` : `<div class="muted split-given">Terminal orqali <b>${money(c.total)}</b></div>`}
      </div>
    </div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Bekor qilish</button>
      <button class="btn green" onclick="confirmSplit()" ${c.total > 0 ? "" : "disabled"}>${icon("check")} ${money(c.total)} to'lovni qabul qilish</button>
    </div>`;
}

function splitQty(k, d) {
  const o = splitOrder();
  if (!o) return;
  split.sel[k] = Math.min(o.items[k].qty, Math.max(0, split.sel[k] + d));
  renderSplit();
}

async function confirmSplit() {
  const o = splitOrder();
  if (!o || paying) return;
  const parts = o.items.map((i, k) => ({ pid: i.pid, price: i.price, qty: split.sel[k] })).filter((x) => x.qty > 0);
  if (!parts.length) return toast("To'lash uchun taom tanlang", "warn");
  if (split.method === "naqd" && !split.given) split.given = String(calc({ hall: o.hall, discount: o.discount, items: o.items.map((i, k) => ({ ...i, qty: split.sel[k] })) }).total);
  paying = true;
  const r = await act("order.payPart", { orderId: o.id, parts, method: split.method, given: split.given });
  paying = false;
  if (!r) return;
  closeModal();
  if (!r.remaining) { selTable = null; renderAll(); }
  pay = newPay();
  showReceipt(r.orderId, true);
  if (S.settings.printer.autoPrint) setTimeout(() => printReceipt(r.orderId), 300);
}

// --- Chek ---
function receiptHtml(o, cfg = S.settings.printer, info = S.settings) {
  const c = calc(o);
  const p = o.payment;
  return `<div class="rc">
    <div class="rc-c"><b class="rc-name">${esc(info.name)}</b>
      ${cfg.header ? `<div>${esc(cfg.header)}</div>` : ""}
      ${cfg.showAddress && info.address ? `<div>${esc(info.address)}</div>` : ""}
      ${cfg.showPhone && info.phone ? `<div>${esc(info.phone)}</div>` : ""}</div>
    <hr>
    ${!o.paidAt ? `<div class="rc-c rc-bill">HISOB (to'lov uchun)</div>` : ""}
    <div class="rc-l"><span>Buyurtma</span><span>#${o.no}</span></div>
    ${o.splitFrom ? `<div class="rc-l"><span>Bo'lib to'lov</span><span>#${o.splitFrom} dan</span></div>` : ""}
    <div class="rc-l"><span>Joy</span><span>${esc(placeName(o.hall, o.table))}</span></div>
    <div class="rc-l"><span>Sana</span><span>${dt(o.paidAt || o.createdAt)}</span></div>
    ${Shared.waiterOf(o).name !== "—" ? `<div class="rc-l"><span>Ofitsiant</span><span>${esc(Shared.waiterOf(o).name)}</span></div>` : ""}
    ${cfg.showCashier && o.cashierName ? `<div class="rc-l"><span>Kassir</span><span>${esc(o.cashierName)}</span></div>` : ""}
    <hr>
    ${o.items.map((i) => `<div class="rc-item"><div>${esc(i.name)}</div><div class="rc-l"><span>${i.qty} × ${fmt(i.price)}</span><span>${fmt(i.qty * i.price)}</span></div></div>`).join("")}
    <hr>
    <div class="rc-l"><span>Oraliq summa</span><span>${fmt(c.sub)}</span></div>
    ${c.disc ? `<div class="rc-l"><span>Chegirma (${o.discount}%)</span><span>−${fmt(c.disc)}</span></div>` : ""}
    ${c.svc ? `<div class="rc-l"><span>Xizmat haqi (${c.svcPct}%)</span><span>+${fmt(c.svc)}</span></div>` : ""}
    <div class="rc-l rc-total"><span>JAMI</span><span>${money(c.total)}</span></div>
    ${p ? `
      <div class="rc-l"><span>To'lov turi</span><span>${PAY_LABEL[p.method]}</span></div>
      ${p.method === "aralash" ? `<div class="rc-l"><span>· Karta</span><span>${fmt(p.card)}</span></div><div class="rc-l"><span>· Naqd</span><span>${fmt(p.given - p.card)}</span></div>` : ""}
      ${p.method !== "karta" ? `<div class="rc-l"><span>Berildi</span><span>${fmt(p.given)}</span></div><div class="rc-l"><span>Qaytim</span><span>${fmt(p.change)}</span></div>` : ""}` : `<div class="rc-c">— TO'LANMAGAN —</div>`}
    <hr>
    <div class="rc-c">${esc(info.receiptFooter)}</div>
  </div>`;
}

// Oshxona uchun qisqa chek (narxsiz)
function kitchenTicketHtml(k) {
  return `<div class="rc">
    <div class="rc-c"><b class="rc-name">OSHXONA</b></div><hr>
    <div class="rc-l rc-total"><span>${esc(placeName(k.hall, k.table))}</span><span>#${k.orderNo}</span></div>
    <div class="rc-l"><span>Vaqt</span><span>${dt(k.createdAt)}</span></div><hr>
    ${k.items.map((i) => `<div class="rc-l rc-kitchen"><span>${esc(i.name)}</span><b>× ${i.qty}</b></div>`).join("")}
    ${k.note ? `<hr><div>Izoh: ${esc(k.note)}</div>` : ""}
  </div>`;
}

function printKitchenTicket(k) {
  printHtml(kitchenTicketHtml(k), { ...S.settings.printer, copies: 1 });
}

// ---- Tayyor taomni ofitsiantga topshirish ----
function ticketWaiter(k) {
  if (k.waiterName) return k.waiterName;
  const o = S.orders.find((x) => x.id === k.orderId);
  return o ? Shared.waiterOf(o).name : "";
}
function ticketWaiterId(k) {
  if (k.waiterId != null) return k.waiterId;
  const o = S.orders.find((x) => x.id === k.orderId);
  return o ? Shared.waiterOf(o).id : null;
}

// Ofitsiant: o'z stollari (yoki ofitsianti belgilanmagan), kassir: hammasi
function myReadyTickets() {
  if (!me || !["ofitsiant", "kassir"].includes(me.role)) return [];
  const openIds = new Set(S.orders.filter((o) => o.status === "open").map((o) => o.id)); // to'langan stollarniki kerak emas
  return S.tickets.filter((k) => k.status === "ready" && openIds.has(k.orderId) && (me.role === "kassir" || ticketWaiterId(k) === me.id || ticketWaiterId(k) == null))
    .sort((a, b) => new Date(a.readyAt || a.createdAt) - new Date(b.readyAt || b.createdAt));
}

let readyKnown = null;
function renderReadyDock() {
  const el = $("readyDock");
  const list = myReadyTickets();
  // Yangi tayyor buyurtma kelsa — ovoz va tebranish
  const ids = new Set(list.map((k) => k.id));
  if (readyKnown && list.some((k) => !readyKnown.has(k.id))) readyAlert();
  readyKnown = me ? ids : null;
  el.classList.toggle("hidden", !list.length);
  if (!list.length) { el.innerHTML = ""; return; }
  el.innerHTML = `
    <div class="ready-head">${icon("chef")} Oshxonada tayyor <em>${list.length}</em></div>
    ${list.map((k) => `
      <div class="ready-card">
        <div class="ready-top"><b>${esc(placeName(k.hall, k.table))}</b><span class="muted">#${k.orderNo} · ${mins(k.readyAt || k.createdAt)} daq oldin</span></div>
        <div class="ready-items">${k.items.map((i) => `${i.qty}× ${esc(i.name)}`).join(", ")}</div>
        ${me.role === "kassir" && ticketWaiter(k) ? `<div class="muted ready-w">Ofitsiant: ${esc(ticketWaiter(k))}</div>` : ""}
        <button class="btn green full" onclick="pickUp(${k.id})">${icon("check")} Oldim — mijozga olib ketyapman</button>
      </div>`).join("")}`;
}

async function pickUp(id) {
  if (await act("ticket.set", { id, status: "served" })) toast("Topshirildi", "success");
}

function readyAlert() {
  try {
    const ctx = readyAlert.ctx || (readyAlert.ctx = new (window.AudioContext || window.webkitAudioContext)());
    [0, 0.25].forEach((t) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.25, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.2);
    });
  } catch (e) { /* ovoz o'chiq bo'lishi mumkin */ }
  try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) {}
  toast("Oshxonada buyurtma tayyor — olib keting!", "success");
}

// Oshxona ekranida avtomatik chek: yangi kelgan chiptalar shu qurilma printeridan chiqadi.
// Qaysi chiptalar chiqarilgani shu qurilmada eslab qolinadi (qayta chiqmasin).
const KPRINT_KEY = "kafe_pro_kitchen_printed";
let kitchenSeen = null;
function kitchenAutoPrint() {
  const pc = S.settings.printer;
  if (!me || view !== "kitchen" || !pc.kitchenPrint || pc.kitchenPrintAt !== "oshxona") { kitchenSeen = null; return; }
  const fresh = S.tickets.filter((k) => k.status === "new");
  if (kitchenSeen === null) {
    // ekran ochilganda eski chiptalarni chiqarmaymiz — faqat bundan keyin kelganlarini
    let saved = [];
    try { saved = JSON.parse(lsGet(KPRINT_KEY) || "[]"); } catch (e) {}
    kitchenSeen = new Set([...saved, ...fresh.map((k) => k.id)]);
  }
  const todo = fresh.filter((k) => !kitchenSeen.has(k.id));
  if (!todo.length) return;
  todo.forEach((k) => kitchenSeen.add(k.id));
  lsSet(KPRINT_KEY, JSON.stringify([...kitchenSeen].slice(-200)));
  printHtml(todo.map(kitchenTicketHtml).join('<div style="page-break-after: always"></div>'), { ...pc, copies: 1 });
}

// Printerga yuborish: qog'oz kengligi, shrift va nusxa soni sozlamalardan olinadi
function printHtml(html, cfg = S.settings.printer) {
  const w = cfg.paper === "58" ? 48 : 72;
  $("printStyle").textContent = `@media print {
    @page { size: ${cfg.paper}mm auto; margin: ${cfg.paper === "58" ? 2 : 3}mm; }
    .print-area { width: ${w}mm; font-size: ${cfg.fontSize}px; }
  }`;
  const copies = Math.min(5, Math.max(1, cfg.copies || 1));
  $("printArea").innerHTML = Array.from({ length: copies }, () => `<div class="print-copy">${html}</div>`).join("");
  window.print();
}

function showReceipt(id, success) {
  const o = findOrder(id);
  if (!o) return;
  openModal(`
    ${success ? `<div class="success-banner">${icon("check")}<div><b>To'lov muvaffaqiyatli qabul qilindi</b>
      <span>${money(o.total)} · ${PAY_LABEL[o.payment.method]}${o.payment.change > 0 ? ` · Qaytim: ${money(o.payment.change)}` : ""}</span></div></div>`
      : `<div class="modal-title"><h2>Buyurtma #${o.no}</h2><span class="badge ${orderStatus(o)[1]}">${orderStatus(o)[0]}</span></div>`}
    <div class="receipt-paper">${receiptHtml(o)}</div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal();go(firstAllowed())">Bosh sahifa</button>
      <button class="btn primary" onclick="printReceipt(${o.id})">${icon("print")} Chek chiqarish</button>
    </div>`, "sm");
}

function printReceipt(id) {
  const o = findOrder(id);
  if (!o) return;
  printHtml(receiptHtml(o));
}

// ---------------------------------------------------------------------
// 8. Sana filtri (Buyurtmalar sahifasi uchun)
// ---------------------------------------------------------------------
const ymd = (d) => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const todayYmd = () => ymd(new Date());
const F = { ord: { from: todayYmd(), to: todayYmd() }, adm: { from: todayYmd(), to: todayYmd() } };

// Ochiq va oxirgi 2 kun buyurtmalari doim yuklangan; eskiroq sanalar serverdan olinadi
const hist = { key: "", rev: -1, orders: [], loading: "" };
function ordersFor(f, rerender) {
  if (f.from && f.from >= ymd(Date.now() - 864e5)) return S.orders;
  const key = f.from + "|" + f.to;
  if ((hist.key !== key || hist.rev !== S.rev) && hist.loading !== key + "@" + S.rev) {
    const rev = S.rev;
    hist.loading = key + "@" + rev;
    api(`/api/orders?from=${encodeURIComponent(f.from)}&to=${encodeURIComponent(f.to)}`)
      .then((d) => { Object.assign(hist, { key, rev, orders: d.orders, loading: "" }); if (!isBusy() && rerender) rerender(); })
      .catch((e) => { hist.loading = ""; toast(e.message, "error"); });
  }
  if (hist.key !== key) return S.orders; // yuklanguncha hozirgilar ko'rinadi
  const m = new Map(hist.orders.map((o) => [o.id, o]));
  S.orders.forEach((o) => m.set(o.id, o)); // hozirgi holat yangiroq
  return [...m.values()];
}
const findOrder = (id) => S.orders.find((o) => o.id === id) || hist.orders.find((o) => o.id === id);
const inRange = (d, f) => { if (!d) return false; const k = ymd(d); return (!f.from || k >= f.from) && (!f.to || k <= f.to); };
const rangeLabel = (f) => !f.from && !f.to ? "Barcha vaqt" : f.from === f.to ? dateStr(f.from) : `${f.from ? dateStr(f.from) : "…"} — ${f.to ? dateStr(f.to) : "…"}`;

function dateBar(key, fn) {
  const f = F[key];
  const t = todayYmd(), y = ymd(Date.now() - 864e5), w = ymd(Date.now() - 6 * 864e5), m = ymd(Date.now() - 29 * 864e5);
  const quick = [["Bugun", t, t], ["Kecha", y, y], ["7 kun", w, t], ["30 kun", m, t], ["Hammasi", "", ""]];
  return `<div class="date-bar">
    ${quick.map(([l, a, b]) => `<button class="chip-btn ${f.from === a && f.to === b ? "active" : ""}" onclick="F.${key}={from:'${a}',to:'${b}'};${fn}()">${l}</button>`).join("")}
    <span class="date-range">
      <input type="date" value="${f.from}" onchange="F.${key}.from=this.value;${fn}()" title="Boshlanish sanasi">
      <span class="muted">—</span>
      <input type="date" value="${f.to}" onchange="F.${key}.to=this.value;${fn}()" title="Tugash sanasi">
    </span>
  </div>`;
}

// ---------------------------------------------------------------------
// 9. BUYURTMALAR
// ---------------------------------------------------------------------
let ordFilter = "all";
let ordSearch = "";
const orderDate = (o) => o.paidAt || o.refundedAt || o.cancelledAt || o.splitAt || o.createdAt;

function renderOrders() {
  const filters = [["all", "Barchasi"], ["open", "Ochiq"], ["paid", "To'langan"], ["cancelled", "Bekor qilingan"]];
  const q = ordSearch.trim().replace("#", "");
  // Ochiq buyurtmalar sanadan qat'i nazar doim ko'rinadi
  const base = ordersFor(F.ord, renderOrders)
    .filter((o) => o.status === "open" || inRange(orderDate(o), F.ord))
    .filter((o) => !q || String(o.no) === q);
  const list = base.filter((o) => ordFilter === "all" || o.status === ordFilter).sort((a, b) => b.id - a.id).slice(0, 300);
  // Tushum — faqat to'langan buyurtmalar (tanlangan sana bo'yicha)
  const paid = base.filter((o) => o.status === "paid");
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  const cash = paid.reduce((s, o) => s + o.payment.cash, 0);
  const card = paid.reduce((s, o) => s + o.payment.card, 0);
  const focused = document.activeElement && document.activeElement.id === "ordSearch";
  $("content").innerHTML = `
    <div class="page-head">
      <div><h2>Buyurtmalar</h2><p class="muted">${rangeLabel(F.ord)}</p></div>
      <div class="row">
        <div class="search">${icon("search")}<input id="ordSearch" placeholder="Buyurtma raqami" value="${esc(ordSearch)}" oninput="ordSearch=this.value;renderOrders()"></div>
        ${can("kassa") ? `<button class="btn primary" onclick="go('kassa')">${icon("plus")} Yangi buyurtma</button>` : ""}
      </div>
    </div>
    <div class="toolbar">${dateBar("ord", "renderOrders")}</div>
    <div class="kpis">
      <div class="card kpi c-green"><span>Tushum</span><b>${money(revenue)}</b></div>
      <div class="card kpi c-blue"><span>To'langan cheklar</span><b>${paid.length} ta</b></div>
      <div class="card kpi c-orange"><span>Naqd pul</span><b>${money(cash)}</b></div>
      <div class="card kpi c-purple"><span>Karta</span><b>${money(card)}</b></div>
    </div>
    <div class="filters mb">
      ${filters.map(([k, l]) => `<button class="chip-btn ${ordFilter === k ? "active" : ""}" onclick="ordFilter='${k}';renderOrders()">${l} <span>${base.filter((o) => k === "all" || o.status === k).length}</span></button>`).join("")}
    </div>
    <div class="ocards">
      ${list.map((o) => {
        const st = orderStatus(o);
        const qty = o.items.reduce((s, i) => s + i.qty, 0);
        return `<div class="ocard ${o.status}">
          <div class="ocard-top">
            <span class="avatar sm">${esc(initials(o.createdBy || "?"))}</span>
            <div class="ocard-who"><b>${esc(o.createdBy || "—")}</b><small>#${o.no}${o.splitFrom ? ` (#${o.splitFrom} dan)` : ""} · ${dt(orderDate(o))}</small></div>
            <span class="badge ${st[1]}">${st[0]}</span>
          </div>
          <div class="ocard-mid">
            <span class="muted">${esc(placeName(o.hall, o.table))} · ${qty} ta${o.payment ? " · " + PAY_LABEL[o.payment.method] : ""}</span>
            <b>${money(calc(o).total)}</b>
          </div>
          <div class="ocard-items">${o.items.slice(0, 4).map((i) => `${i.qty}× ${esc(i.name)}`).join(", ")}${o.items.length > 4 ? "…" : ""}</div>
          <div class="ocard-actions">
            <button class="btn sm green" onclick="showReceipt(${o.id})">${icon("eye")} Mahsulotlar</button>
            ${o.status === "open" && can("kassa") ? `<button class="btn sm primary" onclick="openInKassa('${o.hall}',${o.table})">Kassada ochish</button>` : ""}
            ${o.status === "open" && me.role === "admin" ? `<button class="btn sm red" onclick="cancelOrder(${o.id})">Bekor</button>` : ""}
          </div>
        </div>`;
      }).join("") || `<div class="empty-state"><b>Buyurtma topilmadi</b><span>Sana yoki filtrni o'zgartirib ko'ring</span></div>`}
    </div>`;
  if (focused) { const i = $("ordSearch"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
}

function openInKassa(h, t) {
  selHall = h;
  selTable = t;
  pay = newPay();
  go("kassa");
}

async function cancelOrder(id) {
  const o = findOrder(id);
  if (!o || !confirm(`Buyurtma #${o.no} (${placeName(o.hall, o.table)}) bekor qilinsinmi?`)) return;
  if (await act("order.cancel", { orderId: id })) toast("Buyurtma bekor qilindi", "warn");
}

// ---------------------------------------------------------------------
// 9a. ADMIN PANEL: savdo natijalari va qaysi taom qancha sotilgani
// ---------------------------------------------------------------------
let admSort = "qty";

function dishSales(f, rerender) {
  const paid = ordersFor(f, rerender).filter((o) => o.status === "paid" && inRange(o.paidAt, f));
  const rows = {};
  paid.forEach((o) => {
    const k = o.discount ? 1 - o.discount / 100 : 1;   // chegirma taomlarga taqsimlanadi
    o.items.forEach((i) => {
      const m = S.menu.find((x) => x.id === i.pid);
      const key = m ? "m" + m.id : "n" + i.name;
      const r = rows[key] || (rows[key] = { name: m ? m.name : i.name, cat: m ? (S.categories.find((c) => c.id === m.catId) || {}).name || "—" : "—", qty: 0, sum: 0, orders: 0 });
      r.qty += i.qty;
      r.sum += i.qty * i.price * k;
      r.orders++;
    });
  });
  const revenue = paid.reduce((s, o) => s + o.total, 0);
  return { paid, revenue, rows: Object.values(rows) };
}

function renderAdmin() {
  const f = F.adm;
  const d = dishSales(f, renderAdmin);
  const rows = d.rows.sort((a, b) => admSort === "sum" ? b.sum - a.sum : b.qty - a.qty);
  const totalQty = rows.reduce((s, r) => s + r.qty, 0);
  const itemsSum = rows.reduce((s, r) => s + r.sum, 0);
  const maxV = Math.max(1, ...rows.map((r) => admSort === "sum" ? r.sum : r.qty));
  const soldIds = new Set(rows.map((r) => r.name));
  const unsold = S.menu.filter((m) => !soldIds.has(m.name));
  const cats = {};
  rows.forEach((r) => { cats[r.cat] = (cats[r.cat] || 0) + r.sum; });
  const catList = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const open = S.orders.filter((o) => o.status === "open");
  $("content").innerHTML = `
    <div class="page-head">
      <div><h2>Admin panel</h2><p class="muted"><b>${rangeLabel(f)}</b> bo'yicha savdo</p></div>
      <div class="row">
        <button class="btn" onclick="printDishSales()">${icon("print")} Chek chiqarish</button>
        <button class="btn" onclick="go('menu')">${icon("book")} Menyu</button>
        <button class="btn primary" onclick="openDishForm()">${icon("plus")} Taom qo'shish</button>
      </div>
    </div>
    <div class="toolbar">${dateBar("adm", "renderAdmin")}</div>
    <div class="kpis">
      <div class="card kpi c-green"><span>Tushum</span><b>${money(d.revenue)}</b></div>
      <div class="card kpi c-blue"><span>Cheklar soni</span><b>${d.paid.length} ta</b><small>o'rtacha ${money(d.paid.length ? d.revenue / d.paid.length : 0)}</small></div>
      <div class="card kpi c-orange"><span>Sotilgan taomlar</span><b>${totalQty} ta</b><small>${rows.length} xil taom</small></div>
      <div class="card kpi c-purple"><span>Hozir ochiq stollar</span><b>${open.length} ta</b><small>${money(open.reduce((s, o) => s + calc(o).total, 0))}</small></div>
    </div>
    ${admOrdersHtml(f)}
    ${admWaitersHtml(f)}
    <div class="adm-grid">
      <div class="card table-wrap" style="padding:0">
        <div class="card-head adm-head">
          <h3>${icon("chart")} Qaysi taom qancha sotildi</h3>
          <div class="seg">
            <button class="${admSort === "qty" ? "active" : ""}" onclick="admSort='qty';renderAdmin()">Soni bo'yicha</button>
            <button class="${admSort === "sum" ? "active" : ""}" onclick="admSort='sum';renderAdmin()">Summa bo'yicha</button>
          </div>
        </div>
        <table class="tbl-list">
          <thead><tr><th>#</th><th>Taom</th><th>Kategoriya</th><th class="r">Soni</th><th class="r">Summa</th><th style="width:28%">Ulushi</th></tr></thead>
          <tbody>${rows.map((r, i) => {
            const v = admSort === "sum" ? r.sum : r.qty;
            return `<tr>
              <td class="muted">${i + 1}</td>
              <td><b>${esc(r.name)}</b></td>
              <td class="muted">${esc(r.cat)}</td>
              <td class="r"><b>${r.qty}</b> ta</td>
              <td class="r">${money(r.sum)}</td>
              <td><div class="hbar-track"><i style="width:${(v / maxV) * 100}%"></i></div>
                <small class="muted">${itemsSum ? Math.round((r.sum / itemsSum) * 100) : 0}% tushumdan</small></td>
            </tr>`;
          }).join("") || `<tr><td colspan="6"><div class="empty-state small"><b>Bu davrda sotuv yo'q</b><span>Boshqa sanani tanlab ko'ring</span></div></td></tr>`}</tbody>
        </table>
      </div>
      <div>
        <div class="card">
          <div class="card-head"><h3>Kategoriyalar bo'yicha</h3></div>
          ${catList.map(([n, v]) => `<div class="hbar"><div class="hbar-top"><span>${esc(n)}</span><b>${money(v)}</b></div><div class="hbar-track"><i class="green" style="width:${itemsSum ? (v / itemsSum) * 100 : 0}%"></i></div></div>`).join("") || `<div class="muted">Ma'lumot yo'q</div>`}
        </div>
        <div class="card mt">
          <div class="card-head"><h3>Sotilmagan taomlar</h3><span class="badge gray">${unsold.length}</span></div>
          ${unsold.length ? `<div class="unsold">${unsold.map((m) => `<button class="chip-btn" onclick="openDishForm(${m.id})" title="Tahrirlash">${esc(m.name)}</button>`).join("")}</div>` : `<div class="muted">Hamma taom sotilgan 👍</div>`}
        </div>
      </div>
    </div>`;
}

// Admin panel: buyurtmalar qabul qilingan vaqti bilan
function admOrdersHtml(f) {
  const list = ordersFor(f, renderAdmin).filter((o) => inRange(o.createdAt, f) || o.status === "open").sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const oneDay = f.from && f.from === f.to;
  const when = (d) => (oneDay ? tm(d) : dt(d));
  return `
    <div class="card mt mb table-wrap adm-orders" style="padding:0">
      <div class="card-head adm-head"><h3>${icon("clock")} Buyurtmalar — qabul qilingan vaqti</h3><span class="badge gray">${list.length} ta</span></div>
      <div class="adm-orders-scroll">
        <table class="tbl-list">
          <thead><tr><th>Qabul qilindi</th><th>№</th><th>Joy</th><th>Qabul qilgan</th><th>Taomlar</th><th class="r">Summa</th><th>Holat</th><th>Yopildi</th><th class="r">Davomiyligi</th><th></th></tr></thead>
          <tbody>${list.map((o) => {
            const st = orderStatus(o);
            const end = o.paidAt || o.cancelledAt;
            const dur = Math.max(0, Math.round((new Date(end || Date.now()) - new Date(o.createdAt)) / 60000));
            return `<tr>
              <td><b>${when(o.createdAt)}</b></td>
              <td>#${o.no}</td>
              <td>${esc(placeName(o.hall, o.table))}</td>
              <td>${esc(o.createdBy || "—")}</td>
              <td class="muted adm-items" title="${esc(o.items.map((i) => `${i.qty}× ${i.name}`).join(", "))}">${o.items.map((i) => `${i.qty}× ${esc(i.name)}`).join(", ")}</td>
              <td class="r"><b>${money(calc(o).total)}</b></td>
              <td><span class="badge ${st[1]}">${st[0]}</span></td>
              <td>${end ? when(end) : `<span class="muted">ochiq</span>`}</td>
              <td class="r">${dur} daq</td>
              <td class="r"><button class="btn sm" onclick="showReceipt(${o.id})" title="Ko'rish">${icon("eye")}</button></td>
            </tr>`;
          }).join("") || `<tr><td colspan="10"><div class="empty-state small"><span>Bu davrda buyurtma yo'q</span></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

// Admin panel: ofitsiantlar — kim nechta stolga xizmat qildi va qancha xizmat haqi oldi
function admWaitersHtml(f) {
  const paid = ordersFor(f, renderAdmin).filter((o) => o.status === "paid" && inRange(o.paidAt, f));
  const g = {};
  paid.forEach((o) => {
    const w = Shared.waiterOf(o);
    const r = g[w.name] || (g[w.name] = { name: w.name, n: 0, sales: 0, svc: 0 });
    r.n++; r.sales += o.total; r.svc += o.serviceSum || 0;
  });
  const rows = Object.values(g).sort((a, b) => b.svc - a.svc || b.sales - a.sales);
  const total = rows.reduce((s, r) => s + r.svc, 0);
  return `
    <div class="card mb table-wrap" style="padding:0">
      <div class="card-head adm-head"><h3>${icon("users")} Ofitsiantlar — xizmat haqi (ofitsiant puli)</h3><span class="badge green">Jami: ${money(total)}</span></div>
      <table class="tbl-list">
        <thead><tr><th>Ofitsiant</th><th class="r">Stollar (cheklar)</th><th class="r">Savdo</th><th class="r">Xizmat haqi — beriladigan pul</th></tr></thead>
        <tbody>${rows.map((r) => `<tr><td><b>${esc(r.name)}</b></td><td class="r">${r.n} ta</td><td class="r">${money(r.sales)}</td><td class="r"><b class="green-t">${money(r.svc)}</b></td></tr>`).join("")
          || `<tr><td colspan="4"><div class="empty-state small"><span>Bu davrda to'langan buyurtma yo'q</span></div></td></tr>`}</tbody>
      </table>
      ${!S.halls.some((h) => h.service) ? `<p class="muted adm-note">Xizmat haqi hamma joyda 0%. Ofitsiant puli hisoblanishi uchun "Stollar" bo'limida joylarga foiz qo'ying.</p>` : ""}
    </div>`;
}

function printDishSales() {
  const f = F.adm;
  const d = dishSales(f);
  const rows = d.rows.sort((a, b) => b.qty - a.qty);
  printHtml(`<div class="rc">
    <div class="rc-c"><b class="rc-name">${esc(S.settings.name)}</b><div>Sotilgan taomlar</div><div>${esc(rangeLabel(f))}</div></div><hr>
    ${rows.map((r) => `<div class="rc-l"><span>${esc(r.name)} × ${r.qty}</span><span>${fmt(r.sum)}</span></div>`).join("") || `<div class="rc-c">Sotuv yo'q</div>`}
    <hr>
    <div class="rc-l"><span>Cheklar</span><span>${d.paid.length}</span></div>
    <div class="rc-l rc-total"><span>TUSHUM</span><span>${money(d.revenue)}</span></div>
    <hr><div class="rc-c">${dt(nowIso())}</div>
  </div>`, { ...S.settings.printer, copies: 1 });
}

// ---------------------------------------------------------------------
// 9b. OSHXONA PANELI (oshpaz ekrani)
// ---------------------------------------------------------------------
function renderKitchen() {
  const cols = [["new", "Yangi", "blue"], ["cooking", "Tayyorlanmoqda", "orange"], ["ready", "Tayyor — ofitsiantga topshiring", "green"]];
  const next = { new: ["cooking", "Boshlash", "primary"], cooking: ["ready", "Tayyor", "orange"], ready: ["served", "Berildi", "green"] };
  $("content").innerHTML = `
    <div class="page-head"><div><h2>Oshxona</h2><p class="muted">Kassadan yuborilgan buyurtmalar shu yerga tushadi. Tugmani bosib holatini o'zgartiring.</p></div></div>
    <div class="kds">
      ${cols.map(([st, label, color]) => {
        const list = S.tickets.filter((k) => k.status === st).sort((a, b) => a.id - b.id);
        return `<div class="kds-col">
          <div class="kds-head ${color}"><b>${label}</b><span>${list.length}</span></div>
          ${list.map((k) => `
            <div class="ticket ${st} ${st !== "ready" && mins(k.createdAt) >= 20 ? "late" : ""}">
              <div class="ticket-top"><b>${esc(placeName(k.hall, k.table))}</b><span class="muted">#${k.orderNo} · ${tm(k.createdAt)} · ${mins(k.createdAt)} daq</span></div>
              <ul>${k.items.map((i) => `<li><b>${i.qty}×</b> ${esc(i.name)}</li>`).join("")}</ul>
              ${k.note ? `<div class="ticket-note">💬 ${esc(k.note)}</div>` : ""}
              ${ticketWaiter(k) ? `<div class="ticket-waiter ${st}">${icon("users")} ${st === "ready" ? "Olib ketadi:" : "Ofitsiant:"} <b>${esc(ticketWaiter(k))}</b>${st === "ready" ? ` <span class="muted">· xabar yuborildi</span>` : ""}</div>` : ""}
              <div class="ticket-btns">
                <button class="btn ${next[st][2]} full" onclick="setTicket(${k.id},'${next[st][0]}')">${next[st][1]}</button>
                <button class="btn" onclick="printKitchenTicket(S.tickets.find((x) => x.id === ${k.id}))" title="Chekni chiqarish">${icon("print")}</button>
              </div>
            </div>`).join("") || `<div class="empty-state small"><span>Bo'sh</span></div>`}
        </div>`;
      }).join("")}
    </div>`;
}

function setTicket(id, status) {
  act("ticket.set", { id, status });
}

// ---------------------------------------------------------------------
// 10. MENYU (kategoriyalar va taomlar)
// ---------------------------------------------------------------------
let dishCat = "all";
let dishSearch = "";

function renderMenu() {
  const q = dishSearch.trim().toLowerCase();
  if (dishCat !== "all" && !S.categories.some((c) => c.id === dishCat)) dishCat = "all";
  const list = S.menu.filter((m) => (dishCat === "all" || m.catId === dishCat) && (!q || m.name.toLowerCase().includes(q)));
  const focused = document.activeElement && document.activeElement.id === "dSearch";
  $("content").innerHTML = `
    <div class="page-head">
      <div><h2>Menyu</h2><p class="muted">${S.menu.length} ta taom. Taomni bosib nomi yoki narxini o'zgartiring.</p></div>
      <div class="row">
        <div class="search">${icon("search")}<input id="dSearch" placeholder="Qidirish" value="${esc(dishSearch)}" oninput="dishSearch=this.value;renderMenu()"></div>
        <button class="btn" onclick="openCatForm()">${icon("plus")} Kategoriya</button>
        <button class="btn primary" onclick="openDishForm()">${icon("plus")} Taom qo'shish</button>
      </div>
    </div>
    <div class="cat-cards">
      ${[{ id: "all", name: "Hammasi" }, ...S.categories].map((c) => `
        <button class="cat-card ${dishCat === c.id ? "active" : ""}" onclick="dishCat='${c.id}';renderMenu()">
          <span class="avatar sm soft">${c.id === "all" ? icon("grid") : esc(initials(c.name))}</span>
          <span><b>${esc(c.name)}</b><small>${S.menu.filter((m) => c.id === "all" || m.catId === c.id).length} ta taom</small></span>
        </button>`).join("")}
      ${dishCat !== "all" ? `<span class="cat-tools">
        <button class="btn sm" onclick="openCatForm('${dishCat}')">${icon("edit")} Nomini o'zgartirish</button>
        <button class="btn sm red" onclick="deleteCat('${dishCat}')">${icon("trash")} O'chirish</button></span>` : ""}
    </div>
    <div class="dish-grid">
      ${list.map((m) => {
        return `<button class="dish-card ${m.available ? "" : "off"}" onclick="openDishForm(${m.id})">
          <em class="dish-price">${money(m.price)}</em>
          <b>${esc(m.name)}</b>
          <small>${esc((S.categories.find((c) => c.id === m.catId) || { name: "—" }).name)}${m.available ? "" : " · mavjud emas"}</small>
        </button>`;
      }).join("") || `<div class="empty-state"><b>Taom topilmadi</b></div>`}
    </div>`;
  if (focused) { const i = $("dSearch"); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
}

function openCatForm(id) {
  const c = S.categories.find((x) => x.id === id) || { name: "" };
  openModal(`
    <div class="modal-title"><h2>${id ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</h2></div>
    <div class="form"><label>Nomi</label><input id="cName" value="${esc(c.name)}" onkeydown="if(event.key==='Enter')saveCat('${id || ""}')"></div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Bekor qilish</button>
      <button class="btn primary" onclick="saveCat('${id || ""}')">Saqlash</button>
    </div>`, "sm");
}

// Modal oynadagi saqlash: muvaffaqiyatli bo'lsa oyna yopiladi, xato bo'lsa ochiq qoladi
async function actAndClose(type, payload) {
  if (await act(type, payload)) closeModal();
}

function saveCat(id) {
  const name = $("cName").value.trim();
  if (!name) return toast("Nomini kiriting", "error");
  actAndClose("cat.save", { id: id || null, name });
}

function deleteCat(id) {
  const c = S.categories.find((x) => x.id === id);
  if (!c) return;
  if (S.menu.some((m) => m.catId === id)) return toast(`"${c.name}" ichida taomlar bor. Avval ularni boshqa kategoriyaga o'tkazing.`, "error");
  if (!confirm(`"${c.name}" kategoriyasi o'chirilsinmi?`)) return;
  act("cat.delete", { id });
}

function openDishForm(id) {
  if (!S.categories.length) return toast("Avval kategoriya qo'shing", "warn");
  const m = S.menu.find((x) => x.id === id) || { name: "", catId: dishCat !== "all" ? dishCat : S.categories[0].id, price: "", available: true };
  openModal(`
    <div class="modal-title"><h2>${id ? "Taomni tahrirlash" : "Yangi taom"}</h2></div>
    <div class="form">
      <label>Nomi</label><input id="dName" value="${esc(m.name)}">
      <div class="form-grid">
        <div><label>Kategoriya</label><select id="dCat">${S.categories.map((c) => `<option value="${c.id}" ${c.id === m.catId ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select></div>
        <div><label>Narxi (so'm)</label><input id="dPrice" type="number" min="0" value="${m.price}"></div>
      </div>
      <label class="chk"><input type="checkbox" id="dAvail" ${m.available !== false ? "checked" : ""}><span><b>Sotuvda bor</b><small>Belgini olib tashlasangiz, taom kassada vaqtincha yopiladi</small></span></label>
    </div>
    <div class="modal-actions">
      ${id ? `<button class="btn red" onclick="deleteDish(${id})">${icon("trash")} O'chirish</button>` : ""}
      <button class="btn" onclick="closeModal()">Bekor qilish</button>
      <button class="btn primary" onclick="saveDish(${id || 0})">Saqlash</button>
    </div>`);
}

function saveDish(id) {
  const name = $("dName").value.trim();
  const price = Number($("dPrice").value);
  if (!name) return toast("Taom nomini kiriting", "error");
  if (!(price > 0)) return toast("Narxni to'g'ri kiriting", "error");
  actAndClose("dish.save", { id: id || null, name, price, catId: $("dCat").value, available: $("dAvail").checked });
}

function deleteDish(id) {
  const m = S.menu.find((x) => x.id === id);
  if (!m || !confirm(`"${m.name}" menyudan o'chirilsinmi?`)) return;
  actAndClose("dish.delete", { id });
}

// ---------------------------------------------------------------------
// 11. SOZLAMALAR
// ---------------------------------------------------------------------
function renderSettings() {
  const st = S.settings;
  $("content").innerHTML = `
    <div class="page-head"><div><h2>Sozlamalar</h2><p class="muted">Restoran ma'lumotlari, xodimlar, chek printer va zaxira nusxa</p></div></div>
    <div class="grid-2" style="align-items:start">
      <div class="card">
        <div class="card-head"><h3>Restoran</h3></div>
        <div class="form">
          <label>Restoran nomi</label><input id="sName" value="${esc(st.name)}">
          <label>Telefon</label><input id="sPhone" value="${esc(st.phone)}">
          <label>Manzil</label><input id="sAddr" value="${esc(st.address)}">
        </div>
        <button class="btn primary mt" onclick="saveSettings()">Saqlash</button>
      </div>
      <div class="card">
        <div class="card-head"><h3>${icon("users")} Xodimlar va PIN kodlar</h3><button class="btn sm" onclick="openStaffForm()">${icon("plus")} Xodim</button></div>
        <table class="tbl-list">
          <thead><tr><th>Ism</th><th>Rol</th><th class="r"></th></tr></thead>
          <tbody>${S.staff.map((u) => `<tr>
            <td><div class="name-cell"><span class="avatar sm">${esc(initials(u.name))}</span><b>${esc(u.name)}</b></div></td>
            <td><span class="badge ${{ admin: "purple", kassir: "blue", ofitsiant: "green", oshpaz: "orange" }[u.role]}">${ROLES[u.role]}</span></td>
            <td class="r nowrap">
              <button class="btn sm" onclick="openStaffForm(${u.id})" title="Tahrirlash">${icon("edit")}</button>
              ${u.id !== me.id ? `<button class="btn sm red" onclick="deleteStaff(${u.id})" title="O'chirish">${icon("trash")}</button>` : ""}
            </td></tr>`).join("")}</tbody>
        </table>
        <p class="muted mt">Admin — Admin panel, Oshxona, Stollar, Menyu, Buyurtmalar, Sozlamalar. Kassir — Kassa, Buyurtmalar. Ofitsiant — buyurtma olish va oshxonaga yuborish (to'lovsiz). Oshxona xodimi — faqat Oshxona paneli.</p>
      </div>
    </div>
    <div class="card mt">
      <div class="card-head"><h3>Ma'lumotlar</h3></div>
        <div class="row">
          <button class="btn" onclick="exportData()">${icon("download")} Zaxira nusxa yuklab olish</button>
          <button class="btn red" onclick="resetAll()">Barchasini tozalash</button>
        </div>
    </div>
    ${printerCard()}`;
  updatePrinterPreview();
}

// ---------------------------------------------------------------------
// 12. STOLLAR (joylar: zal, ko'cha, VIP...)
// ---------------------------------------------------------------------
function renderHalls() {
  $("content").innerHTML = `
    <div class="page-head">
      <div><h2>Stollar</h2><p class="muted">Joylar (Zal, Ko'cha, VIP...) va ulardagi stollar soni</p></div>
      <button class="btn primary" onclick="openHallForm()">${icon("plus")} Joy qo'shish</button>
    </div>
    <div class="list-cards">
      ${S.halls.map((h) => {
        const open = S.orders.filter((o) => o.status === "open" && o.hall === h.id).length;
        return `<div class="list-card">
          <span class="avatar soft">${icon("seat")}</span>
          <div class="grow"><b>${esc(h.name)}</b><small>Stollar: ${h.count}${h.service ? ` · Xizmat haqi: ${h.service}%` : ""}${open ? ` · ${open} ta ochiq buyurtma` : ""}</small></div>
          ${can("kassa") ? `<button class="btn sm" onclick="selHall='${h.id}';selTable=null;go('kassa')">${icon("cash")} Kassada ochish</button>` : ""}
          <button class="btn sm" onclick="openHallForm('${h.id}')" title="Tahrirlash">${icon("edit")}</button>
          <button class="btn sm red" onclick="deleteHall('${h.id}')" title="O'chirish">${icon("trash")}</button>
        </div>`;
      }).join("") || `<div class="empty-state"><b>Joy yo'q</b><span>Kamida bitta joy (masalan, Zal) qo'shing</span></div>`}
    </div>`;
}

function openHallForm(id) {
  const h = S.halls.find((x) => x.id === id) || { name: "", count: 10, service: 0 };
  openModal(`
    <div class="modal-title"><h2>${id ? "Joyni tahrirlash" : "Yangi joy"}</h2></div>
    <div class="form">
      <label>Nomi</label><input id="hName" value="${esc(h.name)}" placeholder="Masalan: Zal, Kabina, Ko'cha, Saboy">
      <div class="form-grid">
        <div><label>Stollar soni</label><input id="hCount" type="number" min="0" max="200" value="${h.count}"></div>
        <div><label>Xizmat haqi (%)</label><input id="hSvc" type="number" min="0" max="100" value="${h.service || 0}"></div>
      </div>
      <p class="muted">Xizmat haqi shu joydagi har bir buyurtma summasiga qo'shiladi (masalan, kabina uchun 10%). Saboy uchun odatda 0%.</p>
    </div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Bekor qilish</button>
      <button class="btn primary" onclick="saveHall('${id || ""}')">Saqlash</button>
    </div>`, "sm");
}

function saveHall(id) {
  const name = $("hName").value.trim();
  const count = Math.round(Number($("hCount").value));
  if (!name) return toast("Nomini kiriting", "error");
  if (!(count >= 0 && count <= 200)) return toast("Stollar soni 0 dan 200 gacha", "error");
  actAndClose("hall.save", { id: id || null, name, count, service: Number($("hSvc").value) || 0 });
}

function deleteHall(id) {
  const h = S.halls.find((x) => x.id === id);
  if (!h) return;
  if (S.orders.some((o) => o.status === "open" && o.hall === id)) return toast(`"${h.name}"da ochiq buyurtmalar bor`, "error");
  if (!confirm(`"${h.name}" o'chirilsinmi?`)) return;
  act("hall.delete", { id });
}

// ---- Chek va printer sozlamalari ----
function printerCard() {
  const c = S.settings.printer;
  const seg = (id, val, opts) => `<div class="seg" id="${id}">${opts.map(([v, l]) =>
    `<button type="button" class="${String(v) === String(val) ? "active" : ""}" data-v="${v}" onclick="segPick(this)">${l}</button>`).join("")}</div>`;
  const chk = (id, on, label, hint) => `<label class="chk"><input type="checkbox" id="${id}" ${on ? "checked" : ""} onchange="updatePrinterPreview()"><span><b>${label}</b>${hint ? `<small>${hint}</small>` : ""}</span></label>`;
  return `
    <div class="card mt">
      <div class="card-head"><h3>${icon("print")} Chek va printer</h3></div>
      <div class="printer-grid">
        <div class="form">
          <div class="form-grid">
            <div><label>Qog'oz kengligi</label>${seg("pPaper", c.paper, [["58", "58 mm"], ["80", "80 mm"]])}</div>
            <div><label>Shrift o'lchami</label>${seg("pFont", c.fontSize, [[11, "Kichik"], [12, "O'rta"], [14, "Katta"]])}</div>
          </div>
          <div class="form-grid">
            <div><label>Nusxalar soni</label>${seg("pCopies", c.copies, [[1, "1"], [2, "2"], [3, "3"]])}</div>
            <div></div>
          </div>
          <label>Nom ostidagi qo'shimcha qator</label>
          <input id="pHeader" value="${esc(c.header)}" placeholder="Masalan: STIR 123456789" oninput="updatePrinterPreview()">
          <label>Chek oxiridagi yozuv</label>
          <input id="pFooter" value="${esc(S.settings.receiptFooter)}" oninput="updatePrinterPreview()">
          <label>Chekda ko'rsatish</label>
          <div class="chk-row">
            ${chk("pAddr", c.showAddress, "Manzil")}
            ${chk("pPhone", c.showPhone, "Telefon")}
            ${chk("pCashier", c.showCashier, "Kassir")}
          </div>
          <label>Avtomatik chop etish</label>
          ${chk("pAuto", c.autoPrint, "To'lovdan keyin chekni o'zi chiqarsin", "Kassir \"Chek chiqarish\"ni bosishi shart emas")}
          ${chk("pKitchen", c.kitchenPrint, "Oshxona cheki chiqsin", "Oshxonaga yuborilganda narxsiz chek: stol, taomlar va izoh")}
          <div class="kprint-at"><span class="muted">Oshxona cheki qaysi printerdan chiqadi:</span>
            ${seg("pKitchenAt", c.kitchenPrintAt || "kassa", [["kassa", "Kassadagi printer"], ["oshxona", "Oshxona ekranidagi printer"]])}
            <small class="muted">"Oshxona ekranidagi" — oshxonada printerli kompyuter/planshetda Oshxona paneli ochiq turadi va yangi buyurtma kelishi bilan chek o'zi chiqadi. Ofitsiant telefonidan yuborilganda ham shu ishlaydi.</small>
          </div>
          <div class="row mt">
            <button class="btn primary" onclick="savePrinter()">Saqlash</button>
            <button class="btn" onclick="testPrint()">${icon("print")} Sinov cheki</button>
          </div>
          <div class="print-help">
            <b>Chekni oynasiz, to'g'ridan-to'g'ri printerga chiqarish</b>
            <ol>
              <li>Chek printerni ulang va kompyuterga o'rnating (drayverini o'rnating).</li>
              <li>Uni <b>asosiy (default) printer</b> qilib belgilang.</li>
              <li>Dasturni <code>Kafe-Pro.bat</code> (Windows) yoki <code>kassa-chrome.sh</code> (Mac) orqali oching — Chrome chekni so'ramasdan darhol chiqaradi.</li>
              <li>Birinchi marta oddiy chop etish oynasida qog'oz o'lchamini (${c.paper} mm) va "Chegaralar: Yo'q" ni tanlang.</li>
            </ol>
          </div>
        </div>
        <div>
          <label class="muted">Chek ko'rinishi</label>
          <div class="receipt-paper preview-paper" id="pPreview"></div>
        </div>
      </div>
    </div>`;
}

function segPick(btn) {
  btn.parentElement.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
  updatePrinterPreview();
}

function readPrinterForm() {
  const segVal = (id) => $(id).querySelector(".active").dataset.v;
  return {
    paper: segVal("pPaper"),
    fontSize: Number(segVal("pFont")),
    copies: Number(segVal("pCopies")),
    header: $("pHeader").value.trim(),
    showAddress: $("pAddr").checked,
    showPhone: $("pPhone").checked,
    showCashier: $("pCashier").checked,
    autoPrint: $("pAuto").checked,
    kitchenPrint: $("pKitchen").checked,
    kitchenPrintAt: segVal("pKitchenAt")
  };
}

function sampleOrder() {
  return {
    no: 125, table: 5, discount: 0, status: "paid", sub: 75000, discountSum: 0, total: 75000,
    paidAt: nowIso(), cashierName: me ? me.name : "Kassir",
    items: [{ name: "Osh (Palov)", qty: 2, price: 35000 }, { name: "Ko'k choy", qty: 1, price: 5000 }],
    payment: { method: "naqd", card: 0, cash: 75000, given: 100000, change: 25000 }
  };
}

function updatePrinterPreview() {
  if (!$("pPreview")) return;
  const cfg = readPrinterForm();
  const el = $("pPreview");
  el.style.width = cfg.paper === "58" ? "230px" : "320px";
  el.style.fontSize = cfg.fontSize + "px";
  el.innerHTML = receiptHtml(sampleOrder(), cfg, { ...S.settings, receiptFooter: $("pFooter").value.trim() });
}

async function savePrinter() {
  if (await act("printer.save", { printer: readPrinterForm(), receiptFooter: $("pFooter").value.trim() })) toast("Chek sozlamalari saqlandi", "success");
}

function testPrint() {
  const cfg = readPrinterForm();
  printHtml(receiptHtml(sampleOrder(), cfg, { ...S.settings, receiptFooter: $("pFooter").value.trim() }), cfg);
}

async function saveSettings() {
  const name = $("sName").value.trim();
  if (!name) return toast("Restoran nomini kiriting", "error");
  if (await act("settings.save", { name, phone: $("sPhone").value.trim(), address: $("sAddr").value.trim() })) toast("Sozlamalar saqlandi", "success");
}

function openStaffForm(id) {
  const u = S.staff.find((x) => x.id === id) || { name: "", role: "kassir" };
  openModal(`
    <div class="modal-title"><h2>${id ? "Xodimni tahrirlash" : "Yangi xodim"}</h2></div>
    <div class="form">
      <label>Ism</label><input id="uName" value="${esc(u.name)}">
      <div class="form-grid">
        <div><label>Rol</label><select id="uRole">${Object.entries(ROLES).map(([k, l]) => `<option value="${k}" ${k === u.role ? "selected" : ""}>${l}</option>`).join("")}</select></div>
        <div><label>PIN (4–6 raqam)</label><input id="uPin" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="${id ? "o'zgarmaydi" : ""}"></div>
      </div>
      ${id ? `<p class="muted">PIN kod xavfsizlik uchun ko'rsatilmaydi. O'zgartirish uchun yangisini yozing, bo'sh qoldirsangiz eskisi qoladi.</p>` : ""}
    </div>
    <div class="modal-actions">
      <button class="btn" onclick="closeModal()">Bekor qilish</button>
      <button class="btn primary" onclick="saveStaff(${id || 0})">Saqlash</button>
    </div>`, "sm");
}

function saveStaff(id) {
  const name = $("uName").value.trim();
  const role = $("uRole").value;
  const pin = $("uPin").value.trim();
  if (!name) return toast("Ismni kiriting", "error");
  if ((pin || !id) && !/^\d{4,6}$/.test(pin)) return toast("PIN 4–6 ta raqamdan iborat bo'lsin", "error");
  if (id && id === me.id && role !== "admin") return toast("O'zingizning admin rolingizni olib tashlay olmaysiz", "error");
  actAndClose("staff.save", { id: id || null, name, role, pin });
}

function deleteStaff(id) {
  const u = S.staff.find((x) => x.id === id);
  if (!u || u.id === me.id) return;
  if (!confirm(`"${u.name}" o'chirilsinmi?`)) return;
  act("staff.delete", { id });
}

// To'liq zaxira (barcha buyurtmalar bilan) serverdan yuklab olinadi
async function exportData() {
  try {
    const d = await api("/api/export");
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kafe-zaxira-${todayYmd()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } catch (e) { toast(e.message, "error"); }
}

async function resetAll() {
  if (!confirm("DIQQAT! Barcha buyurtmalar, menyu, joylar va xodimlar standart holatga qaytadi. Davom etilsinmi?")) return;
  if (!confirm("Tozalashdan oldin serverda zaxira nusxa olinadi. Rostdan ham tozalansinmi?")) return;
  selTable = null;
  if (await act("data.reset", {})) toast("Ma'lumotlar tozalandi (oldingisi backups/ papkasida)", "warn");
}

// ---------------------------------------------------------------------
// 13. Ishga tushirish
// ---------------------------------------------------------------------
const VIEWS = {
  admin: renderAdmin, kassa: renderKassa, waiter: renderKassa, kitchen: renderKitchen, halls: renderHalls, menu: renderMenu, orders: renderOrders, settings: renderSettings
};

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modalOpen()) closeModal();
  else if (me && (view === "kassa" || view === "waiter") && selTable && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) backToTables();
});

applySidebar();
setInterval(() => { if (me) tickClock(); }, 1000);
setInterval(poll, 2500);

load();
