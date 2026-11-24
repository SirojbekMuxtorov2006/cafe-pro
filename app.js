/**
 * ===================================================================
 * OSHXONA & RESTORAN POS BOSHQARUV TIZIMI — ASOSIY ISH MANTIQI (app.js)
 * Modulli, tezkor va to'liq avtomatlashtirilgan restoran boshqaruvi
 * ===================================================================
 */

// 1. STANDART SOZLAMALAR VA BAZAVIY MA'LUMOTLAR
const DEFAULT_SETTINGS = {
  restaurantName: "Oshxona & Restoran POS",
  phone: "+998 90 123-45-67",
  address: "Toshkent shahri, Amir Temur ko'chasi, 12-uy",
  currency: "so'm",
  tableCount: 16,
  serviceChargePercent: 10,
  receiptHeader: "Oshxona & Milliy Taomlar",
  receiptFooter: "Xaridingiz uchun rahmat, yana keling!"
};

const DEFAULT_CATEGORIES = [
  { id: "taomlar", name: "Taomlar", icon: "🍲" },
  { id: "fastfood", name: "Fast Food", icon: "🍔" },
  { id: "salatlar", name: "Salatlar", icon: "🥗" },
  { id: "shorvalar", name: "Sho'rvalar", icon: "🥣" },
  { id: "kabob", name: "Kabob", icon: "🍢" },
  { id: "ichimliklar", name: "Ichimliklar", icon: "🥤" },
  { id: "choykofe", name: "Choy/Kofe", icon: "🫖" },
  { id: "desertlar", name: "Desertlar", icon: "🍰" }
];

const DEFAULT_PRODUCTS = [
  // 1. Taomlar
  { id: 101, name: "Osh (Palov) 1 por", categoryId: "taomlar", price: 35000, icon: "🍲", isAvailable: true, description: "Maxsus mol go'shtli to'y oshi" },
  { id: 102, name: "Osh (Palov) 0.7 por", categoryId: "taomlar", price: 28000, icon: "🍲", isAvailable: true, description: "O'rtacha porsiya" },
  { id: 103, name: "Qozon kabob", categoryId: "taomlar", price: 48000, icon: "🥩", isAvailable: true, description: "Qovurilgan go'sht va qizarib pishgan kartoshka" },
  { id: 104, name: "Manti (1 dona)", categoryId: "taomlar", price: 7000, icon: "🥟", isAvailable: true, description: "Mol go'shti va piyozli manti" },
  { id: 105, name: "Jiz-biz (tovada)", categoryId: "taomlar", price: 45000, icon: "🥘", isAvailable: true, description: "Qo'y go'shti tovada qovurilgan" },
  { id: 106, name: "Qovurma lag'mon", categoryId: "taomlar", price: 35000, icon: "🍝", isAvailable: true, description: "Qo'lda cho'zilgan xamir va go'sht" },
  { id: 107, name: "Tandir non", categoryId: "taomlar", price: 5000, icon: "🍞", isAvailable: true, description: "Issiq tandir non" },
  { id: 108, name: "Patir non", categoryId: "taomlar", price: 10000, icon: "🥐", isAvailable: true, description: "Yog'li Samarqand patir" },

  // 2. Fast Food
  { id: 201, name: "Gamburger", categoryId: "fastfood", price: 28000, icon: "🍔", isAvailable: true, description: "Mol go'shtli kotlet va pishloq" },
  { id: 202, name: "Chizburger", categoryId: "fastfood", price: 32000, icon: "🍔", isAvailable: true, description: "Qo'shimcha pishloq bilan" },
  { id: 203, name: "Lavash standart", categoryId: "fastfood", price: 32000, icon: "🌯", isAvailable: true, description: "Mol go'shtli shirali lavash" },
  { id: 204, name: "Xot-dog", categoryId: "fastfood", price: 18000, icon: "🌭", isAvailable: true, description: "Sosiska va maxsus sous" },
  { id: 205, name: "Kartoshka fri", categoryId: "fastfood", price: 16000, icon: "🍟", isAvailable: true, description: "Qarsildoq qovurilgan fri" },

  // 3. Salatlar
  { id: 301, name: "Achichuk (pomidor-piyoz)", categoryId: "salatlar", price: 10000, icon: "🥗", isAvailable: true, description: "Osh uchun yangi achichuk" },
  { id: 302, name: "Bahor salati", categoryId: "salatlar", price: 12000, icon: "🥗", isAvailable: true, description: "Bodring, ko'katlar va tuxum" },
  { id: 303, name: "Olivye salati", categoryId: "salatlar", price: 18000, icon: "🥗", isAvailable: true, description: "Klassik go'shtli olivye" },
  { id: 304, name: "Suzma / Chakka", categoryId: "salatlar", price: 8000, icon: "🥣", isAvailable: true, description: "Ziravorlar bilan suzma" },
  { id: 305, name: "Fransuzcha salat", categoryId: "salatlar", price: 18000, icon: "🥗", isAvailable: true, description: "Qizil lavlagi va mayonezli" },

  // 4. Sho'rvalar
  { id: 401, name: "Mol go'shtli Sho'rva", categoryId: "shorvalar", price: 30000, icon: "🥣", isAvailable: true, description: "Katta bo'lak lahm go'shtli sho'rva" },
  { id: 402, name: "Cho'zma Lag'mon", categoryId: "shorvalar", price: 32000, icon: "🍜", isAvailable: true, description: "Suyuq lag'mon sho'rva" },
  { id: 403, name: "Chuchvara sho'rva", categoryId: "shorvalar", price: 28000, icon: "🍲", isAvailable: true, description: "Qatiq va mitti chuchvaralar" },
  { id: 404, name: "Mastava (qatiqli)", categoryId: "shorvalar", price: 26000, icon: "🥣", isAvailable: true, description: "Guruchli suyuq milliy taom" },

  // 5. Kabob
  { id: 501, name: "Shashlik qiyma", categoryId: "kabob", price: 16000, icon: "🍢", isAvailable: true, description: "Mayin mol go'shtli qiyma sihi" },
  { id: 502, name: "Shashlik kuskovoy", categoryId: "kabob", price: 20000, icon: "🍢", isAvailable: true, description: "Mol lahm go'shti va dumba" },
  { id: 503, name: "Shashlik jigar", categoryId: "kabob", price: 16000, icon: "🍢", isAvailable: true, description: "Pardaga o'ralgan yangi jigar" },
  { id: 504, name: "Tovuq qanot shashlik", categoryId: "kabob", price: 18000, icon: "🍗", isAvailable: true, description: "Ziravorlangan tovuq qanotlari" },

  // 6. Ichimliklar
  { id: 601, name: "Coca-Cola 1.5 L", categoryId: "ichimliklar", price: 16000, icon: "🥤", isAvailable: true, description: "Salqin gazli ichimlik" },
  { id: 602, name: "Fanta 1.5 L", categoryId: "ichimliklar", price: 16000, icon: "🥤", isAvailable: true, description: "Apelsinli gazli ichimlik" },
  { id: 603, name: "Gazsiz suv 0.5 L", categoryId: "ichimliklar", price: 4000, icon: "💧", isAvailable: true, description: "Toza mineral suv" },
  { id: 604, name: "Dena sharbati 1 L", categoryId: "ichimliklar", price: 15000, icon: "🧃", isAvailable: true, description: "Tabiiy meva sharbati" },

  // 7. Choy / Kofe
  { id: 701, name: "Ko'k choy (choynak)", categoryId: "choykofe", price: 5000, icon: "🫖", isAvailable: true, description: "Ko'k choy 95-nav" },
  { id: 702, name: "Qora choy (choynak)", categoryId: "choykofe", price: 5000, icon: "🫖", isAvailable: true, description: "Xushbo'y qora choy" },
  { id: 703, name: "Limon choy (asal bilan)", categoryId: "choykofe", price: 14000, icon: "🍋", isAvailable: true, description: "Limonli va tabiiy asalli choy" },
  { id: 704, name: "Kofe Americano", categoryId: "choykofe", price: 15000, icon: "☕", isAvailable: true, description: "Tabiiy qora kofe" },

  // 8. Desertlar
  { id: 801, name: "Paxlava (1 dona)", categoryId: "desertlar", price: 14000, icon: "🍰", isAvailable: true, description: "Yong'oqli va asalli turkcha paxlava" },
  { id: 802, name: "Medovik tort", categoryId: "desertlar", price: 20000, icon: "🎂", isAvailable: true, description: "Mayin asalli tort bo'lagi" },
  { id: 803, name: "Muzqaymoq assorti", categoryId: "desertlar", price: 18000, icon: "🍨", isAvailable: true, description: "Shokoladli va qaymoqli" }
];

const DEFAULT_STAFF = [
  { id: 1, name: "Ali Rahimov", role: "admin", pin: "1234", phone: "+998 90 111-22-33", active: true },
  { id: 2, name: "Kozim Kassir", role: "cashier", pin: "2222", phone: "+998 90 222-33-44", active: true },
  { id: 3, name: "Otabek Ofitsiant", role: "waiter", pin: "3333", phone: "+998 90 333-44-55", active: true },
  { id: 4, name: "Sherzod Oshpaz", role: "chef", pin: "4444", phone: "+998 90 444-55-66", active: true }
];

const DEFAULT_CUSTOMERS = [
  { id: 1, name: "Akmal Karimov", phone: "+998 90 987-65-43", ordersCount: 5, totalSpent: 620000, lastOrderAt: "2026-11-24T08:30:00Z" },
  { id: 2, name: "Nodir Bekov", phone: "+998 91 123-99-88", ordersCount: 2, totalSpent: 215000, lastOrderAt: "2026-11-24T09:10:00Z" },
  { id: 3, name: "Dilshod Saidov", phone: "+998 93 456-78-90", ordersCount: 8, totalSpent: 1140000, lastOrderAt: "2026-11-24T09:40:00Z" }
];

function generateDefaultTables(count = 16) {
  const tables = [];
  for (let i = 1; i <= count; i++) {
    tables.push({
      id: i,
      number: i,
      name: `${i}-stol`,
      capacity: 4,
      status: "vacant", // vacant, occupied, preparing, waiting_bill
      currentOrderId: null
    });
  }
  return tables;
}

// 2. DASTUR HOLATI (STATE)
const STATE = {
  settings: { ...DEFAULT_SETTINGS },
  categories: [...DEFAULT_CATEGORIES],
  products: [...DEFAULT_PRODUCTS],
  tables: generateDefaultTables(16),
  orders: [], // Barcha buyurtmalar (faol va yopilgan)
  customers: [...DEFAULT_CUSTOMERS],
  staff: [...DEFAULT_STAFF],
  currentUser: DEFAULT_STAFF[0], // Hozirgi foydalanuvchi (Default: Admin)

  // UI Holati
  currentView: "dashboard",
  currentOrderCart: {
    tableId: 1,
    customerId: null,
    items: [], // { id, productId, name, price, qty, total, notes }
    serviceChargeEnabled: true
  },
  selectedCashierOrderId: null,
  activeOrderCategory: "taomlar",
  currentEditingItemIndex: null, // Note modal uchun
  filterTableStatus: "all",
  reportPeriod: "today",
  sidebarCollapsed: false
};

// 3. YORDAMCHI FUNKSIYALAR VA FORMATLASH
function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("uz-UZ") + " " + (STATE.settings.currency || "so'm");
}

function formatDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function formatTimeOnly(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function generateOrderNumber() {
  const todayCount = STATE.orders.length + 1;
  return `#${100 + todayCount}`;
}

// 4. MA'LUMOTLARNI SAQLASH VA YUKLASH (LOCALSTORAGE + REST API SYNC)
const STORAGE_KEY = "pos_restaurant_system_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.settings) STATE.settings = { ...DEFAULT_SETTINGS, ...data.settings };
      if (data.categories && data.categories.length) STATE.categories = data.categories;
      if (data.products && data.products.length) STATE.products = data.products;
      if (data.tables && data.tables.length) STATE.tables = data.tables;
      if (data.orders) STATE.orders = data.orders;
      if (data.customers) STATE.customers = data.customers;
      if (data.staff && data.staff.length) STATE.staff = data.staff;
      if (data.currentUser) STATE.currentUser = data.currentUser;
    } else {
      // Namuna boshlang'ich buyurtmalar kiritamiz
      seedInitialDemoOrders();
    }
  } catch (err) {
    console.error("Storage yuklashda xatolik:", err);
  }

  // Server API mavjud bo'lsa fonda sinxronlash
  try {
    fetch('/api/data')
      .then(res => res.ok ? res.json() : null)
      .then(serverData => {
        if (serverData && serverData.orders) {
          // Serverdan yangilanish
          console.log("Server API ma'lumotlari muvaffaqiyatli sinxronlandi");
        }
      })
      .catch(() => {});
  } catch (e) {}
}

