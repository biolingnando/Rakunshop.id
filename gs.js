const SHEETS = {
  MEMBERS: "Members",
  PRODUCTS: "Products",
  TRANSACTIONS: "Transactions",
  BANNERS: "Banners",
  SETTINGS: "Settings"
};

const HEADERS = {
  Members:      ["id","nama","hp","email","password","saldo","poin","vipLevel","vipExpire","refCode","refUsed","refCount","createdAt"],
  Products:     ["id","nama","kategori","sub","harga","icon","warna"],
  Transactions: ["id","jenis","hp","nama","produk","kategori","tujuan","hargaNormal","hargaBayar","nominal","poin","status","keterangan","tanggal"],
  Banners:      ["url"],
  Settings:     ["key","value"]
};

/* ---------- UTIL ---------- */
function getSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(HEADERS[name] || ["data"]);
  }
  return sh;
}
function clearData_(sh) {
  const lr = sh.getLastRow();
  if (lr > 1) sh.getRange(2, 1, lr - 1, sh.getLastColumn()).clearContent();
}
function objToRow_(obj, headers) {
  return headers.map(h => {
    let v = obj[h];
    if (v === undefined || v === null) return "";
    if (typeof v === "object") return JSON.stringify(v);
    return v;
  });
}
function rowToObj_(row, headers) {
  const o = {};
  headers.forEach((h, i) => {
    let v = row[i];
    if (v === "" || v === undefined) { o[h] = null; return; }
    // Try parse numbers
    if (["saldo","poin","vipLevel","harga","hargaNormal","hargaBayar","nominal","refCount"].includes(h)) {
      o[h] = Number(v) || 0; return;
    }
    o[h] = v;
  });
  return o;
}
function json_(data, code=200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ---------- WRITE: Sync dari Web ke Sheet ---------- */
function syncIn_(payload) {
  try {
    // Members
    if (payload.members && Array.isArray(payload.members)) {
      const sh = getSheet_(SHEETS.MEMBERS);
      clearData_(sh);
      if (payload.members.length) {
        const rows = payload.members.map(m => objToRow_(m, HEADERS.Members));
        sh.getRange(2, 1, rows.length, HEADERS.Members.length).setValues(rows);
      }
    }
    // Products
    if (payload.products && Array.isArray(payload.products)) {
      const sh = getSheet_(SHEETS.PRODUCTS);
      clearData_(sh);
      if (payload.products.length) {
        const rows = payload.products.map(p => objToRow_(p, HEADERS.Products));
        sh.getRange(2, 1, rows.length, HEADERS.Products.length).setValues(rows);
      }
    }
    // Transactions (append only jika sudah ada data lama, tapi disini full overwrite agar konsisten)
    if (payload.transactions && Array.isArray(payload.transactions)) {
      const sh = getSheet_(SHEETS.TRANSACTIONS);
      clearData_(sh);
      if (payload.transactions.length) {
        const rows = payload.transactions.map(t => objToRow_(t, HEADERS.Transactions));
        sh.getRange(2, 1, rows.length, HEADERS.Transactions.length).setValues(rows);
      }
    }
    // Banners
    if (payload.banners && Array.isArray(payload.banners)) {
      const sh = getSheet_(SHEETS.BANNERS);
      clearData_(sh);
      if (payload.banners.length) {
        sh.getRange(2, 1, payload.banners.length, 1).setValues(payload.banners.map(b => [b]));
      }
    }
    // Settings
    if (payload.settings && typeof payload.settings === "object") {
      const sh = getSheet_(SHEETS.SETTINGS);
      clearData_(sh);
      const entries = Object.entries(payload.settings);
      if (entries.length) {
        sh.getRange(2, 1, entries.length, 2).setValues(entries);
      }
    }
    SpreadsheetApp.flush();
    return { ok: true, message: "Synced " + new Date().toLocaleString("id-ID") };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/* ---------- READ: Get all dari Sheet ke Web ---------- */
function getAll_() {
  const out = { members: [], products: [], transactions: [], banners: [], settings: {} };

  // Members
  try {
    const sh = getSheet_(SHEETS.MEMBERS);
    const data = sh.getDataRange().getValues();
    if (data.length > 1) out.members = data.slice(1).map(r => rowToObj_(r, HEADERS.Members));
  } catch(e){}

  // Products
  try {
    const sh = getSheet_(SHEETS.PRODUCTS);
    const data = sh.getDataRange().getValues();
    if (data.length > 1) out.products = data.slice(1).map(r => rowToObj_(r, HEADERS.Products));
  } catch(e){}

  // Transactions
  try {
    const sh = getSheet_(SHEETS.TRANSACTIONS);
    const data = sh.getDataRange().getValues();
    if (data.length > 1) out.transactions = data.slice(1).map(r => rowToObj_(r, HEADERS.Transactions));
  } catch(e){}

  // Banners
  try {
    const sh = getSheet_(SHEETS.BANNERS);
    const data = sh.getDataRange().getValues();
    if (data.length > 1) out.banners = data.slice(1).map(r => r[0]).filter(Boolean);
  } catch(e){}

  // Settings
  try {
    const sh = getSheet_(SHEETS.SETTINGS);
    const data = sh.getDataRange().getValues();
    if (data.length > 1) data.slice(1).forEach(r => {
      if (!r[0]) return;
      let v = r[1];
      if (!isNaN(Number(v)) && v !== "") v = Number(v);
      out.settings[r[0]] = v;
    });
  } catch(e){}

  return out;
}

/* ---------- WEB HOOKS ---------- */
function doGet(e) {
  const action = e.parameter && e.parameter.action;

  if (action === "ping") {
    return ContentService.createTextOutput("RAKUN-SHOP-GS-OK " + new Date().toISOString());
  }
  if (action === "getAll") {
    return json_(getAll_());
  }
  if (action === "init") {
    // Init sheet headers
    Object.keys(HEADERS).forEach(k => getSheet_(k));
    return json_({ ok: true, message: "Sheets initialized" });
  }
  return json_({ error: "Unknown action. Use ?action=ping|getAll|init" }, 400);
}

function doPost(e) {
  try {
    let payload;
    try { payload = JSON.parse(e.postData.contents); } catch { payload = {}; }

    if (payload.action === "syncIn") {
      const res = syncIn_(payload);
      return json_(res);
    }
    return json_({ error: "Unknown POST action" }, 400);
  } catch (err) {
    return json_({ error: String(err), stack: err.stack }, 500);
  }
}

/* ---------- MANUAL: Jalankan setupSheet() sekali dari editor ---------- */
function setupSheet() {
  Object.keys(HEADERS).forEach(k => getSheet_(k));
  SpreadsheetApp.getActiveSpreadsheet().toast("Headers siap!", "RAKUN SHOP");
}
