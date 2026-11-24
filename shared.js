/* =====================================================================
   KAFE PRO POS — server va brauzer uchun umumiy qism
   (standart ma'lumotlar, eski formatdan o'tkazish, summa hisoblash)
   Brauzerda: window.Shared, Node.js da: require("./shared")
   ===================================================================== */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Shared = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const ROLES = { admin: "Admin", kassir: "Kassir", oshpaz: "Oshpaz" };
  const PAY_LABEL = { naqd: "Naqd pul", karta: "Karta", aralash: "Aralash" };

  const nextId = (arr) => arr.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;

  function defaultMenu() {
    return {
      categories: [
        { id: "c1", name: "Suyuq ovqatlar" },
        { id: "c2", name: "Qattiq ovqatlar" },
        { id: "c3", name: "Ichimliklar" }
      ],
      menu: [
        { id: 1, name: "Sho'rva", catId: "c1", price: 30000 },
        { id: 2, name: "Qaynatma sho'rva", catId: "c1", price: 32000 },
        { id: 3, name: "Kuza sho'rva", catId: "c1", price: 35000 },
        { id: 4, name: "Mastava", catId: "c1", price: 26000 },
        { id: 5, name: "Moshxo'rda", catId: "c1", price: 25000 },
        { id: 6, name: "Mosh sho'rva", catId: "c1", price: 24000 },
        { id: 7, name: "Lag'mon", catId: "c1", price: 32000 },
        { id: 8, name: "Chuchvara", catId: "c1", price: 28000 },
        { id: 9, name: "Unash", catId: "c1", price: 25000 },
        { id: 10, name: "Kosa sho'rva", catId: "c1", price: 30000 },
        { id: 11, name: "Osh (Palov)", catId: "c2", price: 35000 },
        { id: 12, name: "To'y oshi", catId: "c2", price: 40000 },
        { id: 13, name: "Samarqand oshi", catId: "c2", price: 40000 },
        { id: 14, name: "Shivit oshi", catId: "c2", price: 35000 },
        { id: 15, name: "Qozon kabob", catId: "c2", price: 48000 },
        { id: 16, name: "Dimlama", catId: "c2", price: 38000 },
        { id: 17, name: "Manti", catId: "c2", price: 28000 },
        { id: 18, name: "Xonim", catId: "c2", price: 25000 },
        { id: 19, name: "Norin", catId: "c2", price: 35000 },
        { id: 20, name: "Qovurma lag'mon", catId: "c2", price: 35000 },
        { id: 21, name: "Do'lma", catId: "c2", price: 30000 },
        { id: 22, name: "Tandir go'sht", catId: "c2", price: 60000 },
        { id: 23, name: "Shashlik", catId: "c2", price: 18000 },
        { id: 24, name: "Jigar kabob", catId: "c2", price: 18000 },
        { id: 25, name: "Tandir somsa", catId: "c2", price: 9000 },
        { id: 26, name: "Achchiq-chuchuk", catId: "c2", price: 12000 },
        { id: 27, name: "Tandir non", catId: "c2", price: 5000 },
        { id: 28, name: "Patir non", catId: "c2", price: 8000 },
        { id: 29, name: "Ko'k choy", catId: "c3", price: 5000 },
        { id: 30, name: "Qora choy", catId: "c3", price: 5000 },
        { id: 31, name: "Coca-Cola 1 L", catId: "c3", price: 14000 },
        { id: 32, name: "Suv 0.5 L", catId: "c3", price: 4000 },
        { id: 33, name: "Sharbat", catId: "c3", price: 15000 },
        { id: 34, name: "Kofe", catId: "c3", price: 15000 }
      ].map((m) => ({ ...m, available: true }))
    };
  }

  // Sozlamalar, xodimlar, menyu va joylar ("config"). Buyurtmalar alohida saqlanadi.
  function defaultConfig() {
    return {
      settings: {
        name: "Kafe Pro",
        phone: "+998 90 000-00-00",
        address: "Toshkent shahri",
        receiptFooter: "Xaridingiz uchun rahmat! Yana keling!",
        printer: {
          paper: "80",          // 58 yoki 80 mm
          fontSize: 12,         // px
          copies: 1,
          autoPrint: false,     // to'lovdan keyin chekni o'zi chiqarsin
          kitchenPrint: false,  // oshxonaga yuborilganda oshxona cheki
          showAddress: true,
          showPhone: true,
          showCashier: true,
          header: ""            // nom ostidagi qo'shimcha qator (masalan, STIR)
        }
      },
      staff: [
        { id: 1, name: "Admin", role: "admin", pin: "1111" },
        { id: 2, name: "Kassir", role: "kassir", pin: "2222" },
        { id: 3, name: "Oshpaz", role: "oshpaz", pin: "3333" }
      ],
      ...defaultMenu(),
      halls: [
        { id: "h1", name: "Zal", count: 12, service: 0 },
        { id: "h2", name: "Ko'cha", count: 10, service: 0 },
        { id: "h3", name: "VIP", count: 5, service: 0 },
        { id: "h4", name: "Premium zal", count: 6, service: 0 }
      ]
    };
  }

  // Eski pos_data.json (brauzer versiyasi) dan config + buyurtmalarni olish
  function fromLegacy(d) {
    const base = defaultConfig();
    const cfg = {
      settings: { ...base.settings, ...(d.settings || {}) },
      staff: Array.isArray(d.staff) ? d.staff : base.staff,
      categories: Array.isArray(d.categories) ? d.categories : base.categories,
      menu: Array.isArray(d.menu) ? d.menu : base.menu,
      halls: Array.isArray(d.halls) ? d.halls : [{ id: "h1", name: "Zal", count: (d.settings && d.settings.tableCount) || 12, service: 0 }]
    };
    cfg.settings.printer = { ...base.settings.printer, ...((d.settings || {}).printer || {}) };
    delete cfg.settings.tableCount;
    cfg.staff = cfg.staff.filter((u) => ROLES[u.role]).map((u) => ({ id: u.id, name: u.name, role: u.role, pin: String(u.pin) }));
    if (!cfg.staff.some((u) => u.role === "admin")) cfg.staff.unshift({ id: nextId(cfg.staff), name: "Admin", role: "admin", pin: "1111" });
    cfg.menu = cfg.menu.map((m) => ({ id: m.id, name: m.name, catId: m.catId, price: Number(m.price) || 0, available: m.available !== false }));
    const hall0 = cfg.halls[0] ? cfg.halls[0].id : "h1";
    const orders = (Array.isArray(d.orders) ? d.orders : []).map((o) => ({ ...o, hall: o.hall || hall0 }));
    const tickets = (Array.isArray(d.tickets) ? d.tickets : []).map((k) => ({ ...k, hall: k.hall || hall0 }));
    return { config: cfg, orders, tickets, nextOrderNo: d.nextOrderNo || nextId(orders.map((o) => ({ id: o.no }))) };
  }

  const hallOf = (cfg, id) => cfg.halls.find((h) => h.id === id) || { id, name: "Joy", count: 0, service: 0 };
  const placeName = (cfg, h, t) => `${hallOf(cfg, h).name}, ${t}-stol`;

  // Jami = taomlar − chegirma + xizmat haqi (joyning foizi). To'langan buyurtmada saqlangan qiymat.
  function calc(cfg, o) {
    if (o.paidAt) return { sub: o.sub, disc: o.discountSum, svc: o.serviceSum || 0, svcPct: o.servicePct || 0, total: o.total };
    const sub = o.items.reduce((s, i) => s + i.price * i.qty, 0);
    const disc = Math.round((sub * (o.discount || 0)) / 100);
    const svcPct = hallOf(cfg, o.hall).service || 0;
    const svc = Math.round(((sub - disc) * svcPct) / 100);
    return { sub, disc, svc, svcPct, total: sub - disc + svc };
  }

  const num = (v) => Number(String(v ?? "").replace(/[^\d.]/g, "")) || 0;

  // To'lov: qancha berildi, qaytim, karta qismi
  function payNums(method, total, given, card, cash) {
    if (method === "karta") return { paid: total, change: 0, card: total, ok: total > 0 };
    if (method === "naqd") {
      const g = num(given);
      return { paid: g, change: g - total, card: 0, ok: total > 0 && g >= total };
    }
    const c = num(card), n = num(cash), paid = c + n;
    return { paid, change: paid - total, card: c, ok: total > 0 && paid >= total && c <= total };
  }

  return { ROLES, PAY_LABEL, nextId, defaultMenu, defaultConfig, fromLegacy, hallOf, placeName, calc, num, payNums };
});