function saveState() {
  try {
    const payload = {
      settings: STATE.settings,
      categories: STATE.categories,
      products: STATE.products,
      tables: STATE.tables,
      orders: STATE.orders,
      customers: STATE.customers,
      staff: STATE.staff,
      currentUser: STATE.currentUser
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Serverga fonda yuborish
    if (window.location.protocol.startsWith('http')) {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  } catch (err) {
    console.error("Saqlashda xatolik:", err);
  }

  // Har safar saqlanganda barcha ko'rsatkichlarni yangilash
  updateHeaderKPIs();
}

function seedInitialDemoOrders() {
  // 1-stol uchun namuna zakaz
  const order1 = {
    id: 101,
    orderNumber: "#101",
    tableId: 1,
    tableName: "1-stol",
    customerId: 1,
    customerName: "Akmal Karimov",
    waiterId: 3,
    waiterName: "Otabek Ofitsiant",
    items: [
      { id: 1, productId: 101, name: "Osh (Palov) 1 por", price: 35000, qty: 2, total: 70000, notes: "Beda tuxum bilan" },
      { id: 2, productId: 501, name: "Shashlik qiyma", price: 16000, qty: 3, total: 48000, notes: "Piyozli" },
      { id: 3, productId: 301, name: "Achichuk (pomidor-piyoz)", price: 10000, qty: 1, total: 10000, notes: "" },
      { id: 4, productId: 701, name: "Ko'k choy (choynak)", price: 5000, qty: 2, total: 10000, notes: "" }
    ],
    status: "preparing", // new, preparing, ready, served, completed, cancelled
    kitchenStatus: "preparing",
    subtotal: 138000,
    serviceCharge: 13800,
    total: 151800,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    paymentMethod: null
  };

  // 5-stol uchun hisob kutayotgan zakaz
  const order2 = {
    id: 102,
    orderNumber: "#102",
    tableId: 5,
    tableName: "5-stol",
    customerId: null,
    customerName: "Mijoz",
    waiterId: 3,
    waiterName: "Otabek Ofitsiant",
    items: [
      { id: 5, productId: 103, name: "Qozon kabob", price: 48000, qty: 2, total: 96000, notes: "" },
      { id: 6, productId: 302, name: "Bahor salati", price: 12000, qty: 2, total: 24000, notes: "" },
      { id: 7, productId: 601, name: "Coca-Cola 1.5 L", price: 16000, qty: 1, total: 16000, notes: "" }
    ],
    status: "served",
    kitchenStatus: "served",
    subtotal: 136000,
    serviceCharge: 13600,
    total: 149600,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    paymentMethod: null
  };

  // Bugun yopilgan bitta chek
  const order3 = {
    id: 100,
    orderNumber: "#100",
    tableId: 3,
    tableName: "3-stol",
    customerId: 2,
    customerName: "Nodir Bekov",
    waiterId: 3,
    waiterName: "Otabek Ofitsiant",
    cashierName: "Kozim Kassir",
    items: [
      { id: 8, productId: 101, name: "Osh (Palov) 1 por", price: 35000, qty: 3, total: 105000, notes: "" },
      { id: 9, productId: 703, name: "Limon choy (asal bilan)", price: 14000, qty: 1, total: 14000, notes: "" }
    ],
    status: "completed",
    kitchenStatus: "served",
    subtotal: 119000,
    serviceCharge: 11900,
    total: 130900,
    paymentMethod: "Naqd",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    completedAt: new Date(Date.now() - 60 * 60000).toISOString()
  };

  STATE.orders = [order1, order2, order3];
  
  // Stollarni belgilash
  const t1 = STATE.tables.find(t => t.id === 1);
  if (t1) { t1.status = "preparing"; t1.currentOrderId = order1.id; }
  
  const t5 = STATE.tables.find(t => t.id === 5);
  if (t5) { t5.status = "waiting_bill"; t5.currentOrderId = order2.id; }
}

// 5. NAVIGATSIYA VA EKRANLARNI ALMASHTIRISH
function navigateTo(viewName) {
  // Rol huquqini tekshirish
  const role = STATE.currentUser?.role || "admin";
  if (role === "chef" && !["kitchen", "dashboard"].includes(viewName)) {
    alert("Oshpaz faqat Oshxona va Dashboard sahifalariga kirishi mumkin!");
    viewName = "kitchen";
  }

  STATE.currentView = viewName;

  // Sidebar tugmalari faolligini yangilash
  const navBtns = document.querySelectorAll(".sidebar-nav .nav-item");
  navBtns.forEach(btn => {
    if (btn.getAttribute("data-view") === viewName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Ekranni almashtirish
  const panes = document.querySelectorAll(".view-pane");
  panes.forEach(pane => pane.classList.remove("active"));

  const targetPane = document.getElementById("view" + capitalize(viewName));
  if (targetPane) targetPane.classList.add("active");

  // Har bir sahifaga mos render qilish
  switch (viewName) {
    case "dashboard":
      renderDashboard();
      break;
    case "tables":
      renderTablesView();
      break;
    case "orders":
      renderOrdersView();
      break;
    case "kitchen":
      renderKitchenView();
      break;
    case "cashier":
      renderCashierView();
      break;
    case "menu":
      renderAdminMenuView();
      break;
    case "categories":
      renderCategoriesView();
      break;
    case "customers":
      renderCustomersView();
      break;
    case "staff":
      renderStaffView();
      break;
    case "reports":
      renderReportsView();
      break;
    case "history":
      renderHistoryView();
      break;
    case "settings":
      renderSettingsView();
      break;
  }

  // Mobil rejimda saydbarni yopish
  if (window.innerWidth < 992) {
    toggleSidebar(true);
  }
}

function capitalize(str) {
  if (!str) return "";
  if (str === "orderHistory") return "OrderHistory";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Saydbarni ochish/yopish
function toggleSidebar(forceCollapse) {
  const sidebar = document.getElementById("posSidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const layout = document.getElementById("posAppLayout");
  if (!sidebar) return;

  if (typeof forceCollapse === "boolean") {
    STATE.sidebarCollapsed = forceCollapse;
  } else {
    STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  }

  if (STATE.sidebarCollapsed) {
    sidebar.classList.add("collapsed");
    layout?.classList.add("sidebar-collapsed");
    if (overlay) overlay.style.display = "none";
  } else {
    sidebar.classList.remove("collapsed");
    layout?.classList.remove("sidebar-collapsed");
    if (overlay && window.innerWidth < 992) overlay.style.display = "block";
  }
}

// 6. YUQORI ASOSIY PANEL KO'RSATKICHLARI (HEADER KPIS)
function updateHeaderKPIs() {
  // Bugungi savdo (to'langan cheklar)
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayPaidOrders = STATE.orders.filter(o => o.status === "completed" && o.completedAt && o.completedAt.startsWith(todayStr));
  const todaySales = todayPaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Faol buyurtmalar (yopilmagan)
  const activeOrders = STATE.orders.filter(o => ["new", "preparing", "ready", "served"].includes(o.status));

  // Oshxona (new va preparing)
  const kitchenOrders = STATE.orders.filter(o => ["new", "preparing"].includes(o.kitchenStatus));

  // Band stollar
  const occupiedTables = STATE.tables.filter(t => t.status !== "vacant");

  // DOM yangilash
  const elSales = document.getElementById("headStatSales");
  if (elSales) elSales.textContent = formatMoney(todaySales);

  const elActive = document.getElementById("headStatActiveOrders");
  if (elActive) elActive.textContent = `${activeOrders.length} ta`;

  const elKitchen = document.getElementById("headStatKitchen");
  if (elKitchen) elKitchen.textContent = `${kitchenOrders.length} ta`;

  const elTables = document.getElementById("headStatTables");
  if (elTables) elTables.textContent = `${occupiedTables.length} / ${STATE.tables.length}`;

  // Saydbar badgelari
  const navTables = document.getElementById("navBadgeTables");
  if (navTables) navTables.textContent = occupiedTables.length;

  const navOrders = document.getElementById("navBadgeActiveOrders");
  if (navOrders) navOrders.textContent = activeOrders.length;

  const navKitchen = document.getElementById("navBadgeKitchen");
  if (navKitchen) navKitchen.textContent = kitchenOrders.length;

  const waitingCashier = STATE.orders.filter(o => ["ready", "served"].includes(o.status));
  const navCashier = document.getElementById("navBadgeCashier");
  if (navCashier) navCashier.textContent = waitingCashier.length;

  // Joriy foydalanuvchi ma'lumotlari
  const headName = document.getElementById("headUserName");
  const headRole = document.getElementById("headUserRole");
  const headAvatar = document.getElementById("headUserAvatar");
  const sideInfo = document.getElementById("sideUserInfoText");

  if (STATE.currentUser) {
    if (headName) headName.textContent = STATE.currentUser.name;
    if (headRole) headRole.textContent = getRoleDisplayName(STATE.currentUser.role);
    if (headAvatar) headAvatar.textContent = getRoleAvatar(STATE.currentUser.role);
    if (sideInfo) sideInfo.textContent = `${STATE.currentUser.name} (${getRoleDisplayName(STATE.currentUser.role)})`;
  }
}

function getRoleDisplayName(role) {
  switch (role) {
    case "admin": return "Administrator";
    case "cashier": return "Kassir";
    case "waiter": return "Ofitsiant";
    case "chef": return "Bosh Oshpaz";
    default: return role;
  }
}

function getRoleAvatar(role) {
  switch (role) {
    case "admin": return "👑";
    case "cashier": return "💵";
    case "waiter": return "🍽️";
    case "chef": return "👨‍🍳";
    default: return "👤";
  }
}

// ================= 7. SAHIFA: 1. DASHBOARD =================
function renderDashboard() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = STATE.orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
  const todayPaid = todayOrders.filter(o => o.status === "completed");
  const todaySales = todayPaid.reduce((sum, o) => sum + (o.total || 0), 0);

  const kitchenActive = STATE.orders.filter(o => ["new", "preparing"].includes(o.kitchenStatus));
  const occupiedTables = STATE.tables.filter(t => t.status !== "vacant");
  const waitingBill = STATE.tables.filter(t => t.status === "waiting_bill");
  const vacantTables = STATE.tables.filter(t => t.status === "vacant");

  // KPI kartalari
  document.getElementById("dashTodaySales").textContent = formatMoney(todaySales);
  document.getElementById("dashTodayOrdersCount").textContent = `${todayOrders.length} ta`;
  document.getElementById("dashClosedOrdersCount").textContent = `${todayPaid.length} ta to'langan`;
  document.getElementById("dashKitchenActiveCount").textContent = `${kitchenActive.length} ta`;
  document.getElementById("dashOccupiedTablesCount").textContent = `${occupiedTables.length} ta`;
  document.getElementById("dashWaitingBillCount").textContent = `${waitingBill.length} ta hisob kutmoqda`;
  document.getElementById("dashVacantTablesCount").textContent = `${vacantTables.length} ta`;
  document.getElementById("dashTotalTablesSub").textContent = `Jami ${STATE.tables.length} ta stol`;

  // Oxirgi buyurtmalar ro'yxati
  const tbody = document.getElementById("dashRecentOrdersBody");
  if (tbody) {
    tbody.innerHTML = "";
    const recent = [...STATE.orders].reverse().slice(0, 7);

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Hozircha buyurtmalar yo'q</td></tr>`;
    } else {
      recent.forEach(order => {
        const tr = document.createElement("tr");
        const itemsSummary = order.items.map(it => `${it.name} (x${it.qty})`).join(", ");
        tr.innerHTML = `
          <td><strong>${order.orderNumber}</strong></td>
          <td><span class="badge badge-table">${order.tableName}</span></td>
          <td><small>${formatTimeOnly(order.createdAt)}</small></td>
          <td><div class="table-dishes-cell" title="${itemsSummary}">${itemsSummary}</div></td>
          <td><strong>${formatMoney(order.total)}</strong></td>
          <td><span class="status-chip status-${order.status}">${getOrderStatusLabel(order.status)}</span></td>
          <td>
            <button class="btn btn-outline btn-xs" onclick="openOrderFromDashboard(${order.id})">Ko'rish</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Eng ko'p sotilgan taomlar
  renderTopDishes("dashTopDishesList");
}

function getOrderStatusLabel(status) {
  switch (status) {
    case "new": return "Yangi";
    case "preparing": return "Tayyorlanmoqda";
    case "ready": return "Tayyor";
    case "served": return "Berildi";
    case "completed": return "To'langan";
    case "cancelled": return "Bekor qilingan";
    default: return status;
  }
}

function renderTopDishes(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Taomlar sonini hisoblash
  const counts = {};
  STATE.orders.forEach(order => {
    if (order.status !== "cancelled") {
      order.items.forEach(it => {
        if (!counts[it.productId]) {
          counts[it.productId] = { id: it.productId, name: it.name, count: 0, total: 0 };
        }
        counts[it.productId].count += it.qty;
        counts[it.productId].total += it.total;
      });
    }
  });

  const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);

  if (sorted.length === 0) {
    container.innerHTML = `<p class="text-muted text-center" style="padding: 20px;">Hozircha sotuvlar ma'lumotlari mavjud emas</p>`;
    return;
  }

  container.innerHTML = "";
  sorted.forEach((dish, idx) => {
    const row = document.createElement("div");
    row.className = "top-dish-item";
    row.innerHTML = `
      <div class="dish-rank rank-${idx + 1}">${idx + 1}</div>
      <div class="top-dish-info">
        <strong>${dish.name}</strong>
        <small>${dish.count} ta porsiya sotilgan</small>
      </div>
      <div class="top-dish-sum text-green">
        ${formatMoney(dish.total)}
      </div>
    `;
    container.appendChild(row);
  });
}

function openOrderFromDashboard(orderId) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (!order) return;

  if (order.status === "completed") {
    // Chekni ko'rsatish
    showReceiptModal(order);
  } else {
    // Kassa yoki buyurtma oynasiga o'tish
    openTableDetailModal(order.tableId);
  }
}

// ================= 8. SAHIFA: 2. STOLLAR =================
function renderTablesView() {
  const grid = document.getElementById("posTablesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  // Hisob-kitoblar
  let countVacant = 0;
  let countOccupied = 0;
  let countPreparing = 0;
  let countWaiting = 0;

  STATE.tables.forEach(table => {
    if (table.status === "vacant") countVacant++;
    else if (table.status === "occupied") countOccupied++;
    else if (table.status === "preparing") countPreparing++;
    else if (table.status === "waiting_bill") countWaiting++;
  });

  // Filter hisoblagichlari
  document.getElementById("countAllTables").textContent = STATE.tables.length;
  document.getElementById("countVacantTables").textContent = countVacant;
  document.getElementById("countOccupiedTables").textContent = countOccupied;
  document.getElementById("countPreparingTables").textContent = countPreparing;
  document.getElementById("countWaitingTables").textContent = countWaiting;

  // Filtrlash
  const filtered = STATE.filterTableStatus === "all"
    ? STATE.tables
    : STATE.tables.filter(t => t.status === STATE.filterTableStatus);

  filtered.forEach(table => {
    const card = document.createElement("div");
    card.className = `pos-table-card table-${table.status}`;

    // Agar stol band bo'lsa, joriy zakaz ma'lumotlarini olamiz
    const activeOrder = STATE.orders.find(o => o.id === table.currentOrderId && o.status !== "completed");
    
    let orderInfoHTML = "";
    if (activeOrder) {
      const itemsCount = activeOrder.items.reduce((s, it) => s + it.qty, 0);
      orderInfoHTML = `
        <div class="table-card-order-info">
          <div class="order-info-line">
            <span>Buyurtma:</span>
            <strong>${activeOrder.orderNumber}</strong>
          </div>
          <div class="order-info-line">
            <span>Taomlar:</span>
            <strong>${itemsCount} ta</strong>
          </div>
          <div class="order-info-line total-line">
            <span>Jami:</span>
            <strong class="text-green">${formatMoney(activeOrder.total)}</strong>
          </div>
          <div class="table-card-time">⏰ ${formatTimeOnly(activeOrder.createdAt)} (${activeOrder.waiterName || "Ofitsiant"})</div>
        </div>
      `;
    } else {
      orderInfoHTML = `
        <div class="table-card-vacant-hint">
          <span>🟢 Stol bo'sh</span>
          <small>Buyurtma olish uchun bosing</small>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="table-card-top">
        <span class="table-number-label">${table.name}</span>
        <span class="table-status-pill pill-${table.status}">${getTableStatusLabel(table.status)}</span>
      </div>
      ${orderInfoHTML}
      <div class="table-card-bottom-actions">
        <button class="btn btn-sm btn-block ${table.status === 'vacant' ? 'btn-primary' : 'btn-secondary'}">
          ${table.status === 'vacant' ? '➕ Yangi Buyurtma' : '👁️ Buyurtmani Ko\'rish'}
        </button>
      </div>
    `;

    card.onclick = () => onTableCardClick(table);
    grid.appendChild(card);
  });
}

function getTableStatusLabel(status) {
  switch (status) {
    case "vacant": return "Bo'sh";
    case "occupied": return "Band";
    case "preparing": return "Tayyorlanmoqda";
    case "waiting_bill": return "Hisob kutmoqda";
    default: return status;
  }
}

function onTableCardClick(table) {
  if (table.status === "vacant") {
    // To'g'ridan-to'g'ri yangi buyurtma olishga o'tamiz
    startNewOrderForTable(table.id);
  } else {
    // Mavjud buyurtma tafsilotlari modalini ochamiz
    openTableDetailModal(table.id);
  }
}

// ================= 9. SAHIFA: 3. BUYURTMALAR (ZAKAZ YARATISH VA TAHRIRLASH) =================
function renderOrdersView() {
  // 1. Stollar dropdownini to'ldirish
  const select = document.getElementById("orderSelectTable");
  if (select) {
    select.innerHTML = "";
    STATE.tables.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      const occText = t.status !== "vacant" ? ` (${getTableStatusLabel(t.status)})` : " (Bo'sh)";
      opt.textContent = `${t.name}${occText}`;
      if (t.id === STATE.currentOrderCart.tableId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  // 2. Mijozlar dropdownini to'ldirish
  const custSelect = document.getElementById("orderSelectCustomer");
  if (custSelect) {
    custSelect.innerHTML = `<option value="">Oddiy mijoz (biriktirilmagan)</option>`;
    STATE.customers.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.name} (${c.phone})`;
      if (c.id === STATE.currentOrderCart.customerId) opt.selected = true;
      custSelect.appendChild(opt);
    });
  }

  // 3. Kategoriyalar barini render qilish
  renderOrderCategoriesBar();

  // 4. Taomlar gridini render qilish
  renderOrderDishesGrid();

  // 5. Savatchani render qilish
  renderOrderCart();
}

function renderOrderCategoriesBar() {
  const bar = document.getElementById("menuCategoriesBar");
  if (!bar) return;
  bar.innerHTML = "";

  // Barcha taomlar
  const allBtn = document.createElement("button");
  allBtn.className = `cat-btn ${STATE.activeOrderCategory === 'all' ? 'active' : ''}`;
  allBtn.innerHTML = `<span>🍽️ Barchasi</span>`;
  allBtn.onclick = () => {
    STATE.activeOrderCategory = "all";
    renderOrderCategoriesBar();
    renderOrderDishesGrid();
  };
  bar.appendChild(allBtn);

  STATE.categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `cat-btn ${STATE.activeOrderCategory === cat.id ? 'active' : ''}`;
    btn.innerHTML = `<span>${cat.icon} ${cat.name}</span>`;
    btn.onclick = () => {
      STATE.activeOrderCategory = cat.id;
      renderOrderCategoriesBar();
      renderOrderDishesGrid();
    };
    bar.appendChild(btn);
  });
}

function renderOrderDishesGrid() {
  const grid = document.getElementById("menuDishesGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const searchInput = document.getElementById("inputMenuSearch");
  const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

  let filtered = STATE.products.filter(p => p.isAvailable !== false);

  if (STATE.activeOrderCategory !== "all") {
    filtered = filtered.filter(p => p.categoryId === STATE.activeOrderCategory);
  }

  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      String(p.price).includes(query)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-search-hint">Ushbu toifada yoki so'rov bo'yicha taom topilmadi.</div>`;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "dish-card";
    card.innerHTML = `
      <div class="dish-card-icon">${product.icon || "🍲"}</div>
      <div class="dish-card-body">
        <h4 class="dish-card-title">${product.name}</h4>
        <div class="dish-card-price">${formatMoney(product.price)}</div>
      </div>
      <button class="dish-add-btn" title="Buyurtmaga qo'shish">+</button>
    `;

    card.onclick = () => addItemToCart(product);
    grid.appendChild(card);
  });
}

function addItemToCart(product) {
  // Validatsiya
  if (!product || product.price < 0) {
    alert("Noto'g'ri mahsulot narxi!");
    return;
  }

  const cart = STATE.currentOrderCart;
  const existing = cart.items.find(i => i.productId === product.id && !i.notes);

  if (existing) {
    existing.qty += 1;
    existing.total = existing.qty * existing.price;
  } else {
    cart.items.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      total: product.price,
      notes: ""
    });
  }

  renderOrderCart();
}

function updateCartItemQty(index, delta) {
  const cart = STATE.currentOrderCart;
  if (!cart.items[index]) return;

  cart.items[index].qty += delta;

  if (cart.items[index].qty <= 0) {
    cart.items.splice(index, 1);
  } else {
    cart.items[index].total = cart.items[index].qty * cart.items[index].price;
  }

  renderOrderCart();
}

function removeCartItem(index) {
  STATE.currentOrderCart.items.splice(index, 1);
  renderOrderCart();
}

function openItemNoteModal(index) {
  STATE.currentEditingItemIndex = index;
  const item = STATE.currentOrderCart.items[index];
  if (!item) return;

  document.getElementById("noteDishTitle").innerHTML = `<strong>${item.name}</strong> uchun maxsus izoh:`;
  document.getElementById("inputItemNote").value = item.notes || "";
  openModal("modalItemNote");
}

function saveItemNote() {
  if (STATE.currentEditingItemIndex !== null) {
    const input = document.getElementById("inputItemNote");
    const item = STATE.currentOrderCart.items[STATE.currentEditingItemIndex];
    if (item) {
      item.notes = input.value.trim();
    }
  }
  closeModal("modalItemNote");
  renderOrderCart();
}

function setQuickNote(text) {
  const input = document.getElementById("inputItemNote");
  if (input) {
    input.value = text;
  }
}

function renderOrderCart() {
  const listContainer = document.getElementById("cartItemsList");
  const emptyState = document.getElementById("cartEmptyState");
  const cart = STATE.currentOrderCart;

  const currentTable = STATE.tables.find(t => t.id === Number(cart.tableId));
  const badge = document.getElementById("cartTableBadge");
  if (badge && currentTable) {
    badge.textContent = currentTable.name;
  }

  if (!listContainer) return;

  if (!cart.items || cart.items.length === 0) {
    listContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "flex";
  } else {
    if (emptyState) emptyState.style.display = "none";
    listContainer.innerHTML = "";

    cart.items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <div class="cart-item-main">
          <div class="cart-item-title">
            <strong>${item.name}</strong>
            ${item.notes ? `<span class="cart-item-note">💬 ${item.notes}</span>` : ""}
          </div>
          <div class="cart-item-price-unit">${formatMoney(item.price)}</div>
        </div>

        <div class="cart-item-controls">
          <div class="qty-control-box">
            <button class="btn-qty" onclick="updateCartItemQty(${idx}, -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="btn-qty" onclick="updateCartItemQty(${idx}, 1)">+</button>
          </div>
          <div class="cart-item-total">${formatMoney(item.total)}</div>
          <button class="btn-item-note" onclick="openItemNoteModal(${idx})" title="Izoh yozish">💬</button>
          <button class="btn-item-del" onclick="removeCartItem(${idx})" title="O'chirish">🗑️</button>
        </div>
      `;
      listContainer.appendChild(row);
    });
  }

  // Hisob-kitob
  const subtotal = cart.items.reduce((s, it) => s + it.total, 0);
  const chkService = document.getElementById("chkCartServiceCharge");
  const servicePercent = STATE.settings.serviceChargePercent || 10;
  document.getElementById("cartServicePercent").textContent = servicePercent;

  const serviceCharge = (chkService && chkService.checked) ? Math.round(subtotal * (servicePercent / 100)) : 0;
  const grandTotal = subtotal + serviceCharge;

  document.getElementById("cartSubtotal").textContent = formatMoney(subtotal);
  document.getElementById("cartServiceCharge").textContent = formatMoney(serviceCharge);
  document.getElementById("cartGrandTotal").textContent = formatMoney(grandTotal);
}

function startNewOrderForTable(tableId) {
  STATE.currentOrderCart.tableId = tableId;
  STATE.currentOrderCart.items = [];
  STATE.currentOrderCart.customerId = null;

  // Agar stolda oldin zakaz bo'lsa uni yuklaymiz
  const table = STATE.tables.find(t => t.id === tableId);
  if (table && table.currentOrderId) {
    const existingOrder = STATE.orders.find(o => o.id === table.currentOrderId && o.status !== "completed");
    if (existingOrder) {
      STATE.currentOrderCart.items = JSON.parse(JSON.stringify(existingOrder.items));
      STATE.currentOrderCart.customerId = existingOrder.customerId;
    }
  }

  navigateTo("orders");
}

// 16. MUHIM ISH JARAYONI: OSHXONAGA BUYURTMANI YUBORISH
function sendOrderToKitchen() {
  const cart = STATE.currentOrderCart;

  // VALIDATSIYA 1: Bo'sh buyurtma yuborilmasin
  if (!cart.items || cart.items.length === 0) {
    alert("Iltimos, avval stolga kamida bitta taom tanlang!");
    return;
  }

  // VALIDATSIYA 2: Stol to'g'ri tanlanganligini tekshirish
  const table = STATE.tables.find(t => t.id === Number(cart.tableId));
  if (!table) {
    alert("Iltimos, stolni tanlang!");
    return;
  }

  const subtotal = cart.items.reduce((s, it) => s + it.total, 0);
  const chkService = document.getElementById("chkCartServiceCharge");
  const servicePercent = STATE.settings.serviceChargePercent || 10;
  const serviceCharge = (chkService && chkService.checked) ? Math.round(subtotal * (servicePercent / 100)) : 0;
  const grandTotal = subtotal + serviceCharge;

  // Mijoz ma'lumoti
  let customerName = "Oddiy mijoz";
  if (cart.customerId) {
    const cust = STATE.customers.find(c => c.id === Number(cart.customerId));
    if (cust) customerName = cust.name;
  }

  // Mavjud buyurtma bormi yoki yangisi
  let order = null;
  if (table.currentOrderId) {
    order = STATE.orders.find(o => o.id === table.currentOrderId && o.status !== "completed");
  }

  if (order) {
    // Buyurtmani yangilash
    order.items = JSON.parse(JSON.stringify(cart.items));
    order.subtotal = subtotal;
    order.serviceCharge = serviceCharge;
    order.total = grandTotal;
    order.customerId = cart.customerId;
    order.customerName = customerName;
    order.status = "preparing";
    order.kitchenStatus = "new"; // Oshpazga yangi qo'shilgan taomlar haqida bildirish
  } else {
    // Yangi buyurtma yaratish
    order = {
      id: Date.now(),
      orderNumber: generateOrderNumber(),
      tableId: table.id,
      tableName: table.name,
      customerId: cart.customerId,
      customerName: customerName,
      waiterId: STATE.currentUser?.id || 1,
      waiterName: STATE.currentUser?.name || "Ofitsiant",
      items: JSON.parse(JSON.stringify(cart.items)),
      status: "new",
      kitchenStatus: "new",
      subtotal: subtotal,
      serviceCharge: serviceCharge,
      total: grandTotal,
      createdAt: new Date().toISOString(),
      paymentMethod: null
    };
    STATE.orders.push(order);
  }

  // Stol holatini yangilash
  table.status = "preparing";
  table.currentOrderId = order.id;

  saveState();

  alert(`✅ ${order.orderNumber} raqamli buyurtma ${table.name} uchun Oshxonaga muvaffaqiyatli yuborildi!`);
  
  // Stollar ekraniga qaytish
  navigateTo("tables");
}

// ================= 10. SAHIFA: 4. OSHXONA (KDS) =================
function renderKitchenView() {
  const colNew = document.getElementById("kdsCardsNew");
  const colPrep = document.getElementById("kdsCardsPrep");
  const colReady = document.getElementById("kdsCardsReady");
  const colServed = document.getElementById("kdsCardsServed");

  if (!colNew || !colPrep || !colReady || !colServed) return;

  colNew.innerHTML = "";
  colPrep.innerHTML = "";
  colReady.innerHTML = "";
  colServed.innerHTML = "";

  const activeOrders = STATE.orders.filter(o => o.status !== "completed" && o.status !== "cancelled");

  let countNew = 0, countPrep = 0, countReady = 0, countServed = 0;

  activeOrders.forEach(order => {
    const kStatus = order.kitchenStatus || "new";

    const card = document.createElement("div");
    card.className = `kds-order-card kds-status-${kStatus}`;

    // Taomlar ro'yxati
    let itemsHTML = "";
    order.items.forEach((it, idx) => {
      itemsHTML += `
        <div class="kds-dish-line">
          <span class="kds-dish-name"><strong>${idx + 1}. ${it.name}</strong> ${it.notes ? `<small class="kds-note">(${it.notes})</small>` : ""}</span>
          <span class="kds-dish-qty">x ${it.qty}</span>
        </div>
      `;
    });

    // Tugmalar
    let actionBtnHTML = "";
    if (kStatus === "new") {
      countNew++;
      actionBtnHTML = `
        <button class="btn btn-warning btn-sm btn-block" onclick="changeKitchenOrderStatus(${order.id}, 'preparing')">
          👨‍🍳 Qabul qilish (Tayyorlanmoqda)
        </button>
      `;
      colNew.appendChild(card);
    } else if (kStatus === "preparing") {
      countPrep++;
      actionBtnHTML = `
        <button class="btn btn-success btn-sm btn-block" onclick="changeKitchenOrderStatus(${order.id}, 'ready')">
          ✅ Tayyor bo'ldi (Ofitsiantga)
        </button>
      `;
      colPrep.appendChild(card);
    } else if (kStatus === "ready") {
      countReady++;
      actionBtnHTML = `
        <button class="btn btn-primary btn-sm btn-block" onclick="changeKitchenOrderStatus(${order.id}, 'served')">
          🍽️ Mijozga Berildi
        </button>
      `;
      colReady.appendChild(card);
    } else {
      countServed++;
      actionBtnHTML = `
        <div class="kds-served-tag">Mijozda ovqatlanmoqda ✓</div>
      `;
      colServed.appendChild(card);
    }

    card.innerHTML = `
      <div class="kds-card-top">
        <div>
          <span class="kds-order-num">${order.orderNumber}</span>
          <span class="kds-table-badge">${order.tableName}</span>
        </div>
        <span class="kds-time">⏰ ${formatTimeOnly(order.createdAt)}</span>
      </div>
      <div class="kds-waiter-info">Ofitsiant: <strong>${order.waiterName || "Ali"}</strong></div>
      <div class="kds-dishes-box">
        ${itemsHTML}
      </div>
      <div class="kds-card-footer">
        ${actionBtnHTML}
      </div>
    `;
  });

  document.getElementById("kdsCountNew").textContent = countNew;
  document.getElementById("kdsCountPrep").textContent = countPrep;
  document.getElementById("kdsCountReady").textContent = countReady;
  document.getElementById("kdsCountServed").textContent = countServed;
  document.getElementById("kdsBadgeActive").textContent = `${countNew + countPrep + countReady} ta faol zakaz`;
}

function changeKitchenOrderStatus(orderId, newStatus) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (!order) return;

  order.kitchenStatus = newStatus;

  // Asosiy stol holatini ham yangilash
  const table = STATE.tables.find(t => t.id === order.tableId);
  if (table) {
    if (newStatus === "preparing") {
      table.status = "preparing";
      order.status = "preparing";
    } else if (newStatus === "ready") {
      table.status = "occupied";
      order.status = "ready";
    } else if (newStatus === "served") {
      table.status = "occupied";
      order.status = "served";
    }
  }

  saveState();
  renderKitchenView();
  updateHeaderKPIs();
}

// ================= 11. SAHIFA: 5. KASSA VA TO'LOV QABUL QILISH =================
function renderCashierView() {
  const ordersContainer = document.getElementById("cashierOrdersList");
  if (!ordersContainer) return;
  ordersContainer.innerHTML = "";

  // To'lov kutayotgan barcha faol buyurtmalar
  const openOrders = STATE.orders.filter(o => o.status !== "completed" && o.status !== "cancelled");
  document.getElementById("cashierWaitingOrdersCount").textContent = `${openOrders.length} ta buyurtma`;

  // Bugungi kassa tushumi
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySales = STATE.orders
    .filter(o => o.status === "completed" && o.completedAt && o.completedAt.startsWith(todayStr))
    .reduce((s, o) => s + (o.total || 0), 0);
  document.getElementById("cashierTotalToday").textContent = formatMoney(todaySales);

  if (openOrders.length === 0) {
    ordersContainer.innerHTML = `
      <div class="cart-empty-state">
        <span class="empty-icon">🟢</span>
        <p>Hozirda barcha hisoblar yopilgan</p>
      </div>
    `;
    selectCashierOrder(null);
    return;
  }

  openOrders.forEach(order => {
    const isSelected = order.id === STATE.selectedCashierOrderId;
    const card = document.createElement("div");
    card.className = `cashier-order-item ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="c-order-top">
        <strong>${order.tableName}</strong>
        <span class="badge badge-purple">${order.orderNumber}</span>
      </div>
      <div class="c-order-mid">
        <span>Taomlar: ${order.items.reduce((s, it) => s + it.qty, 0)} ta</span>
        <span>⏰ ${formatTimeOnly(order.createdAt)}</span>
      </div>
      <div class="c-order-total text-green">${formatMoney(order.total)}</div>
    `;

    card.onclick = () => selectCashierOrder(order.id);
    ordersContainer.appendChild(card);
  });

  // Agar oldin tanlanmagan bo'lsa birinchisini avtomatik tanlaymiz
  if (!STATE.selectedCashierOrderId && openOrders.length > 0) {
    selectCashierOrder(openOrders[0].id);
  } else {
    renderSelectedCashierOrderPanel();
  }
}

function selectCashierOrder(orderId) {
  STATE.selectedCashierOrderId = orderId;
  const items = document.querySelectorAll(".cashier-order-item");
  items.forEach(el => el.classList.remove("selected"));

  renderSelectedCashierOrderPanel();
}

function renderSelectedCashierOrderPanel() {
  const emptyBox = document.getElementById("cashierPayContentEmpty");
  const activeBox = document.getElementById("cashierPayContentActive");
  const tag = document.getElementById("paySelectedTableTag");

  if (!STATE.selectedCashierOrderId) {
    if (emptyBox) emptyBox.style.display = "flex";
    if (activeBox) activeBox.style.display = "none";
    if (tag) tag.textContent = "Stol tanlanmagan";
    return;
  }

  const order = STATE.orders.find(o => o.id === STATE.selectedCashierOrderId);
  if (!order) {
    STATE.selectedCashierOrderId = null;
    renderSelectedCashierOrderPanel();
    return;
  }

  if (emptyBox) emptyBox.style.display = "none";
  if (activeBox) activeBox.style.display = "block";

  if (tag) tag.textContent = `${order.tableName} — ${order.orderNumber}`;

  document.getElementById("payOrderNumber").textContent = order.orderNumber;
  document.getElementById("payOrderTime").textContent = `Vaqt: ${formatDate(order.createdAt)}`;
  document.getElementById("payOrderWaiter").textContent = order.waiterName || "Ali";

  // Taomlar ro'yxati
  const tbody = document.getElementById("payOrderItemsBody");
  if (tbody) {
    tbody.innerHTML = "";
    order.items.forEach((it, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}. ${it.name}</td>
        <td style="text-align:center;">${it.qty}</td>
        <td style="text-align:right;">${formatMoney(it.price)}</td>
        <td style="text-align:right; font-weight:bold;">${formatMoney(it.total)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById("paySubtotal").textContent = formatMoney(order.subtotal);
  document.getElementById("payServiceCharge").textContent = formatMoney(order.serviceCharge);
  document.getElementById("payGrandTotal").textContent = formatMoney(order.total);

  // Naqd kalkulyatori
  const inpCash = document.getElementById("inputCashReceived");
  if (inpCash) {
    inpCash.value = "";
    calculateCashChange();
  }
}

function calculateCashChange() {
  const order = STATE.orders.find(o => o.id === STATE.selectedCashierOrderId);
  const total = order ? order.total : 0;
  const input = document.getElementById("inputCashReceived");
  const given = input ? (Number(input.value) || 0) : 0;

  const change = Math.max(0, given - total);
  const changeEl = document.getElementById("textCashChange");
  if (changeEl) {
    changeEl.textContent = formatMoney(change);
  }
}

// 16. MUHIM ISH JARAYONI: TO'LOVNI QABUL QILISH VA CHEK CHIQARISH
function executePayment() {
  const order = STATE.orders.find(o => o.id === STATE.selectedCashierOrderId);
  if (!order) {
    alert("Iltimos, to'lov uchun buyurtmani tanlang!");
    return;
  }

  // To'lov usulini olish
  const methodRadio = document.querySelector('input[name="payMethod"]:checked');
  const payMethod = methodRadio ? methodRadio.value : "Naqd";

  // VALIDATSIYA: Agar naqd to'lov bo'lsa berilgan pulni tekshirish
  if (payMethod === "Naqd") {
    const input = document.getElementById("inputCashReceived");
    const given = Number(input.value) || 0;
    if (given > 0 && given < order.total) {
      alert(`Berilgan summa yetarli emas! Jami to'lov: ${formatMoney(order.total)}`);
      return;
    }
  }

  // Buyurtmani yopish
  order.status = "completed";
  order.paymentMethod = payMethod;
  order.completedAt = new Date().toISOString();
  order.cashierName = STATE.currentUser?.name || "Kassir";

  // Stolni bo'shatish
  const table = STATE.tables.find(t => t.id === order.tableId);
  if (table) {
    table.status = "vacant";
    table.currentOrderId = null;
  }

  // Mijoz hisobini yangilash
  if (order.customerId) {
    const customer = STATE.customers.find(c => c.id === Number(order.customerId));
    if (customer) {
      customer.ordersCount = (customer.ordersCount || 0) + 1;
      customer.totalSpent = (customer.totalSpent || 0) + order.total;
      customer.lastOrderAt = order.completedAt;
    }
  }

  saveState();

  // Chek chiqarish modalini ochish
  showReceiptModal(order);

  // Kassa ko'rinishini yangilash
  STATE.selectedCashierOrderId = null;
  renderCashierView();
}

// ================= 12. CHEK CHIQARISH (PRINT & PDF VIEW) =================
function showReceiptModal(order) {
  const paper = document.getElementById("printableReceipt");
  if (!paper || !order) return;

  let itemsHTML = "";
  order.items.forEach((it, idx) => {
    itemsHTML += `
      <tr>
        <td style="padding: 3px 0;">${idx + 1}. ${it.name}</td>
        <td style="text-align: center; padding: 3px 0;">${it.qty}</td>
        <td style="text-align: right; padding: 3px 0;">${Number(it.price).toLocaleString("uz-UZ")}</td>
        <td style="text-align: right; font-weight: bold; padding: 3px 0;">${Number(it.total).toLocaleString("uz-UZ")}</td>
      </tr>
    `;
  });

  paper.innerHTML = `
    <div class="thermal-receipt">
      <div class="receipt-header">
        <h2>${STATE.settings.restaurantName.toUpperCase()}</h2>
        <p>${STATE.settings.receiptHeader}</p>
        <p>Tel: ${STATE.settings.phone}</p>
        <p>${STATE.settings.address}</p>
      </div>

      <div class="receipt-divider">================================</div>

      <div class="receipt-info-grid">
        <div>Sana: ${formatDate(order.completedAt || order.createdAt)}</div>
        <div>Chek №: <strong>${order.orderNumber}</strong></div>
        <div>Stol: <strong>${order.tableName.toUpperCase()}</strong></div>
        <div>Ofitsiant: ${order.waiterName || "Ali"}</div>
        <div>Kassir: ${order.cashierName || STATE.currentUser?.name || "Kassir"}</div>
        ${order.customerName ? `<div>Mijoz: ${order.customerName}</div>` : ""}
      </div>

      <div class="receipt-divider">--------------------------------</div>

      <table class="receipt-items-table">
        <thead>
          <tr>
            <th style="text-align: left;">Taom</th>
            <th style="text-align: center;">Soni</th>
            <th style="text-align: right;">Narx</th>
            <th style="text-align: right;">Jami</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="receipt-divider">--------------------------------</div>

      <div class="receipt-totals-box">
        <div class="r-row">
          <span>Taomlar summasi:</span>
          <span>${formatMoney(order.subtotal)}</span>
        </div>
        ${order.serviceCharge > 0 ? `
        <div class="r-row">
          <span>Xizmat haqi (${STATE.settings.serviceChargePercent}%):</span>
          <span>${formatMoney(order.serviceCharge)}</span>
        </div>` : ""}
        <div class="r-row r-grand-total">
          <strong>JAMI TO'LOV:</strong>
          <strong>${formatMoney(order.total)}</strong>
        </div>
        <div class="r-row">
          <span>To'lov turi:</span>
          <strong>${order.paymentMethod || "Naqd"}</strong>
        </div>
      </div>

      <div class="receipt-divider">================================</div>

      <div class="receipt-footer">
        <p>*** TO'LOV MUVAFFAQIYATLI QABUL QILINDI ***</p>
        <p>${STATE.settings.receiptFooter}</p>
      </div>
    </div>
  `;

  openModal("modalReceipt");
}

// ================= 13. STOL TAFSILOTLARI VA STOLNI KO'CHIRISH =================
function openTableDetailModal(tableId) {
  const table = STATE.tables.find(t => t.id === tableId);
  if (!table) return;

  const title = document.getElementById("modalTableDetailTitle");
  const statusBadge = document.getElementById("modalTableDetailStatus");
  const body = document.getElementById("modalTableDetailBody");
  const footer = document.getElementById("modalTableDetailFooter");

  title.textContent = `🪑 ${table.name.toUpperCase()}`;
  statusBadge.textContent = getTableStatusLabel(table.status);
  statusBadge.className = `badge badge-${table.status}`;

  const activeOrder = STATE.orders.find(o => o.id === table.currentOrderId && o.status !== "completed");

  if (!activeOrder) {
    body.innerHTML = `
      <div class="text-center" style="padding: 24px;">
        <span style="font-size: 36px;">🟢</span>
        <h4>Ushbu stol hozirda bo'sh</h4>
        <p class="text-muted">Mijoz uchun yangi buyurtma olishingiz mumkin</p>
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-primary btn-block" onclick="closeModal('modalTableDetail'); startNewOrderForTable(${table.id});">
        ➕ Yangi Buyurtma Olish
      </button>
    `;
  } else {
    let itemsRows = "";
    activeOrder.items.forEach((it, idx) => {
      itemsRows += `
        <tr>
          <td>${idx + 1}. ${it.name} ${it.notes ? `<small class="text-muted">(${it.notes})</small>` : ""}</td>
          <td style="text-align:center;">${it.qty}</td>
          <td style="text-align:right;">${formatMoney(it.price)}</td>
          <td style="text-align:right; font-weight:bold;">${formatMoney(it.total)}</td>
        </tr>
      `;
    });

    body.innerHTML = `
      <div class="table-detail-meta">
        <div><strong>Buyurtma:</strong> ${activeOrder.orderNumber}</div>
        <div><strong>Vaqt:</strong> ${formatDate(activeOrder.createdAt)}</div>
        <div><strong>Ofitsiant:</strong> ${activeOrder.waiterName || "Ali"}</div>
        <div><strong>Mijoz:</strong> ${activeOrder.customerName || "Oddiy mijoz"}</div>
      </div>

      <div class="table-responsive" style="margin-top: 10px; max-height: 200px; overflow-y: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Taom</th>
              <th style="text-align:center;">Soni</th>
              <th style="text-align:right;">Narx</th>
              <th style="text-align:right;">Jami</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
      </div>

      <div class="table-detail-totals" style="margin-top: 12px; background: #f8fafc; padding: 10px; border-radius: 6px;">
        <div class="fin-row">
          <span>Taomlar summasi:</span>
          <strong>${formatMoney(activeOrder.subtotal)}</strong>
        </div>
        <div class="fin-row">
          <span>Xizmat haqi (${STATE.settings.serviceChargePercent}%):</span>
          <strong>${formatMoney(activeOrder.serviceCharge)}</strong>
        </div>
        <div class="fin-row fin-total" style="font-size: 16px; margin-top: 4px;">
          <span>JAMI SUMMA:</span>
          <strong class="text-green">${formatMoney(activeOrder.total)}</strong>
        </div>
      </div>
    `;

    // Tugmalar: Taom qo'shish, Stolni ko'chirish, Kassaga o'tish
    footer.innerHTML = `
      <div class="modal-buttons-grid">
        <button class="btn btn-warning" onclick="closeModal('modalTableDetail'); startNewOrderForTable(${table.id});">
          ➕ Taom Qo'shish / O'zgartirish
        </button>
        <button class="btn btn-secondary" onclick="openTransferTableModal(${table.id})">
          🔄 Boshqa Stolga Ko'chirish
        </button>
        <button class="btn btn-success" onclick="closeModal('modalTableDetail'); navigateTo('cashier'); selectCashierOrder(${activeOrder.id});">
          💵 Kassada To'lash
        </button>
      </div>
    `;
  }

  openModal("modalTableDetail");
}

// 13. STOL BUYURTMASINI O'ZGARTIRISH / KO'CHIRISH (1-stol -> 5-stol)
let currentTransferSourceTableId = null;

function openTransferTableModal(fromTableId) {
  closeModal("modalTableDetail");
  currentTransferSourceTableId = fromTableId;

  const fromTable = STATE.tables.find(t => t.id === fromTableId);
  document.getElementById("transferFromTableName").textContent = fromTable ? fromTable.name : `${fromTableId}-stol`;

  const select = document.getElementById("selectTransferTargetTable");
  select.innerHTML = "";

  // Faqat bo'sh stollarni ko'rsatamiz
  const vacantTables = STATE.tables.filter(t => t.status === "vacant");
  if (vacantTables.length === 0) {
    select.innerHTML = `<option value="">Barcha boshqa stollar band!</option>`;
    document.getElementById("btnConfirmTransferTable").disabled = true;
  } else {
    document.getElementById("btnConfirmTransferTable").disabled = false;
    vacantTables.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} (Bo'sh)`;
      select.appendChild(opt);
    });
  }

  openModal("modalTransferTable");
}

function confirmTransferTable() {
  const targetSelect = document.getElementById("selectTransferTargetTable");
  const targetTableId = Number(targetSelect.value);

  if (!targetTableId) {
    alert("Iltimos, ko'chirish uchun bo'sh stolni tanlang!");
    return;
  }

  const fromTable = STATE.tables.find(t => t.id === currentTransferSourceTableId);
  const targetTable = STATE.tables.find(t => t.id === targetTableId);

  if (!fromTable || !targetTable || !fromTable.currentOrderId) {
    alert("Xatolik: Stol yoki buyurtma topilmadi!");
    return;
  }

  const order = STATE.orders.find(o => o.id === fromTable.currentOrderId);
  if (order) {
    order.tableId = targetTable.id;
    order.tableName = targetTable.name;
  }

  targetTable.status = fromTable.status;
  targetTable.currentOrderId = fromTable.currentOrderId;

  fromTable.status = "vacant";
  fromTable.currentOrderId = null;

  saveState();
  closeModal("modalTransferTable");

  alert(`✅ Buyurtma muvaffaqiyatli ${fromTable.name}dan ${targetTable.name}ga ko'chirildi!`);
  renderTablesView();
}

// ================= 14. SAHIFA: 6. MENU (ADMIN TAOMLAR BOSHQARUVI) =================
function renderAdminMenuView() {
  const tbody = document.getElementById("menuAdminTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  // Kategoriya filtri dropdownini to'ldirish
  const catSelect = document.getElementById("selectAdminMenuCategory");
  if (catSelect && catSelect.children.length <= 1) {
    STATE.categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = `${c.icon} ${c.name}`;
      catSelect.appendChild(opt);
    });
  }

  const query = (document.getElementById("inputAdminMenuSearch")?.value || "").toLowerCase().trim();
  const selectedCat = document.getElementById("selectAdminMenuCategory")?.value || "all";
  const selectedStatus = document.getElementById("selectAdminMenuStatus")?.value || "all";

  let filtered = [...STATE.products];

  if (selectedCat !== "all") {
    filtered = filtered.filter(p => p.categoryId === selectedCat);
  }

  if (selectedStatus === "available") {
    filtered = filtered.filter(p => p.isAvailable !== false);
  } else if (selectedStatus === "unavailable") {
    filtered = filtered.filter(p => p.isAvailable === false);
  }

  if (query) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Taomlar topilmadi</td></tr>`;
    return;
  }

  filtered.forEach(p => {
    const cat = STATE.categories.find(c => c.id === p.categoryId);
    const catName = cat ? `${cat.icon} ${cat.name}` : p.categoryId;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-size: 24px; text-align: center;">${p.icon || "🍲"}</td>
      <td>
        <strong>${p.name}</strong>
        ${p.description ? `<br><small class="text-muted">${p.description}</small>` : ""}
      </td>
      <td><span class="badge">${catName}</span></td>
      <td><strong>${formatMoney(p.price)}</strong></td>
      <td>
        <button class="btn btn-xs ${p.isAvailable !== false ? 'btn-success' : 'btn-secondary'}" onclick="toggleProductAvailability(${p.id})">
          ${p.isAvailable !== false ? '🟢 Mavjud' : '⚪ Mavjud emas'}
        </button>
      </td>
      <td style="text-align: center;">
        <button class="btn btn-outline btn-xs" onclick="openEditProductModal(${p.id})">✏️ Tahrirlash</button>
        <button class="btn btn-text text-danger btn-xs" onclick="deleteProduct(${p.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function toggleProductAvailability(prodId) {
  const prod = STATE.products.find(p => p.id === prodId);
  if (!prod) return;
  prod.isAvailable = !prod.isAvailable;
  saveState();
  renderAdminMenuView();
}

function openAddProductModal() {
  document.getElementById("modalProductTitle").textContent = "➕ Yangi Taom Qo'shish";
  document.getElementById("prodEditId").value = "";
  document.getElementById("prodName").value = "";
  document.getElementById("prodPrice").value = "";
  document.getElementById("prodIcon").value = "🍲";
  document.getElementById("prodDescription").value = "";
  document.getElementById("prodStatus").value = "available";

  // Kategoriya dropdown
  const catSelect = document.getElementById("prodCategory");
  catSelect.innerHTML = "";
  STATE.categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.name}`;
    catSelect.appendChild(opt);
  });

  openModal("modalProduct");
}

function openEditProductModal(prodId) {
  const prod = STATE.products.find(p => p.id === prodId);
  if (!prod) return;

  document.getElementById("modalProductTitle").textContent = "✏️ Taomni Tahrirlash";
  document.getElementById("prodEditId").value = prod.id;
  document.getElementById("prodName").value = prod.name;
  document.getElementById("prodPrice").value = prod.price;
  document.getElementById("prodIcon").value = prod.icon || "🍲";
  document.getElementById("prodDescription").value = prod.description || "";
  document.getElementById("prodStatus").value = prod.isAvailable !== false ? "available" : "unavailable";

  const catSelect = document.getElementById("prodCategory");
  catSelect.innerHTML = "";
  STATE.categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = `${c.icon} ${c.name}`;
    if (c.id === prod.categoryId) opt.selected = true;
    catSelect.appendChild(opt);
  });

  openModal("modalProduct");
}

