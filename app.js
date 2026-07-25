/* =========================================================
   RAKUN SHOP ID - Main App Logic (app.js)
   ========================================================= */

const DB = {
  get(k, def) { try { const v = localStorage.getItem("rs_" + k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set(k, v) { localStorage.setItem("rs_" + k, JSON.stringify(v)); }
};

const VIP_TIERS = [
  { level: 0, nama: "BIASA", diskon: 0,    harga: 0 },
  { level: 1, nama: "VIP 1", diskon: 0.12, harga: 25000 },
  { level: 2, nama: "VIP 2", diskon: 0.40, harga: 75000 },
  { level: 3, nama: "VIP 3", diskon: 0.70, harga: 150000 }
];

/* ---------- UTILITIES ---------- */
function rp(n){ return "Rp " + Number(n||0).toLocaleString("id-ID"); }
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function toast(msg, type="success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-xl " +
    (type==="success"?"bg-emerald-500":type==="error"?"bg-red-500":"bg-blue-500");
  t.classList.remove("hidden");
  clearTimeout(window.__tt);
  window.__tt = setTimeout(()=>t.classList.add("hidden"), 2500);
}
function togglePwd(id) {
  const i = document.getElementById(id);
  const ic = document.querySelector(`[data-pwd="${id}"] i`);
  if (i.type === "password") { i.type = "text"; ic.className = "fa-solid fa-eye-slash"; }
  else { i.type = "password"; ic.className = "fa-solid fa-eye"; }
}
function genRefCode(nama, hp) {
  const a = (nama||"R").trim().split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const b = String(hp||"0000").slice(-4);
  return a + b;
}
function hitungHargaVip(hargaNormal, level) {
  const v = VIP_TIERS.find(x=>x.level===level) || VIP_TIERS[0];
  return Math.round(hargaNormal * (1 - v.diskon));
}
function cekMasaVip(member) {
  if (!member) return member;
  if (member.vipLevel > 0 && member.vipExpire) {
    if (new Date(member.vipExpire) < new Date()) {
      member.vipLevel = 0;
      member.vipExpire = null;
    }
  }
  return member;
}
function copyText(t){ navigator.clipboard.writeText(t).then(()=>toast("Disalin: "+t)); }

/* ---------- SEED DATA DEFAULT ---------- */
function initDB() {
  if (!DB.get("products",null)) {
    DB.set("products", [
      // GAME
      { id:"p1", nama:"MLBB 5 Diamonds",     kategori:"Game", sub:"MLBB",       harga:1500,  icon:"fa-gamepad", warna:"from-orange-500 to-red-500" },
      { id:"p2", nama:"MLBB 12 Diamonds",    kategori:"Game", sub:"MLBB",       harga:3500,  icon:"fa-gamepad", warna:"from-orange-500 to-red-500" },
      { id:"p3", nama:"MLBB 28 Diamonds",    kategori:"Game", sub:"MLBB",       harga:8000,  icon:"fa-gamepad", warna:"from-orange-500 to-red-500" },
      { id:"p4", nama:"MLBB 56 Diamonds",    kategori:"Game", sub:"MLBB",       harga:15500, icon:"fa-gamepad", warna:"from-orange-500 to-red-500" },
      { id:"p5", nama:"Free Fire 50 DM",     kategori:"Game", sub:"Free Fire",  harga:7000,  icon:"fa-fire",    warna:"from-amber-500 to-orange-600" },
      { id:"p6", nama:"Free Fire 100 DM",    kategori:"Game", sub:"Free Fire",  harga:14000, icon:"fa-fire",    warna:"from-amber-500 to-orange-600" },
      { id:"p7", nama:"Free Fire 310 DM",    kategori:"Game", sub:"Free Fire",  harga:42000, icon:"fa-fire",    warna:"from-amber-500 to-orange-600" },
      { id:"p8", nama:"PUBG 60 UC",          kategori:"Game", sub:"PUBG",       harga:16000, icon:"fa-crosshairs", warna:"from-yellow-600 to-amber-700" },
      { id:"p9", nama:"PUBG 325 UC",         kategori:"Game", sub:"PUBG",       harga:80000, icon:"fa-crosshairs", warna:"from-yellow-600 to-amber-700" },
      // PULSA
      { id:"p10", nama:"Pulsa Telkomsel 5rb",  kategori:"Pulsa", sub:"Telkomsel", harga:6500,  icon:"fa-signal", warna:"from-red-500 to-rose-600" },
      { id:"p11", nama:"Pulsa Telkomsel 10rb", kategori:"Pulsa", sub:"Telkomsel", harga:11500, icon:"fa-signal", warna:"from-red-500 to-rose-600" },
      { id:"p12", nama:"Pulsa Telkomsel 25rb", kategori:"Pulsa", sub:"Telkomsel", harga:26500, icon:"fa-signal", warna:"from-red-500 to-rose-600" },
      { id:"p13", nama:"Pulsa Indosat 10rb",   kategori:"Pulsa", sub:"Indosat",   harga:10800, icon:"fa-signal", warna:"from-yellow-500 to-amber-600" },
      { id:"p14", nama:"Pulsa Axis 10rb",      kategori:"Pulsa", sub:"Axis",      harga:10800, icon:"fa-signal", warna:"from-pink-500 to-rose-500" },
      { id:"p15", nama:"Pulsa Tri 10rb",       kategori:"Pulsa", sub:"Tri",       harga:10800, icon:"fa-signal", warna:"from-sky-500 to-blue-600" },
      { id:"p16", nama:"Pulsa Smartfren 10rb", kategori:"Pulsa", sub:"Smartfren", harga:10800, icon:"fa-signal", warna:"from-red-600 to-fuchsia-600" },
      // PAKET DATA
      { id:"p17", nama:"Telkomsel 1GB",      kategori:"Paket Data", sub:"Telkomsel", harga:12000, icon:"fa-wifi", warna:"from-red-500 to-rose-600" },
      { id:"p18", nama:"Telkomsel 5GB",      kategori:"Paket Data", sub:"Telkomsel", harga:35000, icon:"fa-wifi", warna:"from-red-500 to-rose-600" },
      { id:"p19", nama:"Indosat Freedom 2GB",kategori:"Paket Data", sub:"Indosat",   harga:15000, icon:"fa-wifi", warna:"from-yellow-500 to-amber-600" },
      { id:"p20", nama:"Axis BRONET 3GB",    kategori:"Paket Data", sub:"Axis",      harga:13000, icon:"fa-wifi", warna:"from-pink-500 to-rose-500" },
      { id:"p21", nama:"Tri AON 10GB",       kategori:"Paket Data", sub:"Tri",       harga:25000, icon:"fa-wifi", warna:"from-sky-500 to-blue-600" },
      { id:"p22", nama:"Smartfren 10GB",     kategori:"Paket Data", sub:"Smartfren", harga:22000, icon:"fa-wifi", warna:"from-red-600 to-fuchsia-600" },
      // TOKEN LISTRIK
      { id:"p23", nama:"Token PLN 20.000",   kategori:"Token Listrik", sub:"PLN", harga:21500, icon:"fa-bolt", warna:"from-blue-500 to-indigo-600" },
      { id:"p24", nama:"Token PLN 50.000",   kategori:"Token Listrik", sub:"PLN", harga:51500, icon:"fa-bolt", warna:"from-blue-500 to-indigo-600" },
      { id:"p25", nama:"Token PLN 100.000",  kategori:"Token Listrik", sub:"PLN", harga:101500,icon:"fa-bolt", warna:"from-blue-500 to-indigo-600" },
      // VOUCHER
      { id:"p26", nama:"Steam Wallet 12rb",  kategori:"Voucher Game", sub:"Steam",      harga:13000, icon:"fa-steam", warna:"from-slate-600 to-slate-800" },
      { id:"p27", nama:"Google Play 20rb",   kategori:"Voucher Game", sub:"Google Play",harga:21000, icon:"fa-google-play", warna:"from-green-500 to-teal-600" },
      { id:"p28", nama:"Garena Shells 25rb", kategori:"Voucher Game", sub:"Garena",     harga:26000, icon:"fa-ticket", warna:"from-emerald-500 to-cyan-600" }
    ]);
  }
  if (!DB.get("banners",null)) {
    DB.set("banners", [
      "https://placehold.co/800x300/10b981/ffffff?text=SELAMAT+DATANG+DI+RAKUN+SHOP+ID",
      "https://placehold.co/800x300/f59e0b/ffffff?text=UPGRADE+VIP+DISKON+HASTA+70%25",
      "https://placehold.co/800x300/ef4444/ffffff?text=AJAK+TEMAN+BONUS+SALDO"
    ]);
  }
  if (!DB.get("settings",null)) DB.set("settings", { refBonus: 500, poinPercent: 1, namaToko: "RAKUN SHOP ID" });
  if (!DB.get("members",null)) DB.set("members", []);
  if (!DB.get("transactions",null)) DB.set("transactions", []);
}

/* ---------- THEME ---------- */
function toggleTheme() {
  const cur = document.documentElement.classList.contains("dark") ? "dark" : "light";
  const next = cur === "dark" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", next === "dark");
  document.body.classList.toggle("dark", next === "dark");
  document.getElementById("themeIcon").className = next === "dark" ? "fa-solid fa-sun text-yellow-300" : "fa-solid fa-moon text-gray-700";
  localStorage.setItem("rs_theme", next);
}

/* ---------- AUTH ---------- */
function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  // Bottom nav: tampil hanya setelah login
  const bn = document.getElementById("bottomNav");
  const logged = ["page-home","page-riwayat","page-profile"].includes(id);
  bn.classList.toggle("hidden", !logged);
  window.scrollTo(0,0);
}
function navTab(tab) {
  showPage("page-"+tab);
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  document.getElementById("nav-"+tab).classList.add("active");
  if (tab === "home") renderHome();
  if (tab === "riwayat") renderRiwayat();
  if (tab === "profile") renderProfile();
}

function prosesDaftar(e) {
  e.preventDefault();
  const f = e.target;
  const data = {
    nama: f.rNama.value.trim(),
    hp: f.rHp.value.trim(),
    email: f.rEmail.value.trim(),
    password: f.rPwd.value,
    pwd2: f.rPwd2.value,
    ref: f.rRef.value.trim().toUpperCase()
  };
  if (!data.nama || !data.hp || !data.email) return toast("Lengkapi semua data","error");
  if (data.password.length < 4) return toast("Password minimal 4 karakter","error");
  if (data.password !== data.pwd2) return toast("Password tidak sama","error");
  const mbr = DB.get("members",[]);
  if (mbr.find(m => m.hp === data.hp)) return toast("Nomor HP sudah terdaftar","error");
  if (mbr.find(m => m.email === data.email)) return toast("Email sudah terdaftar","error");

  // Bonus referal
  let inviter = null;
  if (data.ref) {
    inviter = mbr.find(m => m.refCode === data.ref);
    if (!inviter) return toast("Kode referal tidak valid","error");
  }

  const baru = {
    id: uid(),
    nama: data.nama, hp: data.hp, email: data.email,
    password: data.password,
    saldo: 0, poin: 0,
    vipLevel: 0, vipExpire: null,
    refCode: genRefCode(data.nama, data.hp),
    refUsed: data.ref || null,
    refCount: 0,
    createdAt: new Date().toISOString()
  };
  mbr.push(baru);

  // Beri bonus ke pengundang
  if (inviter) {
    const set = DB.get("settings",{});
    const bonus = set.refBonus || 500;
    const idx = mbr.findIndex(m => m.hp === inviter.hp);
    mbr[idx].saldo = Number(mbr[idx].saldo||0) + bonus;
    mbr[idx].refCount = (mbr[idx].refCount||0) + 1;
    const trx = DB.get("transactions",[]);
    trx.unshift({
      id: uid(), jenis:"referal_bonus", hp: inviter.hp, nama: inviter.nama,
      nominal: bonus, status:"Sukses",
      keterangan: `Bonus ajak ${baru.nama}`,
      tanggal: new Date().toISOString()
    });
    DB.set("transactions", trx);
  }
  DB.set("members", mbr);
  toast("Pendaftaran berhasil! Silakan login");
  f.reset();
  showPage("page-login");
}

function prosesLogin(e) {
  e.preventDefault();
  const hp = e.target.lHp.value.trim();
  const pwd = e.target.lPwd.value;
  const mbr = DB.get("members",[]).find(m => m.hp === hp && m.password === pwd);
  if (!mbr) return toast("HP / Password salah","error");
  const m = cekMasaVip({...mbr});
  // Update jika vip expire
  if (m.vipLevel !== mbr.vipLevel) {
    const arr = DB.get("members",[]);
    const i = arr.findIndex(x=>x.hp===m.hp); arr[i]=m; DB.set("members",arr);
  }
  DB.set("session", { hp: m.hp });
  toast("Login berhasil, Selamat datang "+m.nama);
  navTab("home");
}

function prosesAdminLogin(e) {
  e.preventDefault();
  if (e.target.aUser.value === "Admin" && e.target.aPwd.value === "admin123") {
    localStorage.setItem("rs_adminSession", "1");
    window.location.href = "admin.html";
  } else toast("Admin / Password salah","error");
}

function logout() {
  if (!confirm("Yakin keluar?")) return;
  localStorage.removeItem("rs_session");
  showPage("page-login");
}

function getMe() {
  const s = DB.get("session",null);
  if (!s) return null;
  const m = DB.get("members",[]).find(x => x.hp === s.hp);
  return m ? cekMasaVip(m) : null;
}
function saveMe(m) {
  const arr = DB.get("members",[]);
  const i = arr.findIndex(x => x.hp === m.hp);
  if (i>=0) { arr[i] = m; DB.set("members",arr); }
}

/* ---------- HOME ---------- */
let bannerIdx = 0, bannerTimer = null;
function renderHome() {
  const me = getMe(); if (!me) return showPage("page-login");
  const vip = VIP_TIERS.find(v=>v.level===me.vipLevel) || VIP_TIERS[0];

  // Kartu saldo
  document.getElementById("hNama").textContent = me.nama;
  document.getElementById("hVip").textContent = vip.nama;
  document.getElementById("hVip").className = `pill vip-${vip.level} text-white`;
  document.getElementById("hSaldo").textContent = rp(me.saldo);
  document.getElementById("hPoin").textContent = me.poin || 0;
  document.getElementById("hRef").textContent = me.refCode;

  // Banner
  const banners = DB.get("banners",[]);
  const bWrap = document.getElementById("bannerWrap");
  if (banners.length === 0) { bWrap.innerHTML = ""; }
  else {
    bWrap.innerHTML = `<img src="${banners[bannerIdx % banners.length]}" class="w-full h-40 md:h-48 object-cover rounded-2xl" onerror="this.src='https://placehold.co/800x300/10b981/ffffff?text=RAKUN+SHOP'"/>
      <div class="flex justify-center gap-1 mt-2">
        ${banners.map((_,i)=>`<span class="banner-dot ${i===(bannerIdx%banners.length)?'active':''}"></span>`).join("")}
      </div>`;
  }
  if (bannerTimer) clearInterval(bannerTimer);
  bannerTimer = setInterval(() => {
    bannerIdx++; renderHome();
  }, 60000); // 1 menit

  // Kategori
  const prods = DB.get("products",[]);
  const kats = [...new Set(prods.map(p=>p.kategori))];
  const icons = { "Game":"fa-gamepad","Pulsa":"fa-mobile-screen","Paket Data":"fa-wifi","Token Listrik":"fa-bolt","Voucher Game":"fa-ticket","Lainnya":"fa-box" };
  document.getElementById("katList").innerHTML = kats.map((k,i)=>`
    <button onclick="filterKat('${k}')" class="kat-item ${i===0?'active':''}" data-kat="${k}">
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-lg">
        <i class="fa-solid ${icons[k]||'fa-box'}"></i>
      </div>
      <span class="text-[10px] mt-1 text-gray-600 dark:text-gray-300 font-semibold">${k}</span>
    </button>
  `).join("");

  // Produk (default kategori pertama)
  renderProdukList(kats[0]);
}
function filterKat(k) {
  document.querySelectorAll(".kat-item").forEach(x=>x.classList.toggle("active", x.dataset.kat===k));
  renderProdukList(k);
}
function renderProdukList(kat) {
  const me = getMe();
  const list = DB.get("products",[]).filter(p => p.kategori === kat);
  document.getElementById("produkList").innerHTML = list.map(p => {
    const hargaBayar = hitungHargaVip(p.harga, me.vipLevel);
    const diskon = Math.round((1 - hargaBayar/p.harga) * 100);
    return `
    <div class="produk-card bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm cursor-pointer" onclick="bukaModalBeli('${p.id}')">
      <div class="flex gap-3 items-center">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${p.warna} text-white flex items-center justify-center shrink-0">
          <i class="fa-solid ${p.icon} text-lg"></i>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm text-gray-800 dark:text-white truncate">${p.nama}</p>
          <p class="text-[10px] text-gray-400">${p.sub||p.kategori}</p>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-sm font-extrabold text-emerald-600">${rp(hargaBayar)}</span>
            ${diskon>0?`<span class="diskon-badge">-${diskon}%</span><span class="text-[10px] text-gray-400 line-through">${rp(p.harga)}</span>`:""}
          </div>
        </div>
        <i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
      </div>
    </div>`;
  }).join("") || `<p class="text-center text-gray-400 py-8 text-sm">Belum ada produk di kategori ini</p>`;
}

/* ---------- MODAL BELI ---------- */
let beliProdukId = null;
function bukaModalBeli(id) {
  const p = DB.get("products",[]).find(x=>x.id===id); if(!p)return;
  const me = getMe();
  const hargaBayar = hitungHargaVip(p.harga, me.vipLevel);
  beliProdukId = id;
  document.getElementById("bNama").textContent = p.nama;
  document.getElementById("bHargaNormal").textContent = rp(p.harga);
  document.getElementById("bHargaBayar").textContent = rp(hargaBayar);
  document.getElementById("bTujuan").value = "";
  document.getElementById("modalBeli").classList.remove("hidden");
}
function tutupModal(id){ document.getElementById(id).classList.add("hidden"); }
function prosesBeli() {
  const p = DB.get("products",[]).find(x=>x.id===beliProdukId); if(!p)return;
  const tujuan = document.getElementById("bTujuan").value.trim();
  if (!tujuan) return toast("Masukkan ID / Nomor tujuan","error");
  const me = getMe();
  const hargaBayar = hitungHargaVip(p.harga, me.vipLevel);
  if (me.saldo < hargaBayar) return toast("Saldo tidak cukup, silakan isi saldo","error");
  if (!confirm(`Bayar ${rp(hargaBayar)} untuk ${p.nama}?`)) return;

  me.saldo -= hargaBayar;
  const set = DB.get("settings",{});
  const poinDapat = Math.floor(p.harga * (set.poinPercent||1) / 100);
  me.poin = Number(me.poin||0) + poinDapat;
  saveMe(me);

  const trx = DB.get("transactions",[]);
  trx.unshift({
    id: uid(), jenis:"pembelian", hp: me.hp, nama: me.nama,
    produk: p.nama, kategori: p.kategori, tujuan: tujuan,
    hargaNormal: p.harga, hargaBayar: hargaBayar, poin: poinDapat,
    status: "Sukses", tanggal: new Date().toISOString()
  });
  DB.set("transactions", trx);
  tutupModal("modalBeli");
  toast(`Berhasil! +${poinDapat} poin`);
  renderHome();
}

/* ---------- TOPUP SALDO ---------- */
function pilihNominal(n){ document.getElementById("tNominal").value = n; }
function prosesTopup() {
  const n = parseInt(document.getElementById("tNominal").value) || 0;
  if (n < 5000) return toast("Minimal topup Rp 5.000","error");
  const me = getMe();
  me.saldo = Number(me.saldo) + n;
  saveMe(me);
  const trx = DB.get("transactions",[]);
  trx.unshift({ id: uid(), jenis:"topup", hp: me.hp, nama: me.nama, nominal: n, status:"Sukses", keterangan:"Isi Saldo", tanggal: new Date().toISOString() });
  DB.set("transactions", trx);
  tutupModal("modalTopup");
  toast("Saldo bertambah "+rp(n));
  renderHome();
}

/* ---------- TARIK SALDO ---------- */
function prosesTarik() {
  const n = parseInt(document.getElementById("tarNominal").value) || 0;
  const tujuan = document.getElementById("tarTujuan").value.trim();
  if (n < 10000) return toast("Minimal tarik Rp 10.000","error");
  if (!tujuan) return toast("Masukkan rekening tujuan","error");
  const me = getMe();
  if (me.saldo < n) return toast("Saldo tidak cukup","error");
  me.saldo -= n;
  saveMe(me);
  const trx = DB.get("transactions",[]);
  trx.unshift({ id: uid(), jenis:"penarikan", hp: me.hp, nama: me.nama, nominal: n, status:"Menunggu", keterangan:"Tarik ke "+tujuan, tanggal: new Date().toISOString() });
  DB.set("transactions", trx);
  tutupModal("modalTarik");
  toast("Penarikan diajukan, menunggu admin");
  renderHome();
}

/* ---------- TUKAR POIN ---------- */
function tukarPoin() {
  const me = getMe();
  if ((me.poin||0) < 1) return toast("Poin belum cukup","error");
  const t = me.poin;
  me.saldo = Number(me.saldo) + t;
  me.poin = 0;
  saveMe(me);
  const trx = DB.get("transactions",[]);
  trx.unshift({ id: uid(), jenis:"topup", hp: me.hp, nama: me.nama, nominal: t, status:"Sukses", keterangan:`Tukar ${t} poin → saldo`, tanggal: new Date().toISOString() });
  DB.set("transactions", trx);
  toast(`Berhasil tukar ${t} poin = ${rp(t)}`);
  renderHome();
}

/* ---------- RIWAYAT ---------- */
let riwayatTab = "trx";
function pilihRiwayat(t) {
  riwayatTab = t;
  document.querySelectorAll(".rw-tab").forEach(x=>x.classList.toggle("active", x.dataset.tab===t));
  renderRiwayat();
}
function renderRiwayat() {
  const me = getMe(); if (!me) return;
  const all = DB.get("transactions",[]).filter(x => x.hp === me.hp);
  let list = [];
  if (riwayatTab === "trx") list = all.filter(t => t.jenis === "pembelian");
  else if (riwayatTab === "saldo") list = all.filter(t => ["topup","penarikan","upgrade_vip"].includes(t.jenis));
  else list = all.filter(t => t.jenis === "referal_bonus");

  const el = document.getElementById("rwList");
  if (list.length === 0) { el.innerHTML = `<p class="text-center text-gray-400 py-10 text-sm">Belum ada data</p>`; return; }
  el.innerHTML = list.map(t => {
    const tgl = new Date(t.tanggal).toLocaleString("id-ID");
    const sc = t.status==="Sukses"?"bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300":
               t.status==="Menunggu"?"bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300":
               "bg-red-100 text-red-700";
    const ic = { pembelian:"fa-bag-shopping text-blue-500", topup:"fa-plus text-emerald-500",
                 penarikan:"fa-minus text-orange-500", referal_bonus:"fa-gift text-pink-500", upgrade_vip:"fa-crown text-amber-500" }[t.jenis] || "fa-receipt";
    const det = t.produk || t.keterangan || (t.tujuan?"→ "+t.tujuan:"");
    const jml = (t.jenis==="topup"||t.jenis==="referal_bonus"?"+ ":"- ") + rp(t.hargaBayar||t.nominal);
    const jmlClr = (t.jenis==="topup"||t.jenis==="referal_bonus")?"text-emerald-600":"text-red-500";
    return `
    <div class="bg-white dark:bg-slate-800 rounded-xl p-3 flex gap-3 items-center">
      <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
        <i class="fa-solid ${ic}"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-sm text-gray-800 dark:text-white truncate">${t.jenis.replace("_"," ").toUpperCase()} • ${det}</p>
        <p class="text-[10px] text-gray-400">${tgl}</p>
      </div>
      <div class="text-right">
        <p class="font-extrabold text-sm ${jmlClr}">${jml}</p>
        <span class="pill ${sc} text-[9px]">${t.status}</span>
      </div>
    </div>`;
  }).join("");
}

/* ---------- PROFILE ---------- */
function renderProfile() {
  const me = getMe(); if (!me) return;
  const vip = VIP_TIERS.find(v=>v.level===me.vipLevel) || VIP_TIERS[0];
  const inisial = me.nama.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  document.getElementById("prAvatar").textContent = inisial;
  document.getElementById("prNama").textContent = me.nama;
  document.getElementById("prHp").textContent = me.hp;
  document.getElementById("prEmail").textContent = me.email;
  document.getElementById("prVip").textContent = vip.nama;
  document.getElementById("prVip").className = `pill vip-${vip.level} text-white text-xs`;
  document.getElementById("prVipExp").textContent = vip.level>0 ? "Aktif s/d "+new Date(me.vipExpire).toLocaleDateString("id-ID") : "Upgrade VIP untuk harga lebih murah";
  document.getElementById("prRef").textContent = me.refCode;
}
function prosesUbahPwd(e) {
  e.preventDefault();
  const me = getMe();
  const f = e.target;
  if (f.pLama.value !== me.password) return toast("Password lama salah","error");
  if (f.pBaru.value.length < 4) return toast("Password baru min 4 karakter","error");
  if (f.pBaru.value !== f.pBaru2.value) return toast("Password baru tidak cocok","error");
  me.password = f.pBaru.value;
  saveMe(me);
  f.reset();
  tutupModal("modalPwd");
  toast("Password berhasil diubah");
}
function pilihVip(level) {
  const me = getMe();
  const v = VIP_TIERS.find(x=>x.level===level);
  if (me.saldo < v.harga) return toast("Saldo tidak cukup. Isi saldo dulu","error");
  if (!confirm(`Upgrade ke ${v.nama} seharga ${rp(v.harga)}?`)) return;
  me.saldo -= v.harga;
  me.vipLevel = level;
  const d = new Date(); d.setMonth(d.getMonth()+1);
  me.vipExpire = d.toISOString();
  saveMe(me);
  const trx = DB.get("transactions",[]);
  trx.unshift({ id: uid(), jenis:"upgrade_vip", hp: me.hp, nama: me.nama, nominal: v.harga, status:"Sukses", keterangan:`Upgrade ${v.nama}`, tanggal: new Date().toISOString() });
  DB.set("transactions", trx);
  tutupModal("modalVip");
  toast("Selamat! Anda menjadi "+v.nama);
  renderProfile();
}

/* ---------- BOOT ---------- */
window.addEventListener("DOMContentLoaded", () => {
  initDB();
  // Theme
  const t = localStorage.getItem("rs_theme") || "light";
  document.documentElement.classList.toggle("dark", t === "dark");
  document.body.classList.toggle("dark", t === "dark");
  document.getElementById("themeIcon").className = t === "dark" ? "fa-solid fa-sun text-yellow-300" : "fa-solid fa-moon text-gray-700";

  // Cek session
  if (DB.get("session",null)) navTab("home");
  else showPage("page-login");
});
