const { useState, useEffect } = React;

const ICONS = {"Store": "🏪", "User": "👤", "Lock": "🔒", "Users": "👥", "Package": "📦", "BarChart3": "📊", "LogOut": "🚪", "Plus": "➕", "Trash2": "🗑", "Pencil": "✏️", "CheckCircle2": "✅", "XCircle": "❌", "Clock": "🕐", "ChevronLeft": "‹", "AlertCircle": "⚠️", "KeyRound": "🔑", "Check": "✓", "X": "✕", "Loader2": "⏳", "Search": "🔍", "Camera": "📷", "MessageCircle": "💬", "Truck": "🚚", "MapPin": "📍", "Banknote": "💵", "Smartphone": "📱", "RotateCcw": "↺", "Wallet": "👛", "RefreshCw": "🔄", "Bell": "🔔", "Settings": "⚙️", "Send": "📤", "Tag": "🏷", "ScanLine": "📷", "Printer": "🖨️"};

function Icon({ name, size = 18, className = "", style = {} }) {
  return (
    <span
      className={className}
      style={{ fontSize: size, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, ...style }}
    >
      {ICONS[name] || "•"}
    </span>
  );
}

// ---------- Firebase (Firestore + Auth via REST — no SDK needed, just fetch, so
// this works in any environment: the artifact preview, a browser, or later
// inside the Capacitor/APK webview) ----------
const FIREBASE_PROJECT_ID = "alawadly-53e7d";
const FIREBASE_API_KEY = "AIzaSyAp8Hbi1AmSovP3lxZ6PkMI2C2KgYdSEEo";
const DEV_RESET_PASSWORD = "awadly-reset-2026";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

let authState = { idToken: null, refreshToken: null, expiresAt: 0 };
let authPromise = null;

async function readErrorDetail(res) {
  try {
    const data = await res.json();
    const msg = data?.error?.message || data?.error_description || JSON.stringify(data).slice(0, 120);
    return `${res.status} ${msg}`;
  } catch {
    return `${res.status} ${res.statusText || ""}`.trim();
  }
}

function notifyStoreError(collectionName, detail) {
  try { window.dispatchEvent(new CustomEvent("store-error", { detail: { collectionName, detail } })); } catch {}
}

async function doAuth() {
  if (authState.refreshToken) {
    try {
      const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${authState.refreshToken}`,
      });
      if (res.ok) {
        const data = await res.json();
        authState = {
          idToken: data.id_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + Number(data.expires_in) * 1000,
        };
        return authState.idToken;
      }
    } catch {
      // fall through to a fresh anonymous sign-in
    }
  }
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });
  if (!res.ok) {
    const detail = await readErrorDetail(res);
    notifyStoreError("تسجيل الدخول (Auth)", detail);
    throw new Error(`auth failed: ${detail}`);
  }
  const data = await res.json();
  authState = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + Number(data.expiresIn) * 1000,
  };
  return authState.idToken;
}

async function ensureAuth() {
  if (authState.idToken && Date.now() < authState.expiresAt - 60000) {
    return authState.idToken;
  }
  if (!authPromise) {
    authPromise = doAuth().finally(() => { authPromise = null; });
  }
  return authPromise;
}

// ---------- Firestore typed-value encode/decode (plain JS <-> Firestore REST JSON) ----------
function toFirestoreValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFirestoreValue) } };
  if (typeof v === "object") return { mapValue: { fields: toFirestoreFields(v) } };
  return { stringValue: String(v) };
}
function toFirestoreFields(obj) {
  const fields = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    fields[k] = toFirestoreValue(v);
  });
  return fields;
}
function fromFirestoreValue(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromFirestoreValue);
  if ("mapValue" in v) return fromFirestoreFields(v.mapValue.fields || {});
  return null;
}
function fromFirestoreFields(fields) {
  const obj = {};
  Object.entries(fields || {}).forEach(([k, v]) => { obj[k] = fromFirestoreValue(v); });
  return obj;
}

// One real Firestore document per record (product/order/user/...), instead of one
// big JSON blob per collection. This is what prevents two people saving at the
// same time from wiping out each other's work — each save only touches its own
// document, so there's nothing to collide with.
// ---------- Offline write queue ----------
// If a save fails (no internet), instead of just losing it, queue it in
// localStorage and retry automatically once the connection is back.
const OFFLINE_QUEUE_KEY = "alawadly_offline_queue_v1";

function getOfflineQueue() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}
function setOfflineQueueRaw(q) {
  try { localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(q)); } catch {}
}
function notifyQueueChange() {
  try { window.dispatchEvent(new CustomEvent("offline-queue-change", { detail: getOfflineQueue().length })); } catch {}
}
function queueOfflineOp(collectionName, type, payload) {
  const q = getOfflineQueue();
  const id = type === "remove" ? payload : payload.id;
  const filtered = q.filter((op) => !(op.collectionName === collectionName && (op.type === "remove" ? op.payload : op.payload.id) === id));
  filtered.push({ collectionName, type, payload, queuedAt: Date.now() });
  setOfflineQueueRaw(filtered);
  notifyQueueChange();
}

function makeCollectionStore(collectionName) {
  const base = `${FIRESTORE_BASE}/${collectionName}`;
  return {
    async loadAll() {
      try {
        const token = await ensureAuth();
        let documents = [];
        let pageToken = null;
        do {
          const url = new URL(base);
          url.searchParams.set("pageSize", "300");
          if (pageToken) url.searchParams.set("pageToken", pageToken);
          const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
          if (!res.ok) {
            notifyStoreError(collectionName, await readErrorDetail(res));
            return null;
          }
          const data = await res.json();
          documents = documents.concat(data.documents || []);
          pageToken = data.nextPageToken || null;
        } while (pageToken);
        return documents.map((d) => fromFirestoreFields(d.fields));
      } catch (e) {
        console.error(`firestore loadAll ${collectionName} failed`, e);
        notifyStoreError(collectionName, e.message);
        return null;
      }
    },
    // Creates the document if missing, or fully replaces it if present — keyed by
    // our own `id` field, so concurrent edits to two different records never touch
    // the same document.
    async upsert(obj) {
      try {
        const token = await ensureAuth();
        const res = await fetch(`${base}/${obj.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ fields: toFirestoreFields(obj) }),
        });
        if (!res.ok) {
          queueOfflineOp(collectionName, "upsert", obj);
          notifyStoreError(collectionName, await readErrorDetail(res));
          return false;
        }
        return true;
      } catch (e) {
        console.error(`firestore upsert ${collectionName} failed`, e);
        queueOfflineOp(collectionName, "upsert", obj);
        notifyStoreError(collectionName, e.message);
        return false;
      }
    },
    async remove(id) {
      try {
        const token = await ensureAuth();
        const res = await fetch(`${base}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          queueOfflineOp(collectionName, "remove", id);
          notifyStoreError(collectionName, await readErrorDetail(res));
          return false;
        }
        return true;
      } catch (e) {
        console.error(`firestore remove ${collectionName} failed`, e);
        queueOfflineOp(collectionName, "remove", id);
        notifyStoreError(collectionName, e.message);
        return false;
      }
    },
  };
}
const usersStore = makeCollectionStore("users_col");
const productsStore = makeCollectionStore("products_col");
const productImagesStore = makeCollectionStore("product_images_col");
const changesStore = makeCollectionStore("changes_col");
const ordersStore = makeCollectionStore("orders_col");
const categoriesStore = makeCollectionStore("categories_col");
const transfersStore = makeCollectionStore("transfers_col");
const stockAlertsStore = makeCollectionStore("stock_alerts_col");
const attendanceStore = makeCollectionStore("attendance_col");
const withdrawalsStore = makeCollectionStore("withdrawals_col");

const STORE_BY_COLLECTION = {
  users_col: usersStore,
  products_col: productsStore,
  product_images_col: productImagesStore,
  changes_col: changesStore,
  orders_col: ordersStore,
  categories_col: categoriesStore,
  transfers_col: transfersStore,
  stock_alerts_col: stockAlertsStore,
  attendance_col: attendanceStore,
  withdrawals_col: withdrawalsStore,
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// The shop's "business day" for withdrawals runs 11am to 3am the next calendar
// day — so a withdrawal logged at 1am still counts toward the previous day.
function businessDayOf(ts) {
  const d = new Date(ts);
  if (d.getHours() < 3) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}


let syncingOfflineQueue = false;
async function syncOfflineQueue() {
  if (syncingOfflineQueue) return;
  const queue = getOfflineQueue();
  if (!queue.length) return;
  syncingOfflineQueue = true;
  const remaining = [];
  for (const op of queue) {
    const store = STORE_BY_COLLECTION[op.collectionName];
    if (!store) continue;
    const ok = op.type === "remove" ? await store.remove(op.payload) : await store.upsert(op.payload);
    if (!ok) remaining.push(op);
  }
  setOfflineQueueRaw(remaining);
  notifyQueueChange();
  syncingOfflineQueue = false;
}


// Fetches only the specific image documents needed (by product id) in one request,
// instead of loading every product's image up front. This is what keeps opening the
// Prices screen fast even with a catalog of 1000+ products.
async function batchGetImages(ids) {
  if (!ids.length) return {};
  try {
    const token = await ensureAuth();
    const resourceBase = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
    const documents = ids.map((id) => `${resourceBase}/product_images_col/${id}`);
    const res = await fetch(`https://firestore.googleapis.com/v1/${resourceBase}:batchGet`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ documents }),
    });
    if (!res.ok) {
      notifyStoreError("product_images_col", await readErrorDetail(res));
      return {};
    }
    const data = await res.json();
    const out = {};
    (data || []).forEach((entry) => {
      if (entry.found) {
        const id = entry.found.name.split("/").pop();
        const fields = fromFirestoreFields(entry.found.fields);
        out[id] = fields.image;
      }
    });
    return out;
  } catch (e) {
    console.error("batchGetImages failed", e);
    notifyStoreError("product_images_col", e.message);
    return {};
  }
}

// ---------- Session persistence ----------
// Uses localStorage so a logged-in employee stays logged in across app restarts.
// Note: Claude's artifact preview sandbox blocks localStorage for security, so this
// won't visibly do anything while testing inside this chat — but it works normally
// once this runs as a real web page or inside the Capacitor/APK build, which is the
// actual target environment.
const SESSION_KEY = "alawadly_session";
function saveSession(user) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id })); } catch {}
}
function loadSessionUserId() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw).id : null;
  } catch {
    return null;
  }
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function normalizeArabic(str) {
  return (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[أإآا]/g, "ا")
    .replace(/[ىئ]/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/\s+/g, " ");
}
const namesMatch = (a, b) => normalizeArabic(a) === normalizeArabic(b);

function parseNum(val) {
  if (val === undefined || val === null || val === "") return null;
  const converted = val
    .toString()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/,/g, ".")
    .trim();
  const n = parseFloat(converted);
  return isNaN(n) ? null : n;
}

function validateTiers(wholesale, half, retail) {
  if ([wholesale, half, retail].some((v) => v === null)) {
    return "من فضلك اكتب أرقام صحيحة في كل الأسعار";
  }
  if (wholesale > half) return "سعر الجملة لازم يكون أقل من أو يساوي سعر نص الجملة";
  if (half > retail) return "سعر نص الجملة لازم يكون أقل من أو يساوي سعر القطاعي";
  if (wholesale > retail) return "سعر الجملة لازم يكون أقل من أو يساوي سعر القطاعي";
  return null;
}