function saveProduct() {
  const editId = document.getElementById("prodEditId").value;
  const name = document.getElementById("prodName").value.trim();
  const price = Number(document.getElementById("prodPrice").value);
  const categoryId = document.getElementById("prodCategory").value;
  const icon = document.getElementById("prodIcon").value.trim() || "🍲";
  const description = document.getElementById("prodDescription").value.trim();
  const isAvailable = document.getElementById("prodStatus").value === "available";

  if (!name) {
    alert("Iltimos, taom nomini kiriting!");
    return;
  }
  if (!price || price <= 0) {
    alert("Narx 0 dan katta bo'lishi kerak!");
    return;
  }

  if (editId) {
    // Tahrirlash
    const p = STATE.products.find(item => item.id === Number(editId));
    if (p) {
      p.name = name;
      p.price = price;
      p.categoryId = categoryId;
      p.icon = icon;
      p.description = description;
      p.isAvailable = isAvailable;
    }
  } else {
    // Yangi qo'shish
    const newProduct = {
      id: Date.now(),
      name,
      price,
      categoryId,
      icon,
      description,
      isAvailable
    };
    STATE.products.push(newProduct);
  }

  saveState();
  closeModal("modalProduct");
  renderAdminMenuView();
  alert("Taom muvaffaqiyatli saqlandi!");
}

function deleteProduct(prodId) {
  if (!confirm("Haqiqatan ham ushbu taomni o'chirmoqchimisiz?")) return;
  STATE.products = STATE.products.filter(p => p.id !== prodId);
  saveState();
  renderAdminMenuView();
}

// ================= 15. SAHIFA: 7. KATEGORIYALAR =================
function renderCategoriesView() {
  const tbody = document.getElementById("categoriesTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  STATE.categories.forEach(cat => {
    const count = STATE.products.filter(p => p.categoryId === cat.id).length;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-size: 24px; text-align: center;">${cat.icon || "📂"}</td>
      <td><strong>${cat.name}</strong></td>
      <td><code>${cat.id}</code></td>
      <td><span class="badge">${count} ta taom</span></td>
      <td style="text-align: center;">
        <button class="btn btn-outline btn-xs" onclick="openEditCategoryModal('${cat.id}')">✏️</button>
        <button class="btn btn-text text-danger btn-xs" onclick="deleteCategory('${cat.id}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddCategoryModal() {
  document.getElementById("modalCategoryTitle").textContent = "➕ Yangi Kategoriya";
  document.getElementById("catEditId").value = "";
  document.getElementById("catName").value = "";
  document.getElementById("catIcon").value = "📂";
  openModal("modalCategory");
}

function openEditCategoryModal(catId) {
  const cat = STATE.categories.find(c => c.id === catId);
  if (!cat) return;
  document.getElementById("modalCategoryTitle").textContent = "✏️ Kategoriyani Tahrirlash";
  document.getElementById("catEditId").value = cat.id;
  document.getElementById("catName").value = cat.name;
  document.getElementById("catIcon").value = cat.icon || "📂";
  openModal("modalCategory");
}

function saveCategory() {
  const editId = document.getElementById("catEditId").value;
  const name = document.getElementById("catName").value.trim();
  const icon = document.getElementById("catIcon").value.trim() || "📂";

  if (!name) {
    alert("Iltimos, kategoriya nomini kiriting!");
    return;
  }

  if (editId) {
    const cat = STATE.categories.find(c => c.id === editId);
    if (cat) {
      cat.name = name;
      cat.icon = icon;
    }
  } else {
    const newId = name.toLowerCase().replace(/[^a-z0-9]/g, "") || ("cat_" + Date.now());
    STATE.categories.push({ id: newId, name, icon });
  }

  saveState();
  closeModal("modalCategory");
  renderCategoriesView();
}

function deleteCategory(catId) {
  if (!confirm("Ushbu kategoriyani o'chirmoqchimisiz?")) return;
  STATE.categories = STATE.categories.filter(c => c.id !== catId);
  saveState();
  renderCategoriesView();
}

// ================= 16. SAHIFA: 8. MIJOZLAR =================
function renderCustomersView() {
  const tbody = document.getElementById("customersTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (STATE.customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Mijozlar ro'yxati bo'sh</td></tr>`;
    return;
  }

  STATE.customers.forEach(cust => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${cust.name}</strong></td>
      <td>${cust.phone}</td>
      <td><span class="badge badge-blue">${cust.ordersCount || 0} ta</span></td>
      <td class="text-green"><strong>${formatMoney(cust.totalSpent || 0)}</strong></td>
      <td><small>${cust.lastOrderAt ? formatDate(cust.lastOrderAt) : "Hali yo'q"}</small></td>
      <td style="text-align: center;">
        <button class="btn btn-outline btn-xs" onclick="openEditCustomerModal(${cust.id})">✏️</button>
        <button class="btn btn-text text-danger btn-xs" onclick="deleteCustomer(${cust.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddCustomerModal() {
  document.getElementById("modalCustomerTitle").textContent = "➕ Yangi Mijoz";
  document.getElementById("custEditId").value = "";
  document.getElementById("custName").value = "";
  document.getElementById("custPhone").value = "+998 ";
  openModal("modalCustomer");
}

function openEditCustomerModal(custId) {
  const cust = STATE.customers.find(c => c.id === custId);
  if (!cust) return;
  document.getElementById("modalCustomerTitle").textContent = "✏️ Mijozni Tahrirlash";
  document.getElementById("custEditId").value = cust.id;
  document.getElementById("custName").value = cust.name;
  document.getElementById("custPhone").value = cust.phone;
  openModal("modalCustomer");
}

function saveCustomer() {
  const editId = document.getElementById("custEditId").value;
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();

  if (!name || !phone) {
    alert("Iltimos, ism va telefon raqamini kiriting!");
    return;
  }

  if (editId) {
    const cust = STATE.customers.find(c => c.id === Number(editId));
    if (cust) {
      cust.name = name;
      cust.phone = phone;
    }
  } else {
    STATE.customers.push({
      id: Date.now(),
      name,
      phone,
      ordersCount: 0,
      totalSpent: 0,
      lastOrderAt: null
    });
  }

  saveState();
  closeModal("modalCustomer");
  renderCustomersView();
}

function deleteCustomer(custId) {
  if (!confirm("Ushbu mijozni o'chirmoqchimisiz?")) return;
  STATE.customers = STATE.customers.filter(c => c.id !== custId);
  saveState();
  renderCustomersView();
}

// ================= 17. SAHIFA: 9. XODIMLAR VA ROLLAR =================
function renderStaffView() {
  const tbody = document.getElementById("staffTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  STATE.staff.forEach(user => {
    const isCurrent = STATE.currentUser && STATE.currentUser.id === user.id;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${user.name}</strong> ${isCurrent ? '<span class="badge badge-green">Siz</span>' : ''}</td>
      <td><span class="badge badge-purple">${getRoleDisplayName(user.role)}</span></td>
      <td>${user.phone || "-"}</td>
      <td><code>**** (${user.pin})</code></td>
      <td><span class="badge badge-green">Faol</span></td>
      <td style="text-align: center;">
        <button class="btn btn-outline btn-xs" onclick="openEditStaffModal(${user.id})">✏️</button>
        ${!isCurrent ? `<button class="btn btn-text text-danger btn-xs" onclick="deleteStaff(${user.id})">🗑️</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddStaffModal() {
  document.getElementById("modalStaffTitle").textContent = "➕ Yangi Xodim Qo'shish";
  document.getElementById("staffEditId").value = "";
  document.getElementById("staffName").value = "";
  document.getElementById("staffRole").value = "waiter";
  document.getElementById("staffPin").value = "";
  document.getElementById("staffPhone").value = "+998 ";
  openModal("modalStaff");
}

function openEditStaffModal(staffId) {
  const user = STATE.staff.find(s => s.id === staffId);
  if (!user) return;
  document.getElementById("modalStaffTitle").textContent = "✏️ Xodimni Tahrirlash";
  document.getElementById("staffEditId").value = user.id;
  document.getElementById("staffName").value = user.name;
  document.getElementById("staffRole").value = user.role;
  document.getElementById("staffPin").value = user.pin;
  document.getElementById("staffPhone").value = user.phone || "";
  openModal("modalStaff");
}

function saveStaff() {
  const editId = document.getElementById("staffEditId").value;
  const name = document.getElementById("staffName").value.trim();
  const role = document.getElementById("staffRole").value;
  const pin = document.getElementById("staffPin").value.trim();
  const phone = document.getElementById("staffPhone").value.trim();

  if (!name || !pin) {
    alert("Iltimos, xodim ismi va PIN kodini kiriting!");
    return;
  }

  if (editId) {
    const user = STATE.staff.find(s => s.id === Number(editId));
    if (user) {
      user.name = name;
      user.role = role;
      user.pin = pin;
      user.phone = phone;
    }
  } else {
    STATE.staff.push({
      id: Date.now(),
      name,
      role,
      pin,
      phone,
      active: true
    });
  }

  saveState();
  closeModal("modalStaff");
  renderStaffView();
}

function deleteStaff(staffId) {
  if (!confirm("Ushbu xodimni o'chirmoqchimisiz?")) return;
  STATE.staff = STATE.staff.filter(s => s.id !== staffId);
  saveState();
  renderStaffView();
}

// Rol / Foydalanuvchi almashtirish modali
function openRoleSwitchModal() {
  const container = document.getElementById("roleSwitchList");
  if (!container) return;
  container.innerHTML = "";

  STATE.staff.forEach(user => {
    const isCurrent = STATE.currentUser?.id === user.id;
    const card = document.createElement("div");
    card.className = `role-switch-item ${isCurrent ? 'active' : ''}`;
    card.innerHTML = `
      <div class="rsi-left">
        <span class="rsi-avatar">${getRoleAvatar(user.role)}</span>
        <div>
          <strong>${user.name}</strong>
          <small class="text-muted">${getRoleDisplayName(user.role)}</small>
        </div>
      </div>
      <button class="btn btn-sm ${isCurrent ? 'btn-success' : 'btn-outline'}">
        ${isCurrent ? 'Tanlangan' : 'Tanlash'}
      </button>
    `;

    card.onclick = () => switchCurrentUser(user);
    container.appendChild(card);
  });

  openModal("modalRoleSwitch");
}

function switchCurrentUser(user) {
  STATE.currentUser = user;
  saveState();
  closeModal("modalRoleSwitch");
  updateHeaderKPIs();

  alert(`Xush kelibsiz, ${user.name}! Siz hozir ${getRoleDisplayName(user.role)} roliga o'tdingiz.`);
  
  if (user.role === "chef") {
    navigateTo("kitchen");
  } else if (user.role === "waiter") {
    navigateTo("tables");
  } else if (user.role === "cashier") {
    navigateTo("cashier");
  } else {
    navigateTo("dashboard");
  }
}

// ================= 18. SAHIFA: 10. HISOBOTLAR =================
function renderReportsView() {
  const period = STATE.reportPeriod || "today";

  // Filterlash
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const oneWeekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const oneMonthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  let filtered = STATE.orders.filter(o => o.status === "completed");

  if (period === "today") {
    filtered = filtered.filter(o => o.completedAt && o.completedAt.startsWith(todayStr));
  } else if (period === "week") {
    filtered = filtered.filter(o => o.completedAt && o.completedAt >= oneWeekAgo);
  } else if (period === "month") {
    filtered = filtered.filter(o => o.completedAt && o.completedAt >= oneMonthAgo);
  }

  const totalSales = filtered.reduce((s, o) => s + (o.total || 0), 0);
  const totalOrders = filtered.length;
  const avgCheck = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  document.getElementById("repPeriodSales").textContent = formatMoney(totalSales);
  document.getElementById("repPeriodOrders").textContent = `${totalOrders} ta`;
  document.getElementById("repAverageCheck").textContent = formatMoney(avgCheck);

  // To'lov turlari bo'yicha tushum
  const methods = { Naqd: 0, Karta: 0, Click: 0, Payme: 0 };
  filtered.forEach(o => {
    const m = o.paymentMethod || "Naqd";
    methods[m] = (methods[m] || 0) + (o.total || 0);
  });

  const breakdownBox = document.getElementById("repPaymentBreakdown");
  if (breakdownBox) {
    breakdownBox.innerHTML = `
      <div class="pay-breakdown-row">
        <span>💵 Naqd pul:</span>
        <strong>${formatMoney(methods.Naqd)}</strong>
      </div>
      <div class="pay-breakdown-row">
        <span>💳 Karta (Uzcard/Humo):</span>
        <strong>${formatMoney(methods.Karta)}</strong>
      </div>
      <div class="pay-breakdown-row">
        <span>📱 Click to'lov:</span>
        <strong>${formatMoney(methods.Click)}</strong>
      </div>
      <div class="pay-breakdown-row">
        <span>🟢 Payme to'lov:</span>
        <strong>${formatMoney(methods.Payme)}</strong>
      </div>
    `;
  }

  // Eng ko'p sotilgan taomlar
  renderTopDishes("repTopDishesList");
}

// ================= 19. SAHIFA: 11. BUYURTMALAR TARIXI =================
function renderHistoryView() {
  const tbody = document.getElementById("orderHistoryTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = (document.getElementById("inputHistorySearch")?.value || "").toLowerCase().trim();
  const payFilter = document.getElementById("selectHistoryPaymentFilter")?.value || "all";

  let list = [...STATE.orders].reverse();

  if (payFilter !== "all") {
    list = list.filter(o => o.paymentMethod === payFilter);
  }

  if (query) {
    list = list.filter(o =>
      (o.orderNumber && o.orderNumber.toLowerCase().includes(query)) ||
      (o.tableName && o.tableName.toLowerCase().includes(query)) ||
      (o.waiterName && o.waiterName.toLowerCase().includes(query)) ||
      (o.customerName && o.customerName.toLowerCase().includes(query))
    );
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted">Buyurtmalar tarixi topilmadi</td></tr>`;
    return;
  }

  list.forEach(order => {
    const tr = document.createElement("tr");
    const dishes = order.items.map(it => `${it.name} (x${it.qty})`).join(", ");
    tr.innerHTML = `
      <td><strong>${order.orderNumber}</strong></td>
      <td><small>${formatDate(order.completedAt || order.createdAt)}</small></td>
      <td><span class="badge badge-table">${order.tableName}</span></td>
      <td>${order.waiterName || "Ali"}</td>
      <td><div class="table-dishes-cell" title="${dishes}">${dishes}</div></td>
      <td><span class="badge">${order.paymentMethod || "Kutilmoqda"}</span></td>
      <td><strong>${formatMoney(order.total)}</strong></td>
      <td><span class="status-chip status-${order.status}">${getOrderStatusLabel(order.status)}</span></td>
      <td style="text-align: center;">
        <button class="btn btn-outline btn-xs" onclick="openOrderReceiptHistory(${order.id})" title="Chekni ko'rish">🧾 Chek</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openOrderReceiptHistory(orderId) {
  const order = STATE.orders.find(o => o.id === orderId);
  if (order) showReceiptModal(order);
}

// ================= 20. SAHIFA: 12. SOZLAMALAR =================
function renderSettingsView() {
  const s = STATE.settings;
  document.getElementById("setRestName").value = s.restaurantName || "";
  document.getElementById("setRestPhone").value = s.phone || "";
  document.getElementById("setRestAddress").value = s.address || "";
  document.getElementById("setCurrency").value = s.currency || "so'm";
  document.getElementById("setTableCount").value = s.tableCount || 16;
  document.getElementById("setServiceCharge").value = s.serviceChargePercent || 10;
  document.getElementById("setReceiptHeader").value = s.receiptHeader || "";
  document.getElementById("setReceiptFooter").value = s.receiptFooter || "";
}

function saveSettings() {
  STATE.settings.restaurantName = document.getElementById("setRestName").value.trim() || DEFAULT_SETTINGS.restaurantName;
  STATE.settings.phone = document.getElementById("setRestPhone").value.trim();
  STATE.settings.address = document.getElementById("setRestAddress").value.trim();
  STATE.settings.currency = document.getElementById("setCurrency").value.trim() || "so'm";
  
  const count = Number(document.getElementById("setTableCount").value) || 16;
  STATE.settings.tableCount = count;
  
  STATE.settings.serviceChargePercent = Number(document.getElementById("setServiceCharge").value) || 0;
  STATE.settings.receiptHeader = document.getElementById("setReceiptHeader").value.trim();
  STATE.settings.receiptFooter = document.getElementById("setReceiptFooter").value.trim();

  // Agar stollar soni o'zgargan bo'lsa yangilash
  if (STATE.tables.length !== count) {
    if (confirm("Stollar soni o'zgardi. Stollar qayta shakllantirilsinmi?")) {
      STATE.tables = generateDefaultTables(count);
    }
  }

  // Header sarlavhasini yangilash
  document.getElementById("headerRestTitle").textContent = STATE.settings.restaurantName;

  saveState();
  alert("✅ Sozlamalar muvaffaqiyatli saqlandi!");
  updateHeaderKPIs();
}

function resetDemoData() {
  if (confirm("DIQQAT! Barcha buyurtmalar va sozlamalar boshlang'ich namuna holatiga qaytariladi. Davom etasizmi?")) {
    localStorage.removeItem(STORAGE_KEY);
    STATE.settings = { ...DEFAULT_SETTINGS };
    STATE.categories = [...DEFAULT_CATEGORIES];
    STATE.products = [...DEFAULT_PRODUCTS];
    STATE.tables = generateDefaultTables(16);
    STATE.customers = [...DEFAULT_CUSTOMERS];
    STATE.staff = [...DEFAULT_STAFF];
    STATE.currentUser = DEFAULT_STAFF[0];
    STATE.orders = [];
    seedInitialDemoOrders();
    saveState();
    alert("Barcha namuna ma'lumotlar qayta tiklandi!");
    location.reload();
  }
}

// ================= 21. MODALLARNI BOSHQARISH =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("open");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
}

// ================= 22. EVENT LISTENERS VA BOSHLASH =================
function setupEventListeners() {
  // 1. Sidebar navigatsiyasi
  const navBtns = document.querySelectorAll(".sidebar-nav .nav-item");
  navBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      navigateTo(view);
    });
  });

  // Toggle sidebar
  document.getElementById("btnToggleSidebar")?.addEventListener("click", () => toggleSidebar());
  document.getElementById("btnCollapseSidebar")?.addEventListener("click", () => toggleSidebar(true));
  document.getElementById("sidebarOverlay")?.addEventListener("click", () => toggleSidebar(true));

  // Header tugmalari
  document.getElementById("headerHomeLogo")?.addEventListener("click", () => navigateTo("dashboard"));
  document.getElementById("btnHeadNewOrder")?.addEventListener("click", () => navigateTo("orders"));
  document.getElementById("btnOpenRoleSwitch")?.addEventListener("click", openRoleSwitchModal);
  document.getElementById("btnSideSwitchUser")?.addEventListener("click", openRoleSwitchModal);

  // Stollar filtri
  const tableFilterBtns = document.querySelectorAll("#tableFilters .btn-filter");
  tableFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tableFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      STATE.filterTableStatus = btn.getAttribute("data-filter");
      renderTablesView();
    });
  });

  // Stolni ko'chirish
  document.getElementById("btnConfirmTransferTable")?.addEventListener("click", confirmTransferTable);

  // Buyurtma (Cart) amallari
  document.getElementById("btnSendOrderToKitchen")?.addEventListener("click", sendOrderToKitchen);
  document.getElementById("btnCartClearAll")?.addEventListener("click", () => {
    if (confirm("Joriy tanlangan barcha taomlarni savatdan tozalashni xohlaysizmi?")) {
      STATE.currentOrderCart.items = [];
      renderOrderCart();
    }
  });

  document.getElementById("chkCartServiceCharge")?.addEventListener("change", renderOrderCart);

  document.getElementById("btnCartProceedToPay")?.addEventListener("click", () => {
    sendOrderToKitchen();
    navigateTo("cashier");
  });

  document.getElementById("btnSaveOrderDraft")?.addEventListener("click", () => {
    alert("Buyurtma qoralama sifatida saqlandi.");
  });

  document.getElementById("orderSelectTable")?.addEventListener("change", (e) => {
    startNewOrderForTable(Number(e.target.value));
  });

  document.getElementById("orderSelectCustomer")?.addEventListener("change", (e) => {
    STATE.currentOrderCart.customerId = e.target.value ? Number(e.target.value) : null;
  });

  // Qidiruv
  const searchInput = document.getElementById("inputMenuSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderOrderDishesGrid();
      const clearBtn = document.getElementById("btnSearchClear");
      if (clearBtn) clearBtn.style.display = e.target.value ? "block" : "none";
    });
  }
  document.getElementById("btnSearchClear")?.addEventListener("click", () => {
    const input = document.getElementById("inputMenuSearch");
    if (input) {
      input.value = "";
      renderOrderDishesGrid();
      document.getElementById("btnSearchClear").style.display = "none";
    }
  });

  // Oshxona KDS yangilash
  document.getElementById("btnRefreshKitchen")?.addEventListener("click", renderKitchenView);

  // Kassa naqd hisobi va to'lov
  document.getElementById("inputCashReceived")?.addEventListener("input", calculateCashChange);
  const quickCashBtns = document.querySelectorAll(".btn-quick-cash");
  quickCashBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const amount = btn.getAttribute("data-amount");
      const order = STATE.orders.find(o => o.id === STATE.selectedCashierOrderId);
      const input = document.getElementById("inputCashReceived");
      if (!input || !order) return;

      if (amount === "exact") {
        input.value = order.total;
      } else {
        input.value = (Number(input.value) || 0) + Number(amount);
      }
      calculateCashChange();
    });
  });

  document.getElementById("btnExecutePayment")?.addEventListener("click", executePayment);

  // Chek print qilish
  document.getElementById("btnPrintReceipt")?.addEventListener("click", () => {
    window.print();
  });

  // Menu Admin
  document.getElementById("btnOpenAddProductModal")?.addEventListener("click", openAddProductModal);
  document.getElementById("btnSaveProduct")?.addEventListener("click", saveProduct);
  document.getElementById("inputAdminMenuSearch")?.addEventListener("input", renderAdminMenuView);
  document.getElementById("selectAdminMenuCategory")?.addEventListener("change", renderAdminMenuView);
  document.getElementById("selectAdminMenuStatus")?.addEventListener("change", renderAdminMenuView);

  // Kategoriya Admin
  document.getElementById("btnOpenAddCategoryModal")?.addEventListener("click", openAddCategoryModal);
  document.getElementById("btnSaveCategory")?.addEventListener("click", saveCategory);

  // Mijoz Admin
  document.getElementById("btnOpenAddCustomerModal")?.addEventListener("click", openAddCustomerModal);
  document.getElementById("btnSaveCustomer")?.addEventListener("click", saveCustomer);

  // Xodim Admin
  document.getElementById("btnOpenAddStaffModal")?.addEventListener("click", openAddStaffModal);
  document.getElementById("btnSaveStaff")?.addEventListener("click", saveStaff);

  // Izoh modali
  document.getElementById("btnSaveItemNote")?.addEventListener("click", saveItemNote);

  // Hisobot filtrlari
  const repBtns = document.querySelectorAll(".report-date-filters .btn-filter");
  repBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      repBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      STATE.reportPeriod = btn.getAttribute("data-period");
      renderReportsView();
    });
  });

  // Tarix qidiruvi
  document.getElementById("inputHistorySearch")?.addEventListener("input", renderHistoryView);
  document.getElementById("selectHistoryPaymentFilter")?.addEventListener("change", renderHistoryView);

  // Sozlamalar
  document.getElementById("btnSaveSettings")?.addEventListener("click", saveSettings);
  document.getElementById("btnResetDemoData")?.addEventListener("click", resetDemoData);

  // Jonli soat
  setInterval(() => {
    const el = document.getElementById("liveClock");
    if (el) {
      const now = new Date();
      el.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }
  }, 1000);
}

// Global qilish (HTML inline onclick-lar uchun)
window.navigateTo = navigateTo;
window.closeModal = closeModal;
window.openModal = openModal;
window.openTableDetailModal = openTableDetailModal;
window.openTransferTableModal = openTransferTableModal;
window.startNewOrderForTable = startNewOrderForTable;
window.updateCartItemQty = updateCartItemQty;
window.removeCartItem = removeCartItem;
window.openItemNoteModal = openItemNoteModal;
window.setQuickNote = setQuickNote;
window.changeKitchenOrderStatus = changeKitchenOrderStatus;
window.selectCashierOrder = selectCashierOrder;
window.toggleProductAvailability = toggleProductAvailability;
window.openEditProductModal = openEditProductModal;
window.deleteProduct = deleteProduct;
window.openEditCategoryModal = openEditCategoryModal;
window.deleteCategory = deleteCategory;
window.openEditCustomerModal = openEditCustomerModal;
window.deleteCustomer = deleteCustomer;
window.openEditStaffModal = openEditStaffModal;
window.deleteStaff = deleteStaff;
window.openOrderReceiptHistory = openOrderReceiptHistory;
window.openOrderFromDashboard = openOrderFromDashboard;

// ================= 23. BOSHLANG'ICH YUKLANISH =================
window.addEventListener("DOMContentLoaded", () => {
  loadState();
  setupEventListeners();
  updateHeaderKPIs();
  navigateTo("dashboard");
});