function resizeImageFile(file, maxDim = 900, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith("image/")) {
      reject(new Error("not an image file"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatArabicDate() {
  try {
    return new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return new Date().toDateString();
  }
}

function buildWhatsAppMessage(changedToday, products) {
  const entries = changedToday.map((c) => products.find((p) => p.id === c.id)).filter(Boolean);
  let msg = `📊 *تقرير تعديلات الأسعار - العوادلي*\n📅 ${formatArabicDate()}\n\n`;
  entries.forEach((p, i) => {
    msg += `${i + 1}. *${p.name}*\n   قطاعي: ${tierBase(p.retail)} | نص جملة: ${tierBase(p.half)} | جملة: ${tierBase(p.wholesale)}\n\n`;
  });
  msg += `---------------------------------\n📌 تم تحديث الأسعار المذكورة أعلاه في السيستم.`;
  return { msg, count: entries.length };
}

function paymentLabel(o) {
  if (!o.paid) return { label: "دفع معلق", color: "#FBBF24" };
  if (o.paymentMethod === "cash") return { label: "كاش", color: "#34D399" };
  if (o.paymentMethod === "vodafone_cash") return { label: "فودافون كاش", color: "#34D399" };
  if (o.paymentMethod === "instapay") return { label: "انستاباي", color: "#34D399" };
  if (o.paymentMethod === "split") {
    const via = o.splitTransferMethod === "instapay" ? "انستاباي" : "فودافون كاش";
    return { label: `كاش ${o.cashAmount} + تحويل ${via} ${o.transferAmount}`, color: "#FBBF24" };
  }
  return { label: "-", color: "#9A9EA6" };
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Opens a new tab formatted for an 80mm thermal receipt roll and triggers the
// native Android print dialog, so it works with any printer already set up as
// an Android print service (most Bluetooth/WiFi receipt printers support this).
function printOrderReceipt(order) {
  const pay = paymentLabel(order);
  const win = window.open("", "_blank");
  if (!win) return;
  const dateStr = new Date(order.createdAt).toLocaleString("ar-EG");
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>فاتورة</title>
<style>
  @page { margin: 2mm; size: 80mm auto; }
  * { box-sizing: border-box; }
  body { font-family: Tahoma, Arial, sans-serif; width: 76mm; margin: 0; padding: 2mm; font-size: 13px; color: #000; }
  h1 { text-align: center; font-size: 17px; margin: 0 0 2px; }
  .center { text-align: center; }
  .line { border-top: 1px dashed #000; margin: 6px 0; }
  .row { display: flex; justify-content: space-between; margin: 3px 0; }
  .total { font-weight: bold; font-size: 16px; }
  .muted { font-size: 11px; }
</style>
</head>
<body>
  <h1>العوادلي</h1>
  <p class="center muted">فاتورة أوردر</p>
  <div class="line"></div>
  <div class="row"><span>المندوب</span><span>${escapeHtml(order.repName)}</span></div>
  <div class="row"><span>المنطقة</span><span>${escapeHtml(order.area)}</span></div>
  ${order.dispatchLocation ? `<div class="row"><span>مكان الخروج</span><span>${escapeHtml(order.dispatchLocation)}</span></div>` : ""}
  <div class="line"></div>
  <div class="row total"><span>الإجمالي</span><span>${order.price}</span></div>
  <div class="row"><span>طريقة الدفع</span><span>${escapeHtml(pay.label)}</span></div>
  <div class="line"></div>
  ${order.notes ? `<p class="muted">ملاحظات: ${escapeHtml(order.notes)}</p>` : ""}
  <p class="center muted">${dateStr}</p>
  <p class="center muted">بواسطة: ${escapeHtml(order.employeeName)}</p>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 300);
}

function validatePaymentMethod(pm, price) {
  if (!pm.paymentMethod) return "اختار طريقة الدفع";
  if (pm.paymentMethod === "split") {
    if (!pm.splitTransferMethod) return "اختار وسيلة التحويل (فودافون كاش أو انستاباي)";
    const cash = parseNum(pm.cashAmount);
    const transfer = parseNum(pm.transferAmount);
    if (cash === null || transfer === null) return "اكتب مبالغ صحيحة للكاش والتحويل";
    if (Math.abs(cash + transfer - price) > 0.01) return "مجموع الكاش والتحويل لازم يساوي السعر الكلي";
  }
  return null;
}

const DEFAULT_ADMIN = {
  id: "admin-default",
  name: "admin",
  password: "admin123",
  role: "admin",
  status: "approved",
  permissions: { manageProducts: true, deleteProducts: true, editPrices: true },
};

// ---------- Small UI atoms ----------
function TextField({ label, icon, ...props }) {
  return (
    <label className="block mb-4 text-right">
      <span className="block mb-1.5 text-sm font-medium text-[#9A9EA6]">{label}</span>
      <div className="relative">
        <input {...props} className="field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px] transition-colors" />
        {icon && <Icon name={icon} size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7078]" />}
      </div>
    </label>
  );
}

function StatusStamp({ status }) {
  const map = {
    approved: { label: "معتمد", color: "#34D399", icon: "CheckCircle2" },
    rejected: { label: "مرفوض", color: "#FB7185", icon: "XCircle" },
    pending: { label: "قيد المراجعة", color: "#FBBF24", icon: "Clock" },
  };
  const s = map[status];
  return (
    <span className="inline-flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-bold" style={{ borderColor: s.color, color: s.color, transform: "rotate(-3deg)" }}>
      <Icon name={s.icon} size={13} /> {s.label}
    </span>
  );
}

function Modal({ title, accent = "#38BDF8", onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop" onClick={onClose}>
      <div className="panel rounded-2xl w-full max-w-sm p-5 modal-pop max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: accent }}>{title}</h3>
          <button onClick={onClose} className="text-[#9A9EA6] hover:text-white"><Icon name="X" size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---------- Auth screens ----------
function LoginScreen({ onLogin, goRegister, error, loading }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm fade-up">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg header-bar">
            <Icon name="Store" size={30} className="text-white" />
          </div>
          <h1 className="font-extrabold text-2xl text-sky-400 tracking-wide">العوادلي</h1>
          <p className="text-sm text-[#9A9EA6] mt-1">نظام إدارة أسعار ومبيعات المحل</p>
        </div>

        <div className="panel rounded-2xl p-6">
          <TextField label="اسم المستخدم" icon="User" value={name} onChange={(e) => setName(e.target.value)} placeholder="اكتب اسمك" />
          <TextField label="كلمة المرور" icon="Lock" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2 mb-4">
              <Icon name="AlertCircle" size={16} /> {error}
            </div>
          )}

          <button disabled={loading} onClick={() => onLogin(name.trim(), password)} className="btn-sky w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : null}
            تسجيل الدخول
          </button>

          <button onClick={goRegister} className="w-full text-center text-sm text-sky-400 font-semibold mt-4 hover:underline">
            ليس لديك حساب؟ إنشاء حساب جديد
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onRegister, goLogin, error, loading }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm fade-up">
        <button onClick={goLogin} className="flex items-center gap-1 text-sm text-[#9A9EA6] mb-4 hover:text-white">
          <Icon name="ChevronLeft" size={16} /> رجوع لتسجيل الدخول
        </button>
        <h1 className="font-extrabold text-xl text-sky-400 mb-1">إنشاء حساب جديد</h1>
        <p className="text-sm text-[#9A9EA6] mb-5">هيتبعت طلبك للأدمن عشان يوافق عليه</p>

        <div className="panel rounded-2xl p-6">
          <TextField label="الاسم" icon="User" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمك بالكامل" />
          <TextField label="كلمة المرور" icon="Lock" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة سر قوية" />
          <TextField label="تأكيد كلمة المرور" icon="KeyRound" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="اعد كتابة كلمة المرور" />

          {error && (
            <div className="flex items-center gap-2 text-sm text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2 mb-4">
              <Icon name="AlertCircle" size={16} /> {error}
            </div>
          )}

          <button disabled={loading} onClick={() => onRegister(name.trim(), password, confirm)} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : null}
            إرسال طلب التسجيل
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingScreen({ status, goLogin }) {
  const isRejected = status === "rejected";
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center fade-up">
        <div className="panel rounded-2xl p-8">
          <div className="stamp-anim inline-block mb-4"><StatusStamp status={status} /></div>
          <h2 className="font-bold text-lg mb-2 text-white">{isRejected ? "تم رفض طلبك" : "طلبك قيد المراجعة"}</h2>
          <p className="text-sm text-[#9A9EA6] mb-6">
            {isRejected ? "الأدمن رفض طلب انضمامك للمحل. تقدر تتواصل معاه لمعرفة السبب." : "لسه الأدمن ما وافقش على طلبك، حاول تسجيل الدخول تاني بعد شوية."}
          </p>
          <button onClick={goLogin} className="btn-sky rounded-xl px-6 py-2.5 font-bold">رجوع لتسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Shared header (vivid gradient "notch") ----------
function Header({ user, onLogout, title, onBack, onOpenProfile }) {
  return (
    <div className="header-bar mx-4 mt-4 mb-2 flex justify-between items-center p-4 rounded-2xl shadow-lg">
      <div className="text-right flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all">
            <Icon name="ChevronLeft" size={18} />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide">{title}</h1>
          <p className="text-white/85 text-xs mt-0.5">
            {user.name} · <span className="font-semibold">{user.role === "admin" ? "أدمن" : "موظف"}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {onOpenProfile && (
          <button onClick={onOpenProfile} className="bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all">
            <Icon name="Settings" size={17} />
          </button>
        )}
        <button onClick={onLogout} className="bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all">
          <Icon name="LogOut" size={18} />
        </button>
      </div>
    </div>
  );
}

// ---------- Account settings modal ----------
function ProfileModal({ user, users, setUsers, onClose, onUpdated }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    if (!name.trim()) { setError("اكتب اسم صحيح"); return; }
    if (users.some((u) => u.id !== user.id && namesMatch(u.name, name))) { setError("الاسم ده مستخدم قبل كده"); return; }
    if (password && password !== confirm) { setError("كلمة المرور غير متطابقة"); return; }
    const updated = { ...user, name: name.trim(), password: password ? password : user.password };
    setUsers(users.map((u) => (u.id === user.id ? updated : u)));
    usersStore.upsert(updated);
    onUpdated(updated);
    onClose();
  };

  return (
    <Modal title="⚙️ إعدادات الحساب" accent="#38BDF8" onClose={onClose}>
      <label className="block mb-3 text-right">
        <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">الاسم</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" />
      </label>
      <label className="block mb-3 text-right">
        <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">كلمة مرور جديدة (سيبها فاضية لو مش عايز تغيرها)</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" />
      </label>
      {password && (
        <label className="block mb-3 text-right">
          <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">تأكيد كلمة المرور</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" />
        </label>
      )}
      {error && <p className="text-xs text-rose-400 mb-3 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {error}</p>}
      <div className="flex gap-2">
        <button onClick={save} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
      </div>
    </Modal>
  );
}

// ---------- Main menu ----------
function MainMenu({ user, setView, onLogout, hasNew, onOpenProfile, onDevReset }) {
  const items = [
    { key: "prices", label: "أسعار المحل", desc: "جملة · نص جملة · قطاعي", icon: "Store", enabled: true, accent: "#10B981" },
    { key: "orders", label: "الطلبات", desc: "تسجيل أوردرات جديدة", icon: "Package", enabled: true, accent: "#F59E0B" },
    { key: "transfers", label: "تحويلات", desc: "تسجيل تحويلات فلوس", icon: "Send", enabled: true, accent: "#A855F7" },
    { key: "attendance", label: "الحضور والسحب", desc: "سجل حضورك وسحوباتك", icon: "Clock", enabled: true, accent: "#0EA5E9" },
    { key: "admin", label: "إدارة المستخدمين", desc: "الموافقة على الطلبات والصلاحيات", icon: "Users", enabled: user.role === "admin", accent: "#0EA5E9" },
    { key: "reports", label: "التقارير", desc: "الأوردرات المؤكدة والمبيعات", icon: "BarChart3", enabled: user.role === "admin", accent: "#F43F5E" },
    { key: "stock-alerts", label: "تنبيهات المخزون", desc: "منتجات خلصت أو مطلوبة", icon: "AlertCircle", enabled: user.role === "admin", accent: "#F59E0B" },
  ].filter((i) => (i.key !== "admin" && i.key !== "reports" && i.key !== "stock-alerts") || user.role === "admin");

  // Hidden developer entry point: admin taps the version label 3 times within
  // ~1.2s to reach the password-gated full data reset (used for clearing test data).
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = React.useRef(null);
  const [showDevReset, setShowDevReset] = useState(false);

  const handleVersionTap = () => {
    setTapCount((c) => {
      const next = c + 1;
      if (next >= 3) {
        setShowDevReset(true);
        return 0;
      }
      return next;
    });
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    tapTimerRef.current = setTimeout(() => setTapCount(0), 1200);
  };

  return (
    <div className="shop-root">
      <Header user={user} onLogout={onLogout} title="محلات العوادلي" onOpenProfile={onOpenProfile} />

      <div className="max-w-md mx-auto px-4 py-4 grid grid-cols-2 gap-3 fade-up">
        {items.map((it) => {
          const dotRed = (it.key === "orders" && hasNew.ordersPending) || (it.key === "stock-alerts" && hasNew["stock-alerts"]);
          const dotGreen = it.key !== "orders" && it.key !== "stock-alerts" && hasNew[it.key];
          return (
            <button
              key={it.key}
              disabled={!it.enabled}
              onClick={() => it.enabled && setView(it.key)}
              className="panel rounded-2xl p-4 text-right flex flex-col gap-2 transition-all"
              style={it.enabled ? {} : { opacity: 0.4 }}
              onMouseEnter={(e) => { if (it.enabled) e.currentTarget.style.borderColor = it.accent; }}
              onMouseLeave={(e) => { if (it.enabled) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
            >
              <div className="relative w-11 h-11 rounded-xl flex items-center justify-center shadow-md" style={{ background: it.accent }}>
                <Icon name={it.icon} size={21} className="text-white" />
                {(dotRed || dotGreen) && (
                  <span className="absolute w-3 h-3 rounded-full" style={{ top: -3, left: -3, background: dotRed ? "#F43F5E" : "#34D399", boxShadow: "0 0 0 2px #2A2E37" }} />
                )}
              </div>
              <div className="font-bold text-sm text-white">{it.label}</div>
              <div className="text-xs text-[#9A9EA6]">{it.desc}</div>
            </button>
          );
        })}
      </div>

      {user.role === "admin" && (
        <p onClick={handleVersionTap} className="text-center text-[10px] text-[#4B4F58] py-4 select-none cursor-default">
          الإصدار ١.٠
        </p>
      )}

      {showDevReset && <DevResetModal onClose={() => setShowDevReset(false)} onConfirmed={onDevReset} />}
    </div>
  );
}

function DevResetModal({ onClose, onConfirmed }) {
  const [stage, setStage] = useState("password");
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const checkPassword = () => {
    if (password !== DEV_RESET_PASSWORD) {
      setError("كلمة السر غلط");
      return;
    }
    setError("");
    setStage("confirm");
  };

  const doReset = async () => {
    if (confirmText.trim() !== "تصفير") {
      setError('اكتب "تصفير" بالظبط للتأكيد');
      return;
    }
    setError("");
    setBusy(true);
    await onConfirmed();
    setBusy(false);
    setDone(true);
  };

  return (
    <Modal title={done ? "تم" : stage === "password" ? "دخول المطور" : "تأكيد التصفير"} accent="#F43F5E" onClose={onClose}>
      {done ? (
        <>
          <p className="text-sm text-emerald-300 mb-4 leading-6">تم مسح كل البيانات بنجاح. حسابات المستخدمين فضلت زي ما هي.</p>
          <button onClick={onClose} className="btn-sky w-full rounded-xl py-2.5 font-bold">تمام</button>
        </>
      ) : stage === "password" ? (
        <>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة سر المطور"
            className="field-input w-full rounded-xl px-4 py-2.5 text-sm mb-3"
          />
          {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
          <button onClick={checkPassword} className="btn-sky w-full rounded-xl py-2.5 font-bold">دخول</button>
        </>
      ) : (
        <>
          <p className="text-sm text-rose-300 mb-3 leading-6">
            الخطوة دي هتمسح كل المنتجات والأوردرات والتحويلات والتصنيفات نهائيًا ومفيش رجوع فيها. حسابات المستخدمين (الأدمن والموظفين) هتفضل زي ما هي.
          </p>
          <p className="text-xs text-[#9A9EA6] mb-1.5">اكتب "تصفير" للتأكيد</p>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="field-input w-full rounded-xl px-4 py-2.5 text-sm mb-3"
          />
          {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
          <button disabled={busy} onClick={doReset} className="btn-rose w-full rounded-xl py-2.5 font-bold">
            {busy ? "بيتصفر..." : "تصفير كل البيانات نهائيًا"}
          </button>
        </>
      )}
    </Modal>
  );
}

// ---------- Prices screen ----------
// A tier (قطاعي / نص جملة / جملة) can now hold several price points — e.g. a
// different price for a bulk quantity — instead of just one number.
function tierRows(v) {
  if (Array.isArray(v)) return v.length ? v : [{ label: "", price: 0 }];
  if (typeof v === "number") return [{ label: "", price: v }];
  return [{ label: "", price: 0 }];
}
function tierBase(v) {
  const rows = tierRows(v);
  return rows[0] && rows[0].price !== undefined && rows[0].price !== null ? rows[0].price : 0;
}

function TierPriceEditor({ label, color, rows, setRows }) {
  const addRow = () => setRows([...rows, { id: uid(), label: "", price: "" }]);
  const removeRow = (id) => setRows(rows.filter((r) => r.id !== id));
  const updateRow = (id, field, val) => setRows(rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  return (
    <div className="price-chip !text-right">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold" style={{ color }}>{label}</span>
        <button type="button" onClick={addRow} className="text-[10px] text-sky-400 font-semibold">+ سعر تاني</button>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.id} className="flex gap-1.5 items-center">
            <input value={r.price} onChange={(e) => updateRow(r.id, "price", e.target.value)} placeholder="السعر" className="field-input rounded-lg px-2 py-1.5 text-xs text-center w-20 shrink-0" style={{ color }} />
            <div className="flex-1">
              <span className="block text-[10px] text-[#9A9EA6] mb-0.5">عدد القطع (اختياري)</span>
              <input value={r.label} onChange={(e) => updateRow(r.id, "label", e.target.value)} placeholder="مثال: من 10 قطع" className="field-input rounded-lg px-2 py-1.5 text-xs w-full" />
            </div>
            {rows.length > 1 && (
              <button type="button" onClick={() => removeRow(r.id)} className="text-rose-400 shrink-0"><Icon name="X" size={14} /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Uses the html5-qrcode library (loaded globally via a CDN script tag), which
// handles camera permissions and decoding for both barcodes and QR codes.
// Lets a product carry more than one barcode (e.g. different packaging/supplier
// codes for the same item) — any of them will match on lookup.
// Drop this in anywhere near the top of a screen's JSX (no wrapping needed) — it
// listens for a downward drag while the page is scrolled to the very top, and
// calls onRefresh once the drag passes the threshold.
function PullToRefresh({ onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const startY = React.useRef(null);
  const dragging = React.useRef(false);
  const pullDistRef = React.useRef(0);
  const refreshingRef = React.useRef(false);
  const wrapRef = React.useRef(null);
  const iconRef = React.useRef(null);
  const onRefreshRef = React.useRef(onRefresh);
  onRefreshRef.current = onRefresh;
  const THRESHOLD = 70;
  const MAX_PULL = 110;
  const SETTLE_HEIGHT = 54;

  useEffect(() => {
    const rootEl = document.getElementById("root");
    if (!rootEl) return;

    const setRootShift = (px, animated) => {
      rootEl.style.transition = animated ? "transform 0.25s cubic-bezier(.22,.8,.25,1)" : "none";
      rootEl.style.transform = px ? `translateY(${px}px)` : "";
    };
    // Pure DOM mutation, no React re-render — this is what keeps the drag smooth
    // even though the whole app runs through an in-browser Babel compile with no
    // production build step.
    const setSpinnerVisual = (dist, spinning) => {
      const wrap = wrapRef.current;
      const icon = iconRef.current;
      if (!wrap || !icon) return;
      wrap.style.opacity = dist > 2 ? String(Math.min(dist / 40, 1)) : "0";
      if (spinning) {
        icon.classList.add("animate-spin");
        icon.style.transform = "";
      } else {
        icon.classList.remove("animate-spin");
        icon.style.transform = `rotate(${dist * 3}deg)`;
      }
    };

    const onTouchStart = (e) => {
      if (window.scrollY <= 0 && !refreshingRef.current) {
        startY.current = e.touches[0].clientY;
        dragging.current = true;
      }
    };
    const onTouchMove = (e) => {
      if (!dragging.current) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy > 0) {
        // slight resistance as you pull further, like a native rubber-band feel
        const dist = Math.min(dy * 0.55, MAX_PULL);
        pullDistRef.current = dist;
        setRootShift(dist, false);
        setSpinnerVisual(dist, false);
      }
    };
    const onTouchEnd = async () => {
      if (!dragging.current) return;
      dragging.current = false;
      if (pullDistRef.current > THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        setRootShift(SETTLE_HEIGHT, true);
        setSpinnerVisual(SETTLE_HEIGHT, true);
        let ok = false;
        try {
          ok = await onRefreshRef.current();
        } catch (e) {
          console.error("pull-to-refresh failed", e);
          ok = false;
        } finally {
          refreshingRef.current = false;
          setRefreshing(false);
          setRootShift(0, true);
          setSpinnerVisual(0, false);
          pullDistRef.current = 0;
        }
        if (ok === false) {
          setFailed(true);
          setTimeout(() => setFailed(false), 3000);
        }
      } else {
        setRootShift(0, true);
        setSpinnerVisual(0, false);
        pullDistRef.current = 0;
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      rootEl.style.transform = "";
      rootEl.style.transition = "";
    };
  }, []);

  // Portaled straight to <body> (a sibling of the #root div being shifted), so this
  // indicator stays fixed to the real viewport instead of sliding down with the content.
  return ReactDOM.createPortal(
    <>
      <div ref={wrapRef} className="fixed top-3 inset-x-0 z-[100] flex justify-center pointer-events-none" style={{ opacity: 0 }}>
        <div className="bg-[#2A2E37] border border-white/10 rounded-full p-2.5 shadow-lg">
          <div ref={iconRef}>
            <Icon name="Loader2" size={18} className="text-sky-400" />
          </div>
        </div>
      </div>
      {failed && (
        <div className="fixed top-3 inset-x-3 z-[100] flex justify-center pointer-events-none">
          <div className="bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in flex items-center gap-1.5">
            <Icon name="AlertCircle" size={14} className="text-rose-400 shrink-0" />
            <span className="text-xs text-rose-300 font-bold">فشل التحديث — تأكد من اتصال الإنترنت</span>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}

function BarcodeListEditor({ barcodes, setBarcodes, onScan }) {
  const updateAt = (i, val) => setBarcodes(barcodes.map((b, idx) => (idx === i ? val : b)));
  const removeAt = (i) => setBarcodes(barcodes.length > 1 ? barcodes.filter((_, idx) => idx !== i) : [""]);
  const addBlank = () => setBarcodes([...barcodes, ""]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#9A9EA6]">الباركود (اختياري، ممكن أكتر من واحد لنفس المنتج)</span>
        <button type="button" onClick={addBlank} className="text-[10px] text-sky-400 font-semibold shrink-0">+ كود تاني</button>
      </div>
      <div className="space-y-1.5">
        {barcodes.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input value={b} onChange={(e) => updateAt(i, e.target.value)} placeholder="امسح أو اكتب الباركود" className="field-input flex-1 rounded-xl px-3 py-2 text-sm" />
            <button type="button" onClick={() => onScan(i)} className="icon-btn rounded-xl px-3 shrink-0"><Icon name="ScanLine" size={18} /></button>
            {barcodes.length > 1 && (
              <button type="button" onClick={() => removeAt(i)} className="text-rose-400 shrink-0"><Icon name="X" size={16} /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BarcodeScannerModal({ onDetected, onClose }) {
  const [error, setError] = useState("");
  const instanceRef = React.useRef(null);
  const stoppedRef = React.useRef(false);

  useEffect(() => {
    if (typeof Html5Qrcode === "undefined") {
      setError("مكتبة قراءة الباركود لسه بتحمّل، جرب تاني بعد ثانية");
      return;
    }
    const qr = new Html5Qrcode("barcode-reader-box");
    instanceRef.current = qr;
    stoppedRef.current = false;

    const safeStop = () => {
      if (stoppedRef.current) return Promise.resolve();
      stoppedRef.current = true;
      try {
        return qr.stop().catch(() => {});
      } catch {
        return Promise.resolve();
      }
    };

    qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 140 } },
      (decodedText) => {
        safeStop().finally(() => onDetected(decodedText));
      },
      () => {}
    ).catch(() => setError("تعذر تشغيل الكاميرا — تأكد إنك سمحت للموقع بصلاحية الكاميرا"));

    return () => {
      safeStop();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 modal-backdrop" onClick={onClose}>
      <div className="panel rounded-2xl p-4 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5"><Icon name="ScanLine" size={16} /> امسح الباركود</h3>
          <button onClick={onClose}><Icon name="X" size={20} className="text-[#9A9EA6]" /></button>
        </div>
        <div id="barcode-reader-box" className="rounded-xl overflow-hidden bg-black/40 min-h-[200px]" />
        {error && <p className="text-rose-400 text-xs mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
}

function ProductThumb({ product, editable, onPick }) {
  const fileRef = React.useRef(null);
  const [showLightbox, setShowLightbox] = useState(false);
  return (
    <div className="relative w-24 h-24 shrink-0">
      <div
        className="w-24 h-24 rounded-2xl overflow-hidden bg-black/30 flex items-center justify-center border border-white/5 cursor-pointer"
        onClick={() => product?.image && setShowLightbox(true)}
      >
        {product?.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <Icon name="Store" size={32} className="text-[#4B4F58]" />}
      </div>
      {editable && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current && fileRef.current.click()}
            className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center border-2 border-[#2A2E37] cursor-pointer"
          >
            <Icon name="Camera" size={14} className="text-white" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) onPick(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </>
      )}
      {showLightbox && product?.image && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 modal-backdrop" onClick={() => setShowLightbox(false)}>
          <div className="relative" style={{ width: "75vw", height: "75vh" }} onClick={(e) => e.stopPropagation()}>
            <img src={product.image} alt="" className="w-full h-full object-contain rounded-2xl" />
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Tapping an invoice photo opens it large in-page instead of window.open(dataURL),
// since many mobile browsers block navigating to a data: URL in a new tab and just
// show a blank page instead.
function InvoiceThumb({ src, className }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img src={src} onClick={() => setOpen(true)} className={`${className} cursor-pointer`} alt="فاتورة" />
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 modal-backdrop" onClick={() => setOpen(false)}>
          <div className="relative" style={{ width: "75vw", height: "75vh" }} onClick={(e) => e.stopPropagation()}>
            <img src={src} alt="" className="w-full h-full object-contain rounded-2xl" />
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Google-search-style combobox: type to filter existing categories, pick one from
// the dropdown, delete one inline, or create a brand-new one if nothing matches —
// scales fine even with a large number of categories, unlike showing them all as pills.
function CategoryCombobox({ categories, setCategories, value, onSelect, allowCreate = true, placeholder = "اكتب أو دور على تصنيف" }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = categories.find((c) => c.id === value);

  const normalizedQuery = normalizeArabic(query);
  const filtered = normalizedQuery ? categories.filter((c) => normalizeArabic(c.name).includes(normalizedQuery)) : categories;
  const exactMatch = categories.some((c) => normalizeArabic(c.name) === normalizedQuery);

  const createCategory = (name) => {
    const cat = { id: uid(), name };
    setCategories([...categories, cat]);
    categoriesStore.upsert(cat);
    onSelect(cat.id);
    setQuery("");
    setOpen(false);
  };

  const deleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    categoriesStore.remove(id);
    if (value === id) onSelect(null);
  };

  return (
    <div className="relative">
      <input
        value={open ? query : selected ? selected.name : query}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="field-input w-full rounded-xl px-3 py-2 text-sm"
      />
      {open && (
        <div className="absolute z-10 mt-1 w-full panel rounded-xl overflow-hidden max-h-52 overflow-y-auto">
          {selected && (
            <button onMouseDown={(e) => { e.preventDefault(); onSelect(null); setQuery(""); setOpen(false); }} className="w-full text-right px-3 py-2 text-xs text-rose-400 hover:bg-black/20 border-b border-white/5">
              ✕ إلغاء اختيار التصنيف
            </button>
          )}
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between hover:bg-black/20">
              <button onMouseDown={(e) => { e.preventDefault(); onSelect(c.id); setQuery(""); setOpen(false); }} className="flex-1 text-right px-3 py-2 text-sm text-white">
                {c.name}
              </button>
              <button onMouseDown={(e) => { e.preventDefault(); deleteCategory(c.id); }} className="text-rose-400 px-2">
                <Icon name="Trash2" size={13} />
              </button>
            </div>
          ))}
          {filtered.length === 0 && !query.trim() && <p className="text-xs text-[#6B7078] text-center py-3">لا يوجد تصنيفات بعد</p>}
          {allowCreate && query.trim() && !exactMatch && (
            <button onMouseDown={(e) => { e.preventDefault(); createCategory(query.trim()); }} className="w-full text-right px-3 py-2 text-sm text-sky-400 hover:bg-black/20 border-t border-white/5">
              + إنشاء تصنيف جديد: "{query.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function makeEmptyRow() {
  return { id: uid(), label: "", price: "" };
}
function makeEmptyNewProduct() {
  return { name: "", image: null, barcodes: [""], costPrice: "", categoryId: null, retailRows: [makeEmptyRow()], halfRows: [makeEmptyRow()], wholesaleRows: [makeEmptyRow()] };
}

function PricesScreen({ user, products, setProducts, productsLoading, changedToday, setChangedToday, categories, setCategories, setView }) {
  const canEditPrices = user.role === "admin" || !!user.permissions?.editPrices;
  const canManageProducts = user.role === "admin" || !!user.permissions?.manageProducts;
  const canDeleteProducts = user.role === "admin" || !!user.permissions?.deleteProducts;
  const isAdmin = user.role === "admin";
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [editError, setEditError] = useState("");
  const [newProd, setNewProd] = useState(makeEmptyNewProduct);
  const [addError, setAddError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [toast, setToast] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showManualReset, setShowManualReset] = useState(false);
  const [outOfStockProduct, setOutOfStockProduct] = useState(null);
  const [showMissingProduct, setShowMissingProduct] = useState(false);
  const [missingProductName, setMissingProductName] = useState("");
  const [scannerTarget, setScannerTarget] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const PAGE_SIZE = 30;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const normalizedQuery = normalizeArabic(query);
  const filteredProducts = products.filter((p) => {
    if (normalizedQuery && !normalizeArabic(p.name).includes(normalizedQuery)) return false;
    if (categoryFilter && p.categoryId !== categoryFilter) return false;
    return true;
  });
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Reset back to the first page whenever the search or category filter changes,
  // so you don't end up scrolled deep into a stale "load more" state.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [normalizedQuery, categoryFilter]);

  // Images live in a separate collection now (see productImagesStore), so only the
  // images for the page currently on screen get fetched — not all 1000+ at once.
  const [imageCache, setImageCache] = useState({});
  const visibleIdsKey = visibleProducts.map((p) => p.id).join(",");
  useEffect(() => {
    const idsNeeded = visibleProducts.filter((p) => !p.image && imageCache[p.id] === undefined).map((p) => p.id);
    if (!idsNeeded.length) return;
    let cancelled = false;
    (async () => {
      const fetched = await batchGetImages(idsNeeded);
      if (cancelled) return;
      const filled = {};
      idsNeeded.forEach((id) => { filled[id] = fetched[id] ?? null; });
      setImageCache((c) => ({ ...c, ...filled }));
    })();
    return () => { cancelled = true; };
  }, [visibleIdsKey]);

  const resolvedImage = (p) => imageCache[p.id] || p.image || null;

  const logChange = (id, name) => {
    if (changedToday.some((c) => c.id === id)) return;
    setChangedToday([...changedToday, { id, name }]);
    changesStore.upsert({ id, name });
  };

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2500);
  };

  const reportOutOfStock = (product, branch) => {
    const alert = {
      id: uid(),
      type: "outOfStock",
      productId: product.id,
      productName: product.name,
      branch,
      reportedBy: user.name,
      reportedAt: Date.now(),
      resolved: false,
    };
    stockAlertsStore.upsert(alert);
    setOutOfStockProduct(null);
    showToast("تم إبلاغ الأدمن إن المنتج خلص");
  };

  const submitMissingProduct = () => {
    if (!missingProductName.trim()) return;
    const alert = {
      id: uid(),
      type: "missingProduct",
      productId: null,
      productName: missingProductName.trim(),
      branch: null,
      reportedBy: user.name,
      reportedAt: Date.now(),
      resolved: false,
    };
    stockAlertsStore.upsert(alert);
    setMissingProductName("");
    setShowMissingProduct(false);
    showToast("تم إبلاغ الأدمن بالمنتج المطلوب");
  };

  const handleScanResult = (code) => {
    if (scannerTarget.mode === "new") {
      setNewProd((v) => {
        const barcodes = [...v.barcodes];
        barcodes[scannerTarget.index] = code;
        return { ...v, barcodes };
      });
    } else if (scannerTarget.mode === "edit") {
      setDraft((v) => {
        const barcodes = [...v.barcodes];
        barcodes[scannerTarget.index] = code;
        return { ...v, barcodes };
      });
    } else if (scannerTarget.mode === "lookup") {
      const match = products.find((p) => (p.barcodes && p.barcodes.includes(code)) || p.barcode === code);
      if (match) {
        setQuery(match.name);
        showToast(`لقينا: ${match.name}`);
      } else {
        showToast("مفيش منتج بالباركود ده");
      }
    }
    setScannerTarget(null);
  };

  const handleRefresh = async () => {
    const fresh = await productsStore.loadAll();
    if (fresh) setProducts(fresh);
    return !!fresh;
  };

  // One-time migration: older products still carry their photo embedded directly
  // in the product record. This moves each one into the separate images collection
  // and strips it from the product record, so future app opens stay fast.
  const [migrating, setMigrating] = useState(false);
  const [migrateProgress, setMigrateProgress] = useState("");
  const legacyImageProducts = products.filter((p) => typeof p.image === "string" && p.image.startsWith("data:"));

  const migrateImages = async () => {
    if (!legacyImageProducts.length) return;
    setMigrating(true);
    let done = 0;
    for (const p of legacyImageProducts) {
      await productImagesStore.upsert({ id: p.id, image: p.image });
      await productsStore.upsert(stripImage(p));
      done++;
      setMigrateProgress(`${done}/${legacyImageProducts.length}`);
    }
    setMigrating(false);
    setMigrateProgress("");
    showToast("تم ترحيل الصور، التطبيق هيفتح أسرع بكتير من المرة الجاية");
  };

  const toEditRows = (arr) => {
    const rows = tierRows(arr);
    return rows.map((r) => ({ id: uid(), label: r.label || "", price: r.price === "" || r.price === null ? "" : String(r.price) }));
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditError("");
    const existingBarcodes = p.barcodes && p.barcodes.length ? p.barcodes : (p.barcode ? [p.barcode] : [""]);
    setDraft({ retailRows: toEditRows(p.retail), halfRows: toEditRows(p.half), wholesaleRows: toEditRows(p.wholesale), costPrice: p.costPrice ?? "", barcodes: existingBarcodes });
  };

  // Validates a tier's rows (every price must parse), returns an error string or null.
  const validateRows = (rows) => {
    for (const r of rows) {
      if (parseNum(r.price) === null) return "اكتب أسعار صحيحة في كل الخانات";
    }
    return null;
  };
  const toStoredRows = (rows) => rows.map((r) => ({ label: r.label.trim(), price: parseNum(r.price) }));
  const cleanBarcodes = (arr) => (arr || []).map((b) => b.trim()).filter(Boolean);

  const stripImage = (obj) => {
    const { image, ...rest } = obj;
    return rest;
  };

  const saveEdit = (p) => {
    const rowsErr = validateRows(draft.retailRows) || validateRows(draft.halfRows) || validateRows(draft.wholesaleRows);
    if (rowsErr) {
      setEditError(rowsErr);
      return;
    }
    const err = validateTiers(parseNum(draft.wholesaleRows[0].price), parseNum(draft.halfRows[0].price), parseNum(draft.retailRows[0].price));
    if (err) {
      setEditError(err);
      return;
    }
    const updated = {
      ...p,
      retail: toStoredRows(draft.retailRows),
      half: toStoredRows(draft.halfRows),
      wholesale: toStoredRows(draft.wholesaleRows),
      barcodes: cleanBarcodes(draft.barcodes),
      updatedAt: Date.now(),
    };
    if (isAdmin) updated.costPrice = draft.costPrice !== "" ? parseNum(draft.costPrice) : null;
    setProducts(products.map((x) => (x.id === p.id ? updated : x)));
    productsStore.upsert(stripImage(updated));
    logChange(p.id, p.name);
    setEditingId(null);
    setEditError("");
  };

  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    productsStore.remove(id);
    productImagesStore.remove(id);
  };

  const pickExistingProductImage = async (p, file) => {
    try {
      const dataUrl = await resizeImageFile(file);
      const updated = { ...p, image: dataUrl };
      setProducts(products.map((x) => (x.id === p.id ? updated : x)));
      setImageCache((c) => ({ ...c, [p.id]: dataUrl }));
      productImagesStore.upsert({ id: p.id, image: dataUrl });
    } catch {
      // image is optional — ignore failures
    }
  };

  const pickNewProductImage = async (file) => {
    try {
      const dataUrl = await resizeImageFile(file);
      setNewProd((v) => ({ ...v, image: dataUrl }));
    } catch {
      setAddError("تعذر قراءة الصورة، جرب صورة تانية");
    }
  };

  const validateNewProduct = () => {
    if (!newProd.name.trim()) return "اكتب اسم المنتج";
    const rowsErr = validateRows(newProd.retailRows) || validateRows(newProd.halfRows) || validateRows(newProd.wholesaleRows);
    if (rowsErr) return rowsErr;
    return validateTiers(parseNum(newProd.wholesaleRows[0].price), parseNum(newProd.halfRows[0].price), parseNum(newProd.retailRows[0].price));
  };

  const addProduct = () => {
    const err = validateNewProduct();
    if (err) {
      setAddError(err);
      return;
    }
    const match = products.find((p) => normalizeArabic(p.name) === normalizeArabic(newProd.name));
    if (match) {
      setDuplicateMatch(match);
      return;
    }
    finalizeAddProduct(null);
  };

  const finalizeAddProduct = (overwriteId) => {
    const retail = toStoredRows(newProd.retailRows);
    const half = toStoredRows(newProd.halfRows);
    const wholesale = toStoredRows(newProd.wholesaleRows);
    const costPrice = isAdmin && newProd.costPrice !== "" ? parseNum(newProd.costPrice) : null;

    if (overwriteId) {
      const existing = products.find((p) => p.id === overwriteId);
      const image = newProd.image || existing.image || null;
      const updated = { ...existing, name: newProd.name.trim(), retail, half, wholesale, image, barcodes: cleanBarcodes(newProd.barcodes), categoryId: newProd.categoryId, updatedAt: Date.now(), ...(isAdmin ? { costPrice } : {}) };
      setProducts(products.map((p) => (p.id === overwriteId ? updated : p)));
      productsStore.upsert(stripImage(updated));
      if (newProd.image) {
        setImageCache((c) => ({ ...c, [overwriteId]: newProd.image }));
        productImagesStore.upsert({ id: overwriteId, image: newProd.image });
      }
      logChange(overwriteId, updated.name);
    } else {
      const newId = uid();
      const newProduct = { id: newId, name: newProd.name.trim(), retail, half, wholesale, image: newProd.image || null, barcodes: cleanBarcodes(newProd.barcodes), costPrice, categoryId: newProd.categoryId, createdAt: Date.now(), updatedAt: Date.now() };
      setProducts([...products, newProduct]);
      productsStore.upsert(stripImage(newProduct));
      if (newProd.image) {
        setImageCache((c) => ({ ...c, [newId]: newProd.image }));
        productImagesStore.upsert({ id: newId, image: newProd.image });
      }
      logChange(newId, newProduct.name);
    }
    setNewProd(makeEmptyNewProduct());
    setAddError("");
    setDuplicateMatch(null);
    setShowAdd(false);
  };

  const { msg: reportMsg, count: reportCount } = buildWhatsAppMessage(changedToday, products);
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(reportMsg)}`;

  const handleSendReportClick = (e) => {
    if (reportCount === 0) {
      e.preventDefault();
      showToast("مفيش تعديلات النهارده لسه");
      return;
    }
    setShowClearConfirm(true);
  };

  const clearChangeLog = () => {
    changedToday.forEach((c) => changesStore.remove(c.id));
    setChangedToday([]);
  };

  const canSeeReportButton = canEditPrices || canManageProducts;

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={handleRefresh} />
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="أسعار المحل" />

      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        {canSeeReportButton && (
          <div className="flex gap-2 mb-3">
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={handleSendReportClick} className="btn-whatsapp flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 no-underline">
              <Icon name="MessageCircle" size={18} /> إرسال تقرير التعديلات للواتساب
              <span className="bg-black/25 px-2 py-0.5 rounded-full text-xs">{changedToday.length}</span>
            </a>
            {changedToday.length > 0 && (
              <button onClick={() => setShowManualReset(true)} title="تصفير العداد" className="icon-btn rounded-xl px-3">
                <Icon name="RotateCcw" size={18} />
              </button>
            )}
          </div>
        )}
        {toast && <div className="toast-in text-xs text-center text-[#D4D4D8] bg-black/30 border border-white/10 rounded-xl px-3 py-2 mb-3">{toast}</div>}

        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن منتج... (عربي أو English)" className="field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px]" />
            <Icon name="Search" size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#6B7078]" />
          </div>
          <button onClick={() => setScannerTarget({ mode: "lookup" })} title="امسح الباركود" className="icon-btn rounded-xl px-3">
            <Icon name="ScanLine" size={18} />
          </button>
        </div>

        {isAdmin && legacyImageProducts.length > 0 && (
          <div className="panel rounded-xl p-3 mb-3 border border-amber-500/30 bg-amber-500/5">
            <p className="text-xs text-amber-300 font-bold mb-1.5">تحسين الأداء متاح</p>
            <p className="text-xs text-[#D4D4D8] mb-2">
              فيه {legacyImageProducts.length} منتج لسه صورهم متخزنة بالطريقة القديمة (بتخلي التطبيق يفتح أبطأ). ترحيلهم مرة واحدة بس هيخلي التطبيق يفتح أسرع بكتير من بعدها.
            </p>
            {migrating ? (
              <p className="text-xs text-amber-300 flex items-center gap-1.5"><Icon name="Loader2" size={14} className="animate-spin" /> بيترحّل... {migrateProgress}</p>
            ) : (
              <button onClick={migrateImages} className="btn-emerald rounded-lg px-3 py-1.5 text-xs font-bold">ترحيل الصور دلوقتي</button>
            )}
          </div>
        )}

        {(categories.length > 0 || isAdmin) && (
          <div className="mb-3 flex items-center gap-2">
            <Icon name="Tag" size={16} className="text-[#6B7078] shrink-0" />
            <div className="flex-1">
              <CategoryCombobox
                categories={categories}
                setCategories={setCategories}
                value={categoryFilter}
                onSelect={setCategoryFilter}
                allowCreate={isAdmin}
                placeholder="فلترة بالتصنيف (اختياري)"
              />
            </div>
          </div>
        )}

        <button onClick={() => setShowMissingProduct(true)} className="w-full text-xs text-purple-300 font-semibold bg-purple-500/10 border border-purple-500/20 rounded-xl py-2 mb-3 flex items-center justify-center gap-1.5">
          <Icon name="Tag" size={13} /> عايز تبلّغ عن منتج مش موجود في القايمة؟
        </button>

        <div className="space-y-3 pb-4">
          {productsLoading && products.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-10 text-[#9A9EA6] text-sm">
              <Icon name="Loader2" size={18} className="animate-spin" /> بيحمّل المنتجات...
            </div>
          )}
          {!productsLoading && products.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">لا يوجد منتجات مضافة بعد</p>}
          {products.length > 0 && filteredProducts.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">مفيش نتائج تطابق بحثك</p>}

          {visibleProducts.map((p) => {
            const editing = editingId === p.id;
            const cat = categories.find((c) => c.id === p.categoryId);
            return (
              <div key={p.id} className="panel p-4 rounded-2xl relative">
                <div className="flex items-center gap-3 mb-2">
                  <ProductThumb product={{ ...p, image: resolvedImage(p) }} editable={canManageProducts} onPick={(file) => pickExistingProductImage(p, file)} />
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-white">{p.name}</h3>
                    {cat && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full inline-block mt-1">{cat.name}</span>}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  {editing ? (
                    <div className="space-y-2">
                      <TierPriceEditor label="قطاعي" color="#34D399" rows={draft.retailRows} setRows={(rows) => setDraft({ ...draft, retailRows: rows })} />
                      <TierPriceEditor label="نص جملة" color="#FBBF24" rows={draft.halfRows} setRows={(rows) => setDraft({ ...draft, halfRows: rows })} />
                      <TierPriceEditor label="جملة" color="#FB7185" rows={draft.wholesaleRows} setRows={(rows) => setDraft({ ...draft, wholesaleRows: rows })} />
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                      {[
                        { key: "retail", label: "قطاعي", color: "#34D399" },
                        { key: "half", label: "نص جملة", color: "#FBBF24" },
                        { key: "wholesale", label: "جملة", color: "#FB7185" },
                      ].map((tier) => (
                        <div key={tier.key} className="price-chip">
                          <span className="block text-[#9A9EA6] mb-1">{tier.label}</span>
                          <div className="space-y-1">
                            {tierRows(p[tier.key]).map((r, i) => (
                              <div key={i}>
                                <span className="font-bold tabular-nums" style={{ color: tier.color }}>{r.price}</span>
                                {(r.label || i > 0) && <div className="text-xs font-bold text-[#D4D4D8] leading-tight mt-0.5">{r.label || "سعر تاني"}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="mt-2">
                    <BarcodeListEditor barcodes={draft.barcodes} setBarcodes={(barcodes) => setDraft({ ...draft, barcodes })} onScan={(i) => setScannerTarget({ mode: "edit", index: i })} />
                  </div>
                )}

                {editing && isAdmin && (
                  <div className="mt-2">
                    <input value={draft.costPrice} onChange={(e) => setDraft({ ...draft, costPrice: e.target.value })} placeholder="سعر الشراء (يظهر لك بس)" className="field-input rounded-md px-2 py-1.5 text-xs text-center w-full" />
                  </div>
                )}

                {!editing && isAdmin && p.costPrice != null && (
                  <p className="text-[10px] text-[#6B7078] mt-1.5 flex items-center gap-1"><Icon name="Wallet" size={10} /> سعر الشراء: {p.costPrice}</p>
                )}

                {editing && editError && <p className="text-xs text-rose-400 mt-2 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {editError}</p>}

                {(canEditPrices || canManageProducts || canDeleteProducts) && (
                  <div className="flex gap-2 justify-end mt-3 pt-2 border-t border-white/5">
                    {editing ? (
                      <>
                        <button onClick={() => saveEdit(p)} className="text-xs btn-emerald px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="Check" size={13} /> حفظ</button>
                        <button onClick={() => { setEditingId(null); setEditError(""); }} className="text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="X" size={13} /> إلغاء</button>
                      </>
                    ) : (
                      <>
                        {canEditPrices && (
                          <button onClick={() => startEdit(p)} className="text-xs bg-amber-600/20 text-amber-400 px-3 py-1 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1"><Icon name="Pencil" size={13} /> تعديل</button>
                        )}
                        {canDeleteProducts && (
                          <button onClick={() => removeProduct(p.id)} className="text-xs bg-rose-600/20 text-rose-400 px-2 py-1 rounded-lg font-semibold hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1"><Icon name="Trash2" size={13} /> حذف</button>
                        )}
                      </>
                    )}
                  </div>
                )}

                {!editing && (
                  <div className="flex justify-end mt-2">
                    <button onClick={() => setOutOfStockProduct(p)} className="text-xs bg-amber-600/10 text-amber-400 px-2.5 py-1 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1">
                      <Icon name="AlertCircle" size={12} /> المنتج خلص
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {filteredProducts.length > visibleProducts.length && (
            <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)} className="btn-ghost w-full rounded-xl py-2.5 text-sm font-bold">
              عرض المزيد ({filteredProducts.length - visibleProducts.length} متبقي)
            </button>
          )}
        </div>

        {canManageProducts && (
          <button onClick={() => { setShowAdd(true); setAddError(""); }} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-6">
            <Icon name="Plus" size={18} /> إضافة منتج جديد
          </button>
        )}

        {showAdd && (
          <Modal title="➕ إضافة منتج جديد" accent="#34D399" onClose={() => setShowAdd(false)}>
            <div className="flex items-center gap-3 mb-4">
              <ProductThumb product={{ image: newProd.image }} editable onPick={pickNewProductImage} />
              <span className="text-xs text-[#9A9EA6]">اضغط على الأيقونة لإضافة صورة المنتج (اختياري)</span>
            </div>
            <input placeholder="اسم المنتج" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3" />

            <BarcodeListEditor barcodes={newProd.barcodes} setBarcodes={(barcodes) => setNewProd({ ...newProd, barcodes })} onScan={(i) => setScannerTarget({ mode: "new", index: i })} />

            <div className="space-y-2 mb-3">
              <TierPriceEditor label="قطاعي" color="#34D399" rows={newProd.retailRows} setRows={(rows) => setNewProd({ ...newProd, retailRows: rows })} />
              <TierPriceEditor label="نص جملة" color="#FBBF24" rows={newProd.halfRows} setRows={(rows) => setNewProd({ ...newProd, halfRows: rows })} />
              <TierPriceEditor label="جملة" color="#FB7185" rows={newProd.wholesaleRows} setRows={(rows) => setNewProd({ ...newProd, wholesaleRows: rows })} />
            </div>

            <div className="mb-3">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">تصنيف المنتج (اختياري)</span>
              <CategoryCombobox
                categories={categories}
                setCategories={setCategories}
                value={newProd.categoryId}
                onSelect={(id) => setNewProd({ ...newProd, categoryId: id })}
                allowCreate
                placeholder="اكتب اسم تصنيف أو دور عليه"
              />
            </div>

            {isAdmin && (
              <label className="block mb-3 text-right">
                <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6] flex items-center gap-1"><Icon name="Wallet" size={12} /> سعر الشراء (يظهر لك بس، اختياري)</span>
                <input value={newProd.costPrice} onChange={(e) => setNewProd({ ...newProd, costPrice: e.target.value })} className="field-input w-full rounded-xl px-3 py-2 text-sm text-center" placeholder="تكلفة الشراء" />
              </label>
            )}

            {addError && <p className="text-xs text-rose-400 mb-3 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {addError}</p>}
            <div className="flex gap-2">
              <button onClick={addProduct} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}

        {duplicateMatch && (
          <Modal title="⚠️ فيه منتج بنفس الاسم" accent="#FBBF24" onClose={() => setDuplicateMatch(null)}>
            <p className="text-sm text-[#D4D4D8] mb-4">
              فيه منتج محفوظ عنده نفس الاسم أو اسم قريب جدًا منه: <span className="font-bold text-white">{duplicateMatch.name}</span>. تحب تستبدل بياناته بالأسعار الجديدة اللي كتبتها، ولا تلغي؟
            </p>
            <div className="flex gap-2">
              <button onClick={() => finalizeAddProduct(duplicateMatch.id)} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">استبدال البيانات</button>
              <button onClick={() => setDuplicateMatch(null)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}

        {outOfStockProduct && (
          <Modal title="المنتج خلص فين؟" accent="#F59E0B" onClose={() => setOutOfStockProduct(null)}>
            <p className="text-sm text-[#D4D4D8] mb-4">
              <span className="font-bold text-white">{outOfStockProduct.name}</span> — اختار الفرع اللي المنتج خلص فيه، هيتبعت للأدمن على طول.
            </p>
            <div className="flex gap-2">
              {DISPATCH_LOCATIONS.map((loc) => (
                <button key={loc} onClick={() => reportOutOfStock(outOfStockProduct, loc)} className="btn-sky flex-1 rounded-xl py-2.5 text-sm font-bold">
                  {loc}
                </button>
              ))}
            </div>
          </Modal>
        )}

        {showMissingProduct && (
          <Modal title="منتج مش موجود في القايمة" accent="#A855F7" onClose={() => { setShowMissingProduct(false); setMissingProductName(""); }}>
            <p className="text-sm text-[#D4D4D8] mb-3">اكتب اسم أو وصف المنتج اللي الزبون سأل عنه، هيتبعت للأدمن.</p>
            <input
              value={missingProductName}
              onChange={(e) => setMissingProductName(e.target.value)}
              placeholder="اسم المنتج المطلوب"
              className="field-input w-full rounded-xl px-4 py-2.5 text-sm mb-3"
            />
            <button onClick={submitMissingProduct} className="btn-sky w-full rounded-xl py-2.5 font-bold">إرسال للأدمن</button>
          </Modal>
        )}

        {scannerTarget && <BarcodeScannerModal onDetected={handleScanResult} onClose={() => setScannerTarget(null)} />}

        {showClearConfirm && (
          <Modal title="📋 تم فتح واتساب" accent="#25D366" onClose={() => setShowClearConfirm(false)}>
            <p className="text-sm text-[#D4D4D8] mb-4">اختار جروب الموظفين من واتساب وابعت الرسالة اللي اتفتحت. تحب تصفّر عداد التعديلات دلوقتي؟</p>
            <div className="flex gap-2">
              <button onClick={() => { clearChangeLog(); setShowClearConfirm(false); }} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">تصفير العداد</button>
              <button onClick={() => setShowClearConfirm(false)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">سيبه زي ما هو</button>
            </div>
          </Modal>
        )}

        {showManualReset && (
          <Modal title="⚠️ تصفير عداد التعديلات" accent="#FB7185" onClose={() => setShowManualReset(false)}>
            <p className="text-sm text-[#D4D4D8] mb-4">هيتصفّر عدد التعديلات المسجلة دلوقتي ({changedToday.length}) من غير ما تتبعت أي رسالة. متأكد؟</p>
            <div className="flex gap-2">
              <button onClick={() => { clearChangeLog(); setShowManualReset(false); }} className="btn-rose flex-1 rounded-xl py-2 text-sm font-bold">أيوه، صفّر العداد</button>
              <button onClick={() => setShowManualReset(false)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">لأ، رجّعني</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

// ---------- Orders screen ----------
const EMPTY_ORDER_FORM = {
  repName: "",
  area: "",
  dispatchLocation: "",
  price: "",
  notes: "",
  invoiceImage: null,
  paid: null,
  paymentMethod: null,
  splitTransferMethod: null,
  cashAmount: "",
  transferAmount: "",
};

function validateOrder(form) {
  if (!form.repName.trim()) return "اكتب اسم المندوب";
  if (!form.area.trim()) return "اكتب المنطقة أو اسم المحل";
  const price = parseNum(form.price);
  if (price === null || price <= 0) return "اكتب سعر صحيح للأوردر";
  if (form.paid === null) return "حدد الأوردر مدفوع ولا لأ";
  if (form.paid) return validatePaymentMethod(form, price);
  return null;
}

const PAYMENT_METHODS = [
  { key: "cash", label: "كاش", icon: "Banknote" },
  { key: "vodafone_cash", label: "فودافون كاش", icon: "Smartphone" },
  { key: "instapay", label: "انستاباي", icon: "Smartphone" },
  { key: "split", label: "جزء كاش وجزء تحويل", icon: "Banknote" },
];

function PaymentMethodPicker({ value, onChange }) {
  return (
    <>
      <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">طريقة الدفع</span>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {PAYMENT_METHODS.map((m) => (
          <button key={m.key} onClick={() => onChange({ ...value, paymentMethod: m.key })} className={`toggle-pill rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 ${value.paymentMethod === m.key ? "active-sky" : ""}`}>
            <Icon name={m.icon} size={13} /> {m.label}
          </button>
        ))}
      </div>
      {value.paymentMethod === "split" && (
        <>
          <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">التحويل عن طريق</span>
          <div className="flex gap-2 mb-3">
            <button onClick={() => onChange({ ...value, splitTransferMethod: "vodafone_cash" })} className={`toggle-pill flex-1 rounded-xl py-2 text-xs font-bold ${value.splitTransferMethod === "vodafone_cash" ? "active-sky" : ""}`}>فودافون كاش</button>
            <button onClick={() => onChange({ ...value, splitTransferMethod: "instapay" })} className={`toggle-pill flex-1 rounded-xl py-2 text-xs font-bold ${value.splitTransferMethod === "instapay" ? "active-sky" : ""}`}>انستاباي</button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input value={value.cashAmount} onChange={(e) => onChange({ ...value, cashAmount: e.target.value })} className="field-input rounded-xl px-3 py-2 text-sm text-center" placeholder="المبلغ كاش" />
            <input value={value.transferAmount} onChange={(e) => onChange({ ...value, transferAmount: e.target.value })} className="field-input rounded-xl px-3 py-2 text-sm text-center" placeholder="المبلغ تحويل" />
          </div>
        </>
      )}
    </>
  );
}

const EMPTY_CONFIRM_FORM = { paymentMethod: null, splitTransferMethod: null, cashAmount: "", transferAmount: "" };
const DISPATCH_LOCATIONS = ["السنانية", "المطري"];

function OrdersScreen({ user, orders, setOrders, setView }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_ORDER_FORM);
  const [error, setError] = useState("");
  const invoiceFileRef = React.useRef(null);

  const [confirmingOrder, setConfirmingOrder] = useState(null);
  const [confirmForm, setConfirmForm] = useState(EMPTY_CONFIRM_FORM);
  const [confirmError, setConfirmError] = useState("");

  const repNameOptions = [...new Set(orders.map((o) => o.repName).filter(Boolean))];
  const areaOptions = [...new Set(orders.map((o) => o.area).filter(Boolean))];

  const handleRefresh = async () => {
    const fresh = await ordersStore.loadAll();
    if (fresh) setOrders(fresh);
    return !!fresh;
  };

  // Paid orders drop off this screen 24 hours after payment was confirmed — they're
  // still permanently available to the admin in Reports regardless of age.
  const DAY_MS = 24 * 60 * 60 * 1000;
  const visibleOrders = orders.filter((o) => !(o.paid && o.confirmedAt && Date.now() - o.confirmedAt > DAY_MS));

  const pickInvoiceImage = async (file) => {
    try {
      const dataUrl = await resizeImageFile(file, 1400, 0.88);
      setForm((v) => ({ ...v, invoiceImage: dataUrl }));
    } catch {
      // optional — ignore failures
    }
  };

  const addOrder = () => {
    const err = validateOrder(form);
    if (err) {
      setError(err);
      return;
    }
    const price = parseNum(form.price);
    const isSplit = form.paid && form.paymentMethod === "split";
    const newOrder = {
      id: uid(),
      employeeName: user.name,
      repName: form.repName.trim(),
      area: form.area.trim(),
      dispatchLocation: form.dispatchLocation || null,
      price,
      notes: form.notes.trim(),
      invoiceImage: form.invoiceImage || null,
      paid: form.paid,
      paymentMethod: form.paid ? form.paymentMethod : null,
      splitTransferMethod: isSplit ? form.splitTransferMethod : null,
      cashAmount: isSplit ? parseNum(form.cashAmount) : null,
      transferAmount: isSplit ? parseNum(form.transferAmount) : null,
      confirmedBy: null,
      confirmedAt: null,
      createdAt: Date.now(),
    };
    setOrders([newOrder, ...orders]);
    ordersStore.upsert(newOrder);
    setForm(EMPTY_ORDER_FORM);
    setError("");
    setShowAdd(false);
  };

  const openConfirm = (order) => {
    setConfirmingOrder(order);
    setConfirmForm(EMPTY_CONFIRM_FORM);
    setConfirmError("");
  };

  const finalizeConfirm = () => {
    const err = validatePaymentMethod(confirmForm, confirmingOrder.price);
    if (err) {
      setConfirmError(err);
      return;
    }
    const isSplit = confirmForm.paymentMethod === "split";
    const updated = {
      ...confirmingOrder,
      paid: true,
      paymentMethod: confirmForm.paymentMethod,
      splitTransferMethod: isSplit ? confirmForm.splitTransferMethod : null,
      cashAmount: isSplit ? parseNum(confirmForm.cashAmount) : null,
      transferAmount: isSplit ? parseNum(confirmForm.transferAmount) : null,
      confirmedBy: user.name,
      confirmedAt: Date.now(),
    };
    setOrders(orders.map((o) => (o.id === confirmingOrder.id ? updated : o)));
    ordersStore.upsert(updated);
    setConfirmingOrder(null);
  };

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={handleRefresh} />
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="الطلبات" />

      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <button onClick={() => { setShowAdd(true); setError(""); }} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-4">
          <Icon name="Plus" size={18} /> إضافة أوردر جديد
        </button>

        <div className="space-y-3 pb-6">
          {visibleOrders.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">لا يوجد أوردرات مسجلة بعد</p>}
          {visibleOrders.map((o) => {
            const pay = paymentLabel(o);
            return (
              <div key={o.id} className="panel p-4 rounded-2xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-1.5"><Icon name="Truck" size={15} className="text-[#9A9EA6]" /> {o.repName}</h3>
                    <p className="text-xs text-[#9A9EA6] flex items-center gap-1 mt-0.5">
                      <Icon name="MapPin" size={12} /> {o.area}{o.dispatchLocation ? ` · من: ${o.dispatchLocation}` : ""}
                    </p>
                  </div>
                  <span className="font-bold text-lg text-sky-400 tabular-nums">{o.price}</span>
                </div>

                {o.notes && <p className="text-xs text-[#D4D4D8] bg-black/15 rounded-lg px-2.5 py-1.5 mb-2">📝 {o.notes}</p>}

                {o.invoiceImage && (
                  <InvoiceThumb src={o.invoiceImage} className="w-14 h-14 rounded-lg object-cover border border-white/10 mb-2" />
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${pay.color}22`, color: pay.color }}>{pay.label}</span>
                  <span className="text-xs font-bold text-amber-300">
                    {o.employeeName} <span className="text-[#7C818C] font-normal">· {new Date(o.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                  </span>
                </div>

                {o.paid && o.confirmedBy && (
                  <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1"><Icon name="CheckCircle2" size={12} /> استلم الفلوس: {o.confirmedBy}</p>
                )}

                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => printOrderReceipt(o)} className="text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="Printer" size={13} /> طباعة</button>
                  {!o.paid && (
                    <button onClick={() => openConfirm(o)} className="text-xs btn-emerald px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="CheckCircle2" size={13} /> تم الدفع</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showAdd && (
          <Modal title="➕ أوردر جديد" accent="#FBBF24" onClose={() => setShowAdd(false)}>
            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">اسم الموظف</span>
              <div className="field-input w-full rounded-xl px-4 py-2.5 text-sm opacity-70">{user.name}</div>
            </label>

            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">اسم المندوب</span>
              <input list="rep-names" value={form.repName} onChange={(e) => setForm({ ...form, repName: e.target.value })} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="اسم المندوب" />
              <datalist id="rep-names">{repNameOptions.map((n) => <option value={n} key={n} />)}</datalist>
            </label>

            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">المنطقة أو اسم المحل</span>
              <input list="area-names" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="المنطقة أو اسم المحل" />
              <datalist id="area-names">{areaOptions.map((n) => <option value={n} key={n} />)}</datalist>
            </label>

            <div className="mb-3">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">مكان خروج الأوردر (اختياري)</span>
              <div className="flex gap-2">
                {DISPATCH_LOCATIONS.map((loc) => (
                  <button key={loc} onClick={() => setForm({ ...form, dispatchLocation: form.dispatchLocation === loc ? "" : loc })} className={`toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${form.dispatchLocation === loc ? "active-sky" : ""}`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">السعر</span>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="field-input w-full rounded-xl px-4 py-2.5 text-sm text-center" placeholder="السعر الكلي" />
            </label>

            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">ملاحظات (اختياري)</span>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="field-input w-full rounded-xl px-4 py-2.5 text-sm resize-none" rows={2} placeholder="أي ملاحظات على الأوردر" />
            </label>

            <div className="mb-3">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">صورة الفاتورة (اختياري)</span>
              {form.invoiceImage ? (
                <div className="relative inline-block">
                  <img src={form.invoiceImage} className="w-20 h-20 rounded-xl object-cover border border-white/10" alt="فاتورة" />
                  <button onClick={() => setForm({ ...form, invoiceImage: null })} className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center">
                    <Icon name="X" size={11} className="text-white" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => invoiceFileRef.current && invoiceFileRef.current.click()} className="btn-ghost rounded-xl px-4 py-2 text-xs flex items-center gap-1.5">
                  <Icon name="Camera" size={14} /> إضافة صورة
                </button>
              )}
              <input ref={invoiceFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files && e.target.files[0]) pickInvoiceImage(e.target.files[0]); e.target.value = ""; }} />
            </div>

            <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">دفع ولا لأ؟</span>
            <div className="flex gap-2 mb-3">
              <button onClick={() => setForm({ ...form, paid: true })} className={`toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${form.paid === true ? "active-emerald" : ""}`}>مدفوع</button>
              <button onClick={() => setForm({ ...form, paid: false, paymentMethod: null })} className={`toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${form.paid === false ? "active-rose" : ""}`}>غير مدفوع</button>
            </div>

            {form.paid === true && <PaymentMethodPicker value={form} onChange={setForm} />}

            {error && <p className="text-xs text-rose-400 mb-3 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {error}</p>}

            <div className="flex gap-2">
              <button onClick={addOrder} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ الأوردر</button>
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}

        {confirmingOrder && (
          <Modal title="✅ تأكيد استلام الدفع" accent="#34D399" onClose={() => setConfirmingOrder(null)}>
            <div className="panel rounded-xl p-3 mb-4 text-sm">
              <p className="text-white font-bold">{confirmingOrder.repName} · {confirmingOrder.area}</p>
              <p className="text-sky-400 font-bold tabular-nums mt-1">{confirmingOrder.price} جنيه</p>
            </div>
            <PaymentMethodPicker value={confirmForm} onChange={setConfirmForm} />
            {confirmError && <p className="text-xs text-rose-400 mb-3 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {confirmError}</p>}
            <div className="flex gap-2">
              <button onClick={finalizeConfirm} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">تأكيد الدفع</button>
              <button onClick={() => setConfirmingOrder(null)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

// ---------- Transfers screen ----------
function TransfersScreen({ user, transfers, setTransfers, setView }) {
  const [showAdd, setShowAdd] = useState(false);
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const [confirmingTransfer, setConfirmingTransfer] = useState(null);
  const [confirmForm, setConfirmForm] = useState(EMPTY_CONFIRM_FORM);
  const [confirmError, setConfirmError] = useState("");

  const nameOptions = [...new Set(transfers.map((t) => t.personName).filter(Boolean))];

  const handleRefresh = async () => {
    const fresh = await transfersStore.loadAll();
    if (fresh) setTransfers(fresh);
    return !!fresh;
  };

  const addTransfer = () => {
    if (!personName.trim()) {
      setError("اكتب اسم الشخص");
      return;
    }
    const amt = parseNum(amount);
    if (amt === null || amt <= 0) {
      setError("اكتب مبلغ صحيح");
      return;
    }
    const newTransfer = {
      id: uid(),
      personName: personName.trim(),
      amount: amt,
      createdBy: user.name,
      createdAt: Date.now(),
      paid: false,
      paymentMethod: null,
      splitTransferMethod: null,
      cashAmount: null,
      transferAmount: null,
      confirmedBy: null,
      confirmedAt: null,
    };
    setTransfers([newTransfer, ...transfers]);
    transfersStore.upsert(newTransfer);
    setPersonName("");
    setAmount("");
    setError("");
    setShowAdd(false);
  };

  const openConfirm = (t) => {
    setConfirmingTransfer(t);
    setConfirmForm(EMPTY_CONFIRM_FORM);
    setConfirmError("");
  };

  const finalizeConfirm = () => {
    const err = validatePaymentMethod(confirmForm, confirmingTransfer.amount);
    if (err) {
      setConfirmError(err);
      return;
    }
    const isSplit = confirmForm.paymentMethod === "split";
    const updated = {
      ...confirmingTransfer,
      paid: true,
      paymentMethod: confirmForm.paymentMethod,
      splitTransferMethod: isSplit ? confirmForm.splitTransferMethod : null,
      cashAmount: isSplit ? parseNum(confirmForm.cashAmount) : null,
      transferAmount: isSplit ? parseNum(confirmForm.transferAmount) : null,
      confirmedBy: user.name,
      confirmedAt: Date.now(),
    };
    setTransfers(transfers.map((t) => (t.id === confirmingTransfer.id ? updated : t)));
    transfersStore.upsert(updated);
    setConfirmingTransfer(null);
  };

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={handleRefresh} />
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="تحويلات" />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <button onClick={() => { setShowAdd(true); setError(""); }} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-4">
          <Icon name="Plus" size={18} /> تسجيل تحويل جديد
        </button>

        <div className="space-y-3 pb-6">
          {transfers.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">لا يوجد تحويلات مسجلة بعد</p>}
          {transfers.map((t) => {
            const pay = paymentLabel(t);
            return (
              <div key={t.id} className="panel p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-white text-sm">{t.personName}</p>
                  <span className="font-bold text-purple-400 tabular-nums">{t.amount}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${pay.color}22`, color: pay.color }}>{pay.label}</span>
                  <span className="text-xs font-bold text-amber-300">{t.createdBy} <span className="text-[#7C818C] font-normal">· {new Date(t.createdAt).toLocaleString("ar-EG")}</span></span>
                </div>
                {t.paid && t.confirmedBy && (
                  <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1"><Icon name="CheckCircle2" size={12} /> استلم الفلوس: {t.confirmedBy}</p>
                )}
                {!t.paid && (
                  <div className="flex justify-end mt-2">
                    <button onClick={() => openConfirm(t)} className="text-xs btn-emerald px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="CheckCircle2" size={13} /> تأكيد الدفع</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showAdd && (
          <Modal title="💸 تحويل جديد" accent="#A855F7" onClose={() => setShowAdd(false)}>
            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">اسم الشخص</span>
              <input list="transfer-names" value={personName} onChange={(e) => setPersonName(e.target.value)} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="اسم الشخص" />
              <datalist id="transfer-names">{nameOptions.map((n) => <option value={n} key={n} />)}</datalist>
            </label>
            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#9A9EA6]">المبلغ</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="field-input w-full rounded-xl px-4 py-2.5 text-sm text-center" placeholder="المبلغ" />
            </label>
            {error && <p className="text-xs text-rose-400 mb-3 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {error}</p>}
            <div className="flex gap-2">
              <button onClick={addTransfer} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
              <button onClick={() => setShowAdd(false)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}

        {confirmingTransfer && (
          <Modal title="✅ تأكيد استلام الدفع" accent="#34D399" onClose={() => setConfirmingTransfer(null)}>
            <div className="panel rounded-xl p-3 mb-4 text-sm">
              <p className="text-white font-bold">{confirmingTransfer.personName}</p>
              <p className="text-purple-400 font-bold tabular-nums mt-1">{confirmingTransfer.amount} جنيه</p>
            </div>
            <PaymentMethodPicker value={confirmForm} onChange={setConfirmForm} />
            {confirmError && <p className="text-xs text-rose-400 mb-3 flex items-center gap-1"><Icon name="AlertCircle" size={12} /> {confirmError}</p>}
            <div className="flex gap-2">
              <button onClick={finalizeConfirm} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">تأكيد الدفع</button>
              <button onClick={() => setConfirmingTransfer(null)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

// ---------- Reports screen (admin only) ----------
function ReportsScreen({ user, orders, setView }) {
  const paidOrders = orders.filter((o) => o.paid).sort((a, b) => b.createdAt - a.createdAt);
  const total = paidOrders.reduce((s, o) => s + o.price, 0);
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="shop-root">
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="التقارير" />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <div className="panel rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#9A9EA6]">أوردرات مؤكدة الدفع</p>
            <p className="text-2xl font-bold text-emerald-400">{paidOrders.length}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-[#9A9EA6]">إجمالي المبيعات</p>
            <p className="text-2xl font-bold text-sky-400 tabular-nums">{total}</p>
          </div>
        </div>

        <div className="space-y-3 pb-6">
          {paidOrders.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">لسه مفيش أوردرات مؤكدة الدفع</p>}
          {paidOrders.map((o) => {
            const pay = paymentLabel(o);
            const expanded = expandedId === o.id;
            return (
              <div key={o.id} className="panel p-4 rounded-2xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-base text-white flex items-center gap-1.5"><Icon name="Truck" size={15} className="text-[#9A9EA6]" /> {o.repName}</h3>
                    <p className="text-xs text-[#9A9EA6] flex items-center gap-1 mt-0.5"><Icon name="MapPin" size={12} /> {o.area}</p>
                  </div>
                  <span className="font-bold text-lg text-sky-400 tabular-nums">{o.price}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${pay.color}22`, color: pay.color }}>{pay.label}</span>
                  <span className="text-xs font-bold text-amber-300">{o.employeeName} <span className="text-[#7C818C] font-normal">· {new Date(o.createdAt).toLocaleDateString("ar-EG")}</span></span>
                </div>
                {o.confirmedBy && (
                  <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1"><Icon name="CheckCircle2" size={12} /> استلم الفلوس: {o.confirmedBy}</p>
                )}

                {expanded && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-xs">
                    {o.dispatchLocation && (
                      <p className="text-[#D4D4D8]"><span className="text-[#9A9EA6]">مكان الخروج: </span>{o.dispatchLocation}</p>
                    )}
                    {o.notes && (
                      <p className="text-[#D4D4D8] bg-black/15 rounded-lg px-2.5 py-1.5">📝 {o.notes}</p>
                    )}
                    {o.paymentMethod === "split" && (
                      <p className="text-[#D4D4D8]">
                        <span className="text-[#9A9EA6]">تفاصيل الدفع: </span>
                        كاش {o.cashAmount} + تحويل {o.splitTransferMethod === "instapay" ? "انستاباي" : "فودافون كاش"} {o.transferAmount}
                      </p>
                    )}
                    <p className="text-[#D4D4D8]">
                      <span className="text-[#9A9EA6]">وقت الإنشاء: </span>
                      {new Date(o.createdAt).toLocaleString("ar-EG")}
                    </p>
                    {o.confirmedAt && (
                      <p className="text-[#D4D4D8]">
                        <span className="text-[#9A9EA6]">وقت تأكيد الدفع: </span>
                        {new Date(o.confirmedAt).toLocaleString("ar-EG")}
                      </p>
                    )}
                    {o.invoiceImage && (
                      <InvoiceThumb src={o.invoiceImage} className="w-20 h-20 rounded-lg object-cover border border-white/10" />
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <button onClick={() => setExpandedId(expanded ? null : o.id)} className="text-xs text-sky-400 font-semibold hover:underline">
                    {expanded ? "إخفاء التفاصيل" : "عرض كل التفاصيل"}
                  </button>
                  <button onClick={() => printOrderReceipt(o)} className="text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="Printer" size={13} /> طباعة</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------- Stock alerts screen (admin) ----------
// ---------- Attendance & withdrawals ----------
const ATTENDANCE_STATUS = {
  present: { label: "حضر", color: "#34D399" },
  absent: { label: "لم يحضر", color: "#FB7185" },
  half_morning: { label: "نص يوم صباحي", color: "#FBBF24" },
  half_evening: { label: "نص يوم مسائي", color: "#FBBF24" },
};

function DayEditModal({ dateStr, existing, onSave, onClose }) {
  const [status, setStatus] = useState(existing?.attendanceStatus || null);

  const save = () => {
    onSave({ attendanceStatus: status });
  };

  const dayLabel = new Date(dateStr).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Modal title={dayLabel} accent="#0EA5E9" onClose={onClose}>
      <p className="text-xs text-[#9A9EA6] mb-2">الحضور</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(ATTENDANCE_STATUS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => setStatus(status === key ? null : key)}
            className="toggle-pill rounded-xl py-2 text-xs font-bold"
            style={status === key ? { background: `${s.color}33`, color: s.color, borderColor: s.color } : {}}
          >
            {s.label}
          </button>
        ))}
      </div>
      <button onClick={save} className="btn-emerald w-full rounded-xl py-2.5 font-bold">حفظ</button>
    </Modal>
  );
}

function WithdrawalEntryModal({ onSave, onClose }) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const save = () => {
    const a = parseNum(amount);
    if (a === null || a <= 0) {
      setError("اكتب مبلغ صحيح");
      return;
    }
    onSave({ amount: a, note: note.trim() });
  };

  return (
    <Modal title="تسجيل سحب فلوس" accent="#FBBF24" onClose={onClose}>
      <p className="text-xs text-[#9A9EA6] mb-1.5">المبلغ</p>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="المبلغ" className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3 text-center" />
      <p className="text-xs text-[#9A9EA6] mb-1.5">ملاحظة (اختياري، تبقى ليك بس)</p>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: مصاريف مشوار" className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3" />
      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <button onClick={save} className="btn-emerald w-full rounded-xl py-2.5 font-bold">تسجيل</button>
    </Modal>
  );
}

// Renders a real calendar grid for whichever month is selected — correctly
// handles months of different lengths (28-31 days) and lines days up under the
// right weekday column (week starts Saturday).
function AttendanceCalendar({ employeeName, records, withdrawals, editable, onEditDay }) {
  const [monthDate, setMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDay, setSelectedDay] = useState(null);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 1) % 7;
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;

  const byDate = {};
  records.forEach((r) => {
    if (r.employeeName === employeeName && r.date.startsWith(monthPrefix)) byDate[r.date] = r;
  });

  const withdrawalTotalByDate = {};
  withdrawals.forEach((w) => {
    if (w.employeeName === employeeName && w.businessDate.startsWith(monthPrefix)) {
      withdrawalTotalByDate[w.businessDate] = (withdrawalTotalByDate[w.businessDate] || 0) + w.amount;
    }
  });

  const stats = Object.values(byDate).reduce(
    (acc, r) => {
      if (r.attendanceStatus === "present") acc.present++;
      else if (r.attendanceStatus === "absent") acc.absent++;
      else if (r.attendanceStatus === "half_morning" || r.attendanceStatus === "half_evening") acc.half++;
      return acc;
    },
    { present: 0, absent: 0, half: 0 }
  );
  const monthWithdrawalTotal = Object.values(withdrawalTotalByDate).reduce((s, v) => s + v, 0);

  const monthLabel = monthDate.toLocaleDateString("ar-EG", { month: "long", year: "numeric" });
  const weekdayLabels = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];
  const today = todayStr();

  const changeMonth = (delta) => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + delta);
    setMonthDate(d);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => changeMonth(-1)} className="icon-btn rounded-lg px-3 py-2"><Icon name="ChevronLeft" size={16} className="rotate-180" /></button>
        <span className="font-bold text-sm text-white">{monthLabel}</span>
        <button onClick={() => changeMonth(1)} className="icon-btn rounded-lg px-3 py-2"><Icon name="ChevronLeft" size={16} /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdayLabels.map((w, i) => <div key={i} className="text-center text-[10px] text-[#7C818C] font-bold">{w}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysCount }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${monthPrefix}-${String(day).padStart(2, "0")}`;
          const rec = byDate[dateStr];
          const withdrawalTotal = withdrawalTotalByDate[dateStr];
          const statusInfo = rec?.attendanceStatus ? ATTENDANCE_STATUS[rec.attendanceStatus] : null;
          const isToday = dateStr === today;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(dateStr)}
              className="aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5"
              style={{
                background: statusInfo ? `${statusInfo.color}1F` : "rgba(255,255,255,0.03)",
                border: isToday ? "1.5px solid #38BDF8" : "1px solid transparent",
              }}
            >
              <span className="text-[11px] font-bold text-white">{day}</span>
              {statusInfo && <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusInfo.color }} />}
              {withdrawalTotal ? <span className="text-[8px] text-amber-300 font-bold leading-none">{withdrawalTotal}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="price-chip text-center">
          <p className="text-[10px] text-[#9A9EA6] mb-0.5">أيام الحضور</p>
          <p className="font-bold text-emerald-400 tabular-nums">{stats.present}</p>
        </div>
        <div className="price-chip text-center">
          <p className="text-[10px] text-[#9A9EA6] mb-0.5">أيام الغياب</p>
          <p className="font-bold text-rose-400 tabular-nums">{stats.absent}</p>
        </div>
        <div className="price-chip text-center">
          <p className="text-[10px] text-[#9A9EA6] mb-0.5">إجمالي السحب</p>
          <p className="font-bold text-amber-400 tabular-nums">{monthWithdrawalTotal}</p>
        </div>
      </div>

      {selectedDay && editable && (
        <DayEditModal
          dateStr={selectedDay}
          existing={byDate[selectedDay]}
          onSave={(vals) => { onEditDay(selectedDay, vals); setSelectedDay(null); }}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {selectedDay && !editable && (
        <Modal title={new Date(selectedDay).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })} accent="#0EA5E9" onClose={() => setSelectedDay(null)}>
          <div className="space-y-2 text-sm">
            <p className="text-[#D4D4D8]">
              الحضور: <span className="font-bold" style={{ color: ATTENDANCE_STATUS[byDate[selectedDay]?.attendanceStatus]?.color }}>
                {ATTENDANCE_STATUS[byDate[selectedDay]?.attendanceStatus]?.label || "-"}
              </span>
            </p>
            <p className="text-[#D4D4D8]">
              إجمالي السحب في اليوم ده: <span className="font-bold text-amber-300">{withdrawalTotalByDate[selectedDay] || 0}</span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AttendanceScreen({ user, users, attendance, setAttendance, withdrawals, setWithdrawals, setView }) {
  const isAdmin = user.role === "admin";
  const [selectedEmployee, setSelectedEmployee] = useState(isAdmin ? null : user.name);
  const [showWithdrawal, setShowWithdrawal] = useState(false);

  const handleRefresh = async () => {
    const [freshAttendance, freshWithdrawals] = await Promise.all([attendanceStore.loadAll(), withdrawalsStore.loadAll()]);
    if (freshAttendance) setAttendance(freshAttendance);
    if (freshWithdrawals) setWithdrawals(freshWithdrawals);
    return !!freshAttendance && !!freshWithdrawals;
  };

  const saveDay = (employeeName, dateStr, vals) => {
    const existing = attendance.find((r) => r.employeeName === employeeName && r.date === dateStr);
    const record = {
      id: existing ? existing.id : uid(),
      employeeName,
      date: dateStr,
      attendanceStatus: vals.attendanceStatus,
      createdAt: existing ? existing.createdAt : Date.now(),
      updatedAt: Date.now(),
    };
    setAttendance(existing ? attendance.map((r) => (r.id === existing.id ? record : r)) : [...attendance, record]);
    attendanceStore.upsert(record);
  };

  const saveWithdrawal = (vals) => {
    const now = Date.now();
    const record = {
      id: uid(),
      employeeName: user.name,
      businessDate: businessDayOf(now),
      amount: vals.amount,
      note: vals.note,
      createdAt: now,
    };
    setWithdrawals([...withdrawals, record]);
    withdrawalsStore.upsert(record);
    setShowWithdrawal(false);
  };

  if (isAdmin && !selectedEmployee) {
    const employeeList = users.filter((u) => u.role === "employee" && u.status === "approved");
    return (
      <div className="shop-root">
        <PullToRefresh onRefresh={handleRefresh} />
        <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="الحضور والسحب" />
        <div className="max-w-lg mx-auto px-4 py-2 fade-up space-y-3 pb-6">
          {employeeList.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">لا يوجد موظفين معتمدين بعد</p>}
          {employeeList.map((u) => (
            <button key={u.id} onClick={() => setSelectedEmployee(u.name)} className="panel rounded-2xl p-4 w-full text-right flex items-center justify-between">
              <span className="font-bold text-white text-sm">{u.name}</span>
              <Icon name="ChevronLeft" size={16} className="text-[#9A9EA6] rotate-180" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const myWithdrawals = !isAdmin
    ? withdrawals.filter((w) => w.employeeName === user.name).sort((a, b) => b.createdAt - a.createdAt).slice(0, 40)
    : [];

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={handleRefresh} />
      <Header
        user={user}
        onLogout={() => setView("logout")}
        onBack={() => (isAdmin ? setSelectedEmployee(null) : setView("menu"))}
        title={isAdmin ? selectedEmployee : "الحضور والسحب"}
      />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up pb-6">
        <AttendanceCalendar
          employeeName={selectedEmployee}
          records={attendance}
          withdrawals={withdrawals}
          editable={!isAdmin}
          onEditDay={(dateStr, vals) => saveDay(selectedEmployee, dateStr, vals)}
        />

        {!isAdmin && (
          <>
            <button onClick={() => setShowWithdrawal(true)} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mt-2 mb-5">
              <Icon name="Wallet" size={17} /> تسجيل سحب فلوس
            </button>

            <h3 className="font-bold text-sm text-white mb-2">سحوباتي</h3>
            {myWithdrawals.length === 0 && <p className="text-center text-[#6B7078] py-4 text-xs">لسه ما سجلتش أي سحب</p>}
            <div className="space-y-2">
              {myWithdrawals.map((w) => (
                <div key={w.id} className="panel rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#9A9EA6]">{new Date(w.createdAt).toLocaleString("ar-EG")}</p>
                    {w.note && <p className="text-xs text-[#D4D4D8] mt-0.5">{w.note}</p>}
                  </div>
                  <span className="font-bold text-amber-300 tabular-nums">{w.amount}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {showWithdrawal && <WithdrawalEntryModal onSave={saveWithdrawal} onClose={() => setShowWithdrawal(false)} />}
      </div>
    </div>
  );
}

function StockAlertsScreen({ user, stockAlerts, setStockAlerts, setView }) {
  const [branchFilter, setBranchFilter] = useState("all");
  const unresolved = stockAlerts
    .filter((a) => !a.resolved)
    .filter((a) => {
      if (branchFilter === "all") return true;
      if (branchFilter === "missing") return a.type === "missingProduct";
      return a.branch === branchFilter;
    })
    .sort((a, b) => b.reportedAt - a.reportedAt);
  const resolved = stockAlerts.filter((a) => a.resolved).sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0));
  const [showResolved, setShowResolved] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    const fresh = await stockAlertsStore.loadAll();
    if (fresh) setStockAlerts(fresh);
    return !!fresh;
  };

  const resolve = (alert) => {
    const updated = { ...alert, resolved: true, resolvedAt: Date.now() };
    setStockAlerts(stockAlerts.map((a) => (a.id === alert.id ? updated : a)));
    stockAlertsStore.upsert(updated);
  };

  const AlertCard = ({ a }) => (
    <div className="panel p-4 rounded-2xl">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1.5"
            style={{ background: a.type === "outOfStock" ? "#F59E0B22" : "#A855F722", color: a.type === "outOfStock" ? "#F59E0B" : "#C084FC" }}
          >
            {a.type === "outOfStock" ? "منتج خلص" : "طلب منتج غير موجود"}
          </span>
          <h3 className="font-bold text-sm text-white">{a.productName}</h3>
          {a.branch && <p className="text-xs text-[#9A9EA6] flex items-center gap-1 mt-0.5"><Icon name="MapPin" size={12} /> فرع {a.branch}</p>}
        </div>
        {!a.resolved && (
          <button onClick={() => resolve(a)} className="text-xs btn-emerald px-3 py-1.5 rounded-lg font-semibold shrink-0 flex items-center gap-1">
            <Icon name="CheckCircle2" size={13} /> تم الحل
          </button>
        )}
      </div>
      <p className="text-xs font-bold text-amber-300">
        {a.reportedBy} <span className="text-[#7C818C] font-normal">· {new Date(a.reportedAt).toLocaleString("ar-EG")}</span>
      </p>
    </div>
  );

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={handleRefresh} />
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="تنبيهات المخزون" />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {[
            { key: "all", label: "الكل" },
            { key: "السنانية", label: "السنانية" },
            { key: "المطري", label: "المطري" },
            { key: "missing", label: "منتجات مطلوبة" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setBranchFilter(tab.key)}
              className={`toggle-pill rounded-full px-3 py-1.5 text-xs font-bold shrink-0 ${branchFilter === tab.key ? "active-sky" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 pb-4">
          {unresolved.length === 0 && <p className="text-center text-[#6B7078] py-8 text-sm">مفيش تنبيهات جديدة</p>}
          {unresolved.map((a) => <AlertCard key={a.id} a={a} />)}
        </div>

        {resolved.length > 0 && (
          <>
            <button onClick={() => setShowResolved((v) => !v)} className="text-xs text-sky-400 font-semibold mb-3 hover:underline">
              {showResolved ? "إخفاء المُتم حلها" : `عرض المُتم حلها (${resolved.length})`}
            </button>
            {showResolved && (
              <div className="space-y-3 pb-6 opacity-60">
                {resolved.map((a) => <AlertCard key={a.id} a={a} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------- Admin screen ----------
function AdminScreen({ user, users, setUsers, setView }) {
  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved" && u.role !== "admin");
  const [justActed, setJustActed] = useState(null);

  const decide = (u, status) => {
    const updated = { ...u, status };
    setUsers(users.map((x) => (x.id === u.id ? updated : x)));
    usersStore.upsert(updated);
    setJustActed(u.id);
    setTimeout(() => setJustActed(null), 500);
  };

  const togglePermission = (u, key) => {
    const updated = { ...u, permissions: { ...u.permissions, [key]: !u.permissions?.[key] } };
    setUsers(users.map((x) => (x.id === u.id ? updated : x)));
    usersStore.upsert(updated);
  };

  const removeUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
    usersStore.remove(id);
  };

  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState("");
  const [restoreDone, setRestoreDone] = useState(false);
  const restoreFileRef = React.useRef(null);

  const downloadBackup = async () => {
    setBackingUp(true);
    const data = {};
    for (const [name, store] of Object.entries(STORE_BY_COLLECTION)) {
      data[name] = (await store.loadAll()) || [];
    }
    const payload = { exportedAt: Date.now(), app: "العوادلي", data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `alawadly-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBackingUp(false);
  };

  const restoreBackup = async (file) => {
    setRestoreDone(false);
    setRestoring(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const data = parsed.data || parsed;
      const collectionNames = Object.keys(data).filter((k) => STORE_BY_COLLECTION[k]);
      let done = 0;
      const total = collectionNames.reduce((s, k) => s + (data[k]?.length || 0), 0);
      for (const name of collectionNames) {
        const store = STORE_BY_COLLECTION[name];
        for (const item of data[name] || []) {
          await store.upsert(item);
          done++;
          setRestoreProgress(`${done}/${total}`);
        }
      }
      setRestoreDone(true);
    } catch (e) {
      setRestoreProgress("ملف غير صالح — تأكد إنه نفس ملف النسخة الاحتياطية اللي نزّلته من هنا");
    }
    setRestoring(false);
  };

  return (
    <div className="shop-root">
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="إدارة المستخدمين" />
      <div className="max-w-lg mx-auto px-4 py-4 fade-up space-y-6">
        <section>
          <h2 className="font-bold text-sm text-sky-400 mb-3">طلبات قيد الانتظار ({pending.length})</h2>
          {pending.length === 0 && <p className="text-sm text-[#6B7078]">لا توجد طلبات جديدة</p>}
          <div className="space-y-3">
            {pending.map((u) => (
              <div key={u.id} className="panel rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{u.name}</div>
                  <div className="text-xs text-[#6B7078]">طلب انضمام جديد</div>
                </div>
                <div className={`flex gap-2 ${justActed === u.id ? "stamp-anim" : ""}`}>
                  <button onClick={() => decide(u, "approved")} className="btn-emerald rounded-lg p-2"><Icon name="CheckCircle2" size={17} /></button>
                  <button onClick={() => decide(u, "rejected")} className="btn-rose rounded-lg p-2"><Icon name="XCircle" size={17} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-sm text-sky-400 mb-3">المستخدمون المعتمدون ({approved.length})</h2>
          {approved.length === 0 && <p className="text-sm text-[#6B7078]">لا يوجد مستخدمين بعد</p>}
          <div className="space-y-3">
            {approved.map((u) => (
              <div key={u.id} className="panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm flex items-center gap-2 text-white">{u.name} <StatusStamp status={u.status} /></div>
                  <button onClick={() => removeUser(u.id)} className="text-rose-400 hover:text-rose-300"><Icon name="Trash2" size={16} /></button>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                    <input type="checkbox" checked={!!u.permissions?.manageProducts} onChange={() => togglePermission(u, "manageProducts")} />
                    صلاحية إضافة المنتجات
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                    <input type="checkbox" checked={!!u.permissions?.deleteProducts} onChange={() => togglePermission(u, "deleteProducts")} />
                    صلاحية حذف المنتجات
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#D4D4D8]">
                    <input type="checkbox" checked={!!u.permissions?.editPrices} onChange={() => togglePermission(u, "editPrices")} />
                    صلاحية تعديل الأسعار
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-sm text-sky-400 mb-3">النسخ الاحتياطي</h2>
          <div className="panel rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-xs text-[#D4D4D8] mb-2">تحميل نسخة من كل بيانات التطبيق (منتجات، أوردرات، تحويلات، مستخدمين...) في ملف واحد تقدر تحتفظ بيه.</p>
              <button onClick={downloadBackup} disabled={backingUp} className="btn-emerald w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
                {backingUp ? <><Icon name="Loader2" size={16} className="animate-spin" /> بيجهّز الملف...</> : "تحميل نسخة احتياطية"}
              </button>
            </div>

            <div className="pt-3 border-t border-white/5">
              <p className="text-xs text-[#D4D4D8] mb-2">استعادة البيانات من ملف نسخة احتياطية سابق. البيانات الحالية <span className="font-bold text-amber-300">مش هتتمسح</span> — الملف هيدمج بياناته مع الموجود.</p>
              {restoring ? (
                <p className="text-xs text-sky-400 flex items-center gap-1.5"><Icon name="Loader2" size={14} className="animate-spin" /> بيستعيد... {restoreProgress}</p>
              ) : restoreDone ? (
                <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><Icon name="CheckCircle2" size={14} /> تمت الاستعادة بنجاح</p>
              ) : (
                <>
                  <button onClick={() => restoreFileRef.current && restoreFileRef.current.click()} className="btn-ghost w-full rounded-xl py-2.5 text-sm font-bold">
                    اختيار ملف نسخة احتياطية
                  </button>
                  {restoreProgress && !restoring && <p className="text-xs text-rose-400 mt-2">{restoreProgress}</p>}
                </>
              )}
              <input
                ref={restoreFileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) restoreBackup(e.target.files[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------- Root App ----------
function App() {
  const [booting, setBooting] = useState(true);
  const [users, setUsers] = useState([DEFAULT_ADMIN]);
  const [products, setProducts] = useState([]);
  const [changedToday, setChangedToday] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("pending");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [lastSeen, setLastSeen] = useState({ prices: 0, reports: 0 });
  const [reminder, setReminder] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const remindedDateRef = React.useRef(null);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      setSyncError(e.detail);
      setTimeout(() => setSyncError(null), 10000);
    };
    window.addEventListener("store-error", handler);
    return () => window.removeEventListener("store-error", handler);
  }, []);

  const requestNotifPermission = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
    } catch {
      // some embedded webviews reject this silently
    }
  };

  useEffect(() => {
    (async () => {
      const storedUsers = await usersStore.loadAll();
      let u = storedUsers || [];
      if (!u.some((x) => x.role === "admin")) {
        u = [...u, DEFAULT_ADMIN];
        usersStore.upsert(DEFAULT_ADMIN);
      }
      setUsers(u);

      // Products carry each item's photo and can get large as the catalog grows,
      // so they're NOT fetched here — only when the Prices screen is opened (see nav()).
      setChangedToday((await changesStore.loadAll()) || []);
      setOrders((await ordersStore.loadAll()) || []);
      setCategories((await categoriesStore.loadAll()) || []);
      setTransfers((await transfersStore.loadAll()) || []);
      setStockAlerts((await stockAlertsStore.loadAll()) || []);
      setAttendance((await attendanceStore.loadAll()) || []);
      setWithdrawals((await withdrawalsStore.loadAll()) || []);

      // Restore session — works once this is a real web page or the APK.
      // Claude's artifact preview sandbox blocks localStorage, so this won't
      // auto-login while testing here, but will once deployed for real.
      const sessionId = loadSessionUserId();
      if (sessionId) {
        const found = u.find((x) => x.id === sessionId && x.status === "approved");
        if (found) {
          setCurrentUser(found);
          setLastSeen({ prices: Date.now(), reports: Date.now() });
          setScreen("menu");
        }
      }

      setBooting(false);
      syncOfflineQueue();
    })();
  }, []);

  // Retry queued offline writes whenever the connection comes back, and
  // periodically in case the "online" event doesn't fire reliably on the device.
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  useEffect(() => {
    const updateCount = () => setPendingSyncCount(getOfflineQueue().length);
    updateCount();
    const onQueueChange = (e) => setPendingSyncCount(e.detail);
    const onOnline = () => syncOfflineQueue();
    window.addEventListener("offline-queue-change", onQueueChange);
    window.addEventListener("online", onOnline);
    const interval = setInterval(syncOfflineQueue, 30000);
    return () => {
      window.removeEventListener("offline-queue-change", onQueueChange);
      window.removeEventListener("online", onOnline);
      clearInterval(interval);
    };
  }, []);


  useEffect(() => {
    const check = () => {
      if (!currentUser) return;
      const now = new Date();
      const todayKey = now.toDateString();
      const pastCutoff = now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 30);
      if (!pastCutoff || remindedDateRef.current === todayKey) return;
      const mine = orders.filter((o) => !o.paid && o.employeeName === currentUser.name);
      if (mine.length > 0) {
        setReminder(mine);
        remindedDateRef.current = todayKey;
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try { new Notification("العوادلي", { body: `عندك ${mine.length} أوردر لسه مدفوعش` }); } catch {}
        }
      }
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [currentUser, orders]);

  const handleLogin = (name, password) => {
    setAuthError("");
    if (!name || !password) {
      setAuthError("من فضلك اكتب الاسم وكلمة المرور");
      return;
    }
    setAuthLoading(true);
    const found = users.find((u) => namesMatch(u.name, name));
    setAuthLoading(false);
    if (!found || found.password !== password) {
      setAuthError("الاسم أو كلمة المرور غلط");
      return;
    }
    if (found.status !== "approved") {
      setPendingStatus(found.status);
      setScreen("pending");
      return;
    }
    setCurrentUser(found);
    saveSession(found);
    setLastSeen({ prices: Date.now(), reports: Date.now() });
    setScreen("menu");
  };

  const handleRegister = (name, password, confirm) => {
    setAuthError("");
    if (!name || !password) {
      setAuthError("من فضلك املأ كل الحقول");
      return;
    }
    if (password !== confirm) {
      setAuthError("كلمة المرور غير متطابقة");
      return;
    }
    if (users.some((u) => namesMatch(u.name, name))) {
      setAuthError("الاسم ده مستخدم قبل كده");
      return;
    }
    setAuthLoading(true);
    const newUser = { id: uid(), name, password, role: "employee", status: "pending", permissions: { manageProducts: false, deleteProducts: false, editPrices: false } };
    setUsers([...users, newUser]);
    usersStore.upsert(newUser);
    setAuthLoading(false);
    setPendingStatus("pending");
    setScreen("pending");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthError("");
    clearSession();
    setScreen("login");
  };

  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const ensureProductsLoaded = async () => {
    if (productsLoaded) return;
    setProductsLoading(true);
    const data = await productsStore.loadAll();
    if (data) {
      setProducts(data);
      setProductsLoaded(true);
    }
    setProductsLoading(false);
  };

  // Wipes every product/order/transfer/category/change record — used to clear out
  // test data. User accounts (admin + employees) are deliberately left untouched.
  const performFullReset = async () => {
    const targets = [productsStore, productImagesStore, ordersStore, transfersStore, categoriesStore, changesStore, stockAlertsStore];
    for (const store of targets) {
      const items = await store.loadAll();
      if (items && items.length) {
        for (const item of items) {
          await store.remove(item.id);
        }
      }
    }
    setProducts([]);
    setProductsLoaded(false);
    setOrders([]);
    setTransfers([]);
    setCategories([]);
    setChangedToday([]);
    setStockAlerts([]);
  };

  const nav = (v) => {
    if (v === "logout") {
      handleLogout();
      return;
    }
    if (v === "prices" || v === "reports") setLastSeen((prev) => ({ ...prev, [v]: Date.now() }));
    if (v === "prices") ensureProductsLoaded();
    if (v === "stock-alerts") stockAlertsStore.loadAll().then((data) => { if (data) setStockAlerts(data); });
    setScreen(v);
  };

  const hasNew = {
    prices: products.some((p) => (p.updatedAt || p.createdAt || 0) > lastSeen.prices),
    reports: orders.some((o) => o.paid && (o.confirmedAt || o.createdAt) > lastSeen.reports),
    ordersPending: orders.some((o) => !o.paid),
    "stock-alerts": stockAlerts.some((a) => !a.resolved),
  };

  if (booting) {
    return (
      <div className="shop-root flex items-center justify-center">
        <Icon name="Loader2" className="animate-spin text-sky-400" size={28} />
      </div>
    );
  }

  return (
    <div className="shop-root">
      {pendingSyncCount > 0 && (
        <div className="fixed top-3 inset-x-3 z-[65] bg-amber-950/90 border border-amber-700 rounded-2xl p-3 modal-pop max-w-md mx-auto text-center">
          <p className="text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5">
            📴 عندك {pendingSyncCount} {pendingSyncCount === 1 ? "تعديل" : "تعديلات"} محفوظة على جهازك، هتتزامن أول ما النت يرجع
          </p>
        </div>
      )}
      {syncError && (
        <div className="fixed bottom-3 inset-x-3 z-[70] bg-rose-950/90 border border-rose-800 rounded-2xl p-3 modal-pop max-w-md mx-auto text-center">
          <p className="text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5">
            <Icon name="AlertCircle" size={14} /> تعذر الاتصال بقاعدة البيانات — {syncError.collectionName}
          </p>
          {syncError.detail && <p className="text-rose-400/80 text-[10px] mt-1 break-words">{syncError.detail}</p>}
        </div>
      )}
      {reminder && currentUser && (
        <div className="fixed top-3 inset-x-3 z-[60] panel rounded-2xl p-4 modal-pop max-w-md mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-amber-400 text-sm flex items-center gap-1.5"><Icon name="AlertCircle" size={14} /> عندك {reminder.length} أوردر لسه مدفوعش</p>
              <p className="text-xs text-[#9A9EA6] mt-1">افتح "الطلبات" وأكد الدفع لما تستلم الفلوس.</p>
              <button onClick={() => { setReminder(null); nav("orders"); }} className="text-xs text-sky-400 font-semibold mt-2 hover:underline">روح للطلبات دلوقتي</button>
            </div>
            <button onClick={() => setReminder(null)} className="text-[#9A9EA6] hover:text-white shrink-0"><Icon name="X" size={16} /></button>
          </div>
        </div>
      )}
      {showProfile && currentUser && (
        <ProfileModal user={currentUser} users={users} setUsers={setUsers} onClose={() => setShowProfile(false)} onUpdated={(updated) => setCurrentUser(updated)} />
      )}
      {screen === "login" && (
        <LoginScreen onLogin={handleLogin} goRegister={() => { setAuthError(""); setScreen("register"); }} error={authError} loading={authLoading} />
      )}
      {screen === "register" && (
        <RegisterScreen onRegister={handleRegister} goLogin={() => { setAuthError(""); setScreen("login"); }} error={authError} loading={authLoading} />
      )}
      {screen === "pending" && <PendingScreen status={pendingStatus} goLogin={() => setScreen("login")} />}
      {screen === "menu" && currentUser && (
        <MainMenu user={currentUser} setView={nav} onLogout={handleLogout} hasNew={hasNew} onOpenProfile={() => setShowProfile(true)} onDevReset={performFullReset} />
      )}
      {screen === "prices" && currentUser && (
        <PricesScreen
          user={currentUser}
          products={products}
          setProducts={setProducts}
          productsLoading={productsLoading}
          changedToday={changedToday}
          setChangedToday={setChangedToday}
          categories={categories}
          setCategories={setCategories}
          setView={nav}
        />
      )}
      {screen === "orders" && currentUser && <OrdersScreen user={currentUser} orders={orders} setOrders={setOrders} setView={nav} />}
      {screen === "transfers" && currentUser && <TransfersScreen user={currentUser} transfers={transfers} setTransfers={setTransfers} setView={nav} />}
      {screen === "reports" && currentUser && currentUser.role === "admin" && <ReportsScreen user={currentUser} orders={orders} setView={nav} />}
      {screen === "stock-alerts" && currentUser && currentUser.role === "admin" && <StockAlertsScreen user={currentUser} stockAlerts={stockAlerts} setStockAlerts={setStockAlerts} setView={nav} />}
      {screen === "attendance" && currentUser && <AttendanceScreen user={currentUser} users={users} attendance={attendance} setAttendance={setAttendance} withdrawals={withdrawals} setWithdrawals={setWithdrawals} setView={nav} />}
      {screen === "admin" && currentUser && currentUser.role === "admin" && <AdminScreen user={currentUser} users={users} setUsers={setUsers} setView={nav} />}
    </div>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);
