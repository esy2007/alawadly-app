const { useState, useEffect } = React;
const ICON_SVGS = {
  "Store": `<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 20v-6h6v6"/>`,
  "User": `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`,
  "Lock": `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
  "Users": `<circle cx="9" cy="8" r="3.5"/><path d="M2.5 21c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 8.5a3 3 0 1 0 0-6"/><path d="M18.5 15c2 .5 3.5 2.3 3.5 6"/>`,
  "Package": `<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>`,
  "BarChart3": `<path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-7"/>`,
  "LogOut": `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>`,
  "Plus": `<path d="M12 5v14"/><path d="M5 12h14"/>`,
  "Trash2": `<path d="M4 7h16"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>`,
  "Pencil": `<path d="M14.5 4.5l5 5L8 21H3v-5z"/>`,
  "CheckCircle2": `<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5"/>`,
  "XCircle": `<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6"/><path d="M15 9l-6 6"/>`,
  "Clock": `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`,
  "ChevronLeft": `<path d="M15 6l-6 6 6 6"/>`,
  "AlertCircle": `<circle cx="12" cy="12" r="9"/><path d="M12 7.5v6"/><path d="M12 16.5h.01"/>`,
  "KeyRound": `<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L20 3"/><path d="M17 6l3 3"/><path d="M14 9l2.5 2.5"/>`,
  "Check": `<path d="M4 12l5 5L20 6"/>`,
  "X": `<path d="M6 6l12 12"/><path d="M18 6L6 18"/>`,
  "Loader2": `<path d="M12 3a9 9 0 1 0 9 9"/>`,
  "Search": `<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/>`,
  "Camera": `<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>`,
  "MessageCircle": `<path d="M4 12a8 8 0 1 1 3.5 6.6L4 20l1.2-3.6A7.96 7.96 0 0 1 4 12z"/>`,
  "Truck": `<rect x="1" y="8" width="13" height="8"/><path d="M14 11h4l3 3v2h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>`,
  "MapPin": `<path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/>`,
  "Banknote": `<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9v.01"/><path d="M18 15v.01"/>`,
  "Smartphone": `<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>`,
  "RotateCcw": `<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>`,
  "Wallet": `<path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H6a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14" r="1.2"/>`,
  "RefreshCw": `<path d="M21 12a9 9 0 0 0-15.5-6.3L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 15.5 6.3L21 16"/><path d="M21 21v-5h-5"/>`,
  "Bell": `<path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z"/><path d="M10 19a2 2 0 0 0 4 0"/>`,
  "Settings": `<circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M4.2 4.2l2.1 2.1"/><path d="M17.7 17.7l2.1 2.1"/><path d="M2 12h3"/><path d="M19 12h3"/><path d="M4.2 19.8l2.1-2.1"/><path d="M17.7 6.3l2.1-2.1"/>`,
  "Send": `<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>`,
  "Tag": `<path d="M20.6 12.6L12.6 20.6a2 2 0 0 1-2.8 0l-7.4-7.4a2 2 0 0 1-.6-1.4V4a1 1 0 0 1 1-1h7.8a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>`,
  "ScanLine": `<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M3 12h18"/>`,
  "Printer": `<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 14h12v7H6z"/>`,
  "Menu": `<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>`,
  "ChevronDown": `<path d="M6 9l6 6 6-6"/>`,
  "Receipt": `<path d="M4 2v20l2.5-1.5L9 22l2.5-1.5L14 22l2.5-1.5L19 22V2l-2.5 1.5L14 2l-2.5 1.5L9 2 6.5 3.5z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/>`
};
function Icon({ name, size = 18, className = "", style = {} }) {
  const inner = ICON_SVGS[name] || '<circle cx="12" cy="12" r="9"/>';
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      className,
      style: { display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style },
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      dangerouslySetInnerHTML: { __html: inner }
    }
  );
}
const FIREBASE_PROJECT_ID = "alawadly-53e7d";
const FIREBASE_API_KEY = "AIzaSyAp8Hbi1AmSovP3lxZ6PkMI2C2KgYdSEEo";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
let authState = { idToken: null, refreshToken: null, expiresAt: 0 };
let authPromise = null;
async function readErrorDetail(res) {
  try {
    const data = await res.json();
    const errObj = Array.isArray(data) ? data[0]?.error : data?.error;
    const msg = errObj?.message || data?.error_description || JSON.stringify(data).slice(0, 500);
    return `${res.status} ${msg}`;
  } catch {
    return `${res.status} ${res.statusText || ""}`.trim();
  }
}
const ERROR_LOCATIONS = {
  "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 (Auth)": "01",
  users_col: "02",
  products_col: "03",
  product_images_col: "04",
  categories_col: "05",
  meta_col: "06",
  changes_col: "07",
  orders_col: "08",
  transfers_col: "09",
  stock_alerts_col: "10",
  attendance_col: "11",
  withdrawals_col: "12",
  sales_col: "13",
  notifications_col: "14",
  settings_col: "15",
  returns_col: "16"
};
function classifyErrorType(detail) {
  const m = /^(\d{3})\s([\s\S]*)$/.exec(detail || "");
  if (!m) return "1";
  const status = m[1];
  const rest = m[2];
  if (status === "403") return "3";
  if (status === "429") return "4";
  if (status === "401") return "5";
  if (status === "400" && /requires an index/i.test(rest)) return "2";
  return "9";
}
function notifyStoreError(collectionName, detail) {
  const loc = ERROR_LOCATIONS[collectionName] || "00";
  const type = classifyErrorType(detail);
  const code = `${loc}-${type}`;
  console.error(`[${code}] ${collectionName}:`, detail);
  try {
    window.dispatchEvent(new CustomEvent("store-error", { detail: { collectionName, code, detail } }));
  } catch {
  }
}
function simpleHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
function authEmailForName(name) {
  const norm = normalizeArabic(name).trim().toLowerCase();
  return `u${simpleHash(norm)}@${FIREBASE_PROJECT_ID}.firebaseapp.com`;
}
async function signInWithEmailPassword(email, password) {
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    if (!res.ok) return { ok: false, status: res.status, detail: await readErrorDetail(res) };
    const data = await res.json();
    return { ok: true, data };
  } catch (e) {
    return { ok: false, networkError: true, detail: e.message };
  }
}
async function signUpWithEmailPassword(email, password) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true })
  });
  if (!res.ok) return { ok: false, status: res.status, detail: await readErrorDetail(res) };
  const data = await res.json();
  return { ok: true, data };
}
async function updateOwnPassword(newPassword) {
  const token = await ensureAuth();
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token, password: newPassword, returnSecureToken: true })
  });
  if (!res.ok) return { ok: false, detail: await readErrorDetail(res) };
  const data = await res.json();
  setAuthTokens(data);
  return { ok: true };
}
function setAuthTokens(data) {
  authState = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + Number(data.expiresIn) * 1e3
  };
  try {
    localStorage.setItem(SESSION_REFRESH_KEY, authState.refreshToken);
  } catch {
  }
}
function clearAuthTokens() {
  authState = { idToken: null, refreshToken: null, expiresAt: 0 };
  try {
    localStorage.removeItem(SESSION_REFRESH_KEY);
  } catch {
  }
}
function restoreRefreshToken(token) {
  authState = { idToken: null, refreshToken: token, expiresAt: 0 };
}
async function doAuth() {
  if (!authState.refreshToken) {
    throw new Error("not signed in");
  }
  let res;
  try {
    res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=refresh_token&refresh_token=${authState.refreshToken}`
    });
  } catch (e) {
    const netErr = new Error(`auth network error: ${e.message}`);
    netErr.isNetworkError = true;
    throw netErr;
  }
  if (!res.ok) {
    clearAuthTokens();
    const detail = await readErrorDetail(res);
    notifyStoreError("\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 (Auth)", detail);
    throw new Error(`auth failed: ${detail}`);
  }
  const data = await res.json();
  authState = {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + Number(data.expires_in) * 1e3
  };
  try {
    localStorage.setItem(SESSION_REFRESH_KEY, authState.refreshToken);
  } catch {
  }
  return authState.idToken;
}
async function ensureAuth() {
  if (authState.idToken && Date.now() < authState.expiresAt - 6e4) {
    return authState.idToken;
  }
  if (!authPromise) {
    authPromise = doAuth().finally(() => {
      authPromise = null;
    });
  }
  return authPromise;
}
function toFirestoreValue(v) {
  if (v === null || v === void 0) return { nullValue: null };
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
    if (v === void 0) return;
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
  Object.entries(fields || {}).forEach(([k, v]) => {
    obj[k] = fromFirestoreValue(v);
  });
  return obj;
}
const OFFLINE_QUEUE_KEY = "alawadly_offline_queue_v1";
function getOfflineQueue() {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}
function setOfflineQueueRaw(q) {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(q));
  } catch {
  }
}
function notifyQueueChange() {
  try {
    window.dispatchEvent(new CustomEvent("offline-queue-change", { detail: getOfflineQueue().length }));
  } catch {
  }
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
          body: JSON.stringify({ fields: toFirestoreFields(obj) })
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
    }
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
const salesStore = makeCollectionStore("sales_col");
function firestoreFieldFilter(field, op, value) {
  return { fieldFilter: { field: { fieldPath: field }, op, value: toFirestoreValue(value) } };
}
async function querySales(filters, limit, orderByField = "createdAt") {
  try {
    const token = await ensureAuth();
    const body = {
      structuredQuery: {
        from: [{ collectionId: "sales_col" }],
        where: filters.length === 1 ? filters[0] : { compositeFilter: { op: "AND", filters } },
        limit: limit || 1e3
      }
    };
    if (orderByField) body.structuredQuery.orderBy = [{ field: { fieldPath: orderByField }, direction: "ASCENDING" }];
    const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      notifyStoreError("sales_col", await readErrorDetail(res));
      return null;
    }
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter((r) => r.document).map((r) => fromFirestoreFields(r.document.fields));
  } catch (e) {
    console.error("querySales failed", e);
    notifyStoreError("sales_col", e.message);
    return null;
  }
}
async function fetchSalesInRange(startTs, endTs) {
  return querySales(
    [
      firestoreFieldFilter("createdAt", "GREATER_THAN_OR_EQUAL", startTs),
      firestoreFieldFilter("createdAt", "LESS_THAN_OR_EQUAL", endTs)
    ],
    2e3
  );
}
async function fetchOpenDeliveryOrders() {
  const dayAgo = Date.now() - 24 * 60 * 60 * 1e3;
  const notDone = await querySales(
    [
      firestoreFieldFilter("fulfillment", "EQUAL", "delivery"),
      firestoreFieldFilter("deliveryStatus", "IN", ["prepared", "sent"])
    ],
    null,
    null
    // no orderBy — see querySales's 3rd param; keeps the index simple (fulfillment, deliveryStatus)
  );
  if (notDone === null) return null;
  const recentlyDone = await querySales(
    [
      firestoreFieldFilter("fulfillment", "EQUAL", "delivery"),
      firestoreFieldFilter("deliveryStatus", "EQUAL", "done"),
      firestoreFieldFilter("receivedAt", "GREATER_THAN_OR_EQUAL", dayAgo)
    ],
    null,
    null
    // same reasoning — index stays (fulfillment, deliveryStatus, receivedAt)
  );
  if (recentlyDone === null) return notDone;
  const byId = {};
  [...notDone, ...recentlyDone].forEach((s) => {
    byId[s.id] = s;
  });
  return Object.values(byId).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}
const returnsStore = makeCollectionStore("returns_col");
const returnTrackingStore = makeCollectionStore("return_tracking_col");
async function queryReturns(filters, orderByCreatedAt, limit) {
  try {
    const token = await ensureAuth();
    const body = {
      structuredQuery: {
        from: [{ collectionId: "returns_col" }],
        where: filters.length === 1 ? filters[0] : { compositeFilter: { op: "AND", filters } },
        limit: limit || 1e3
      }
    };
    if (orderByCreatedAt) body.structuredQuery.orderBy = [{ field: { fieldPath: "createdAt" }, direction: "ASCENDING" }];
    const res = await fetch(`${FIRESTORE_BASE}:runQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      notifyStoreError("returns_col", await readErrorDetail(res));
      return null;
    }
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter((r) => r.document).map((r) => fromFirestoreFields(r.document.fields));
  } catch (e) {
    console.error("queryReturns failed", e);
    notifyStoreError("returns_col", e.message);
    return null;
  }
}
async function fetchReturnsInRange(startTs, endTs) {
  return queryReturns(
    [
      firestoreFieldFilter("createdAt", "GREATER_THAN_OR_EQUAL", startTs),
      firestoreFieldFilter("createdAt", "LESS_THAN_OR_EQUAL", endTs)
    ],
    true,
    2e3
  );
}
async function fetchReturnsForSale(saleId) {
  return queryReturns([firestoreFieldFilter("originalSaleId", "EQUAL", saleId)], false, 200);
}
async function fetchReturnTracking(saleId) {
  try {
    const token = await ensureAuth();
    const res = await fetch(`${FIRESTORE_BASE}/return_tracking_col/${saleId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const doc = await res.json();
      return { items: fromFirestoreFields(doc.fields).items || {}, updateTime: doc.updateTime };
    }
    if (res.status === 404) return { items: {}, updateTime: null };
    notifyStoreError("return_tracking_col", await readErrorDetail(res));
    return null;
  } catch (e) {
    notifyStoreError("return_tracking_col", e.message);
    return null;
  }
}
async function submitReturnAtomic(sale, selectedItems, returnRecord) {
  const resourceRoot = FIRESTORE_BASE.replace("https://firestore.googleapis.com/v1/", "");
  const trackingPath = `return_tracking_col/${sale.id}`;
  for (let attempt = 0; attempt < 6; attempt++) {
    let token;
    try {
      token = await ensureAuth();
    } catch (e) {
      return { ok: false, reason: "offline" };
    }
    const tracking = await fetchReturnTracking(sale.id);
    if (tracking === null) return { ok: false, reason: "offline" };
    for (const it of selectedItems) {
      const already = tracking.items[String(it.idx)] || 0;
      const original = sale.items[it.idx].qty;
      if (already + it.returnQty > original) {
        return { ok: false, reason: "overLimit", itemName: it.productName, maxLeft: Math.max(0, original - already) };
      }
    }
    const updatedItems = { ...tracking.items };
    selectedItems.forEach((it) => {
      updatedItems[String(it.idx)] = (updatedItems[String(it.idx)] || 0) + it.returnQty;
    });
    const returnDay = businessDayOf(returnRecord.createdAt);
    const returnMonthId = returnDay.slice(0, 7);
    const returnBranch = returnRecord.branchName || returnRecord.dispatchLocation || "\u0628\u062F\u0648\u0646 \u0641\u0631\u0639";
    const returnMetricPrefix = returnRecord.fulfillment === "delivery" ? "returnsOrders" : "returnsSales";
    const body = {
      writes: [
        {
          update: {
            name: `${resourceRoot}/${trackingPath}`,
            fields: toFirestoreFields({ saleId: sale.id, items: updatedItems, updatedAt: Date.now() })
          },
          currentDocument: tracking.updateTime ? { updateTime: tracking.updateTime } : { exists: false }
        },
        {
          update: {
            name: `${resourceRoot}/returns_col/${returnRecord.id}`,
            fields: toFirestoreFields(returnRecord)
          },
          currentDocument: { exists: false }
        },
        {
          transform: {
            document: `${resourceRoot}/monthly_aggregates_col/${returnMonthId}`,
            fieldTransforms: [
              { fieldPath: firestoreFieldPath(["days", returnDay, returnBranch, `${returnMetricPrefix}Total`]), increment: toFirestoreValue(returnRecord.total) },
              { fieldPath: firestoreFieldPath(["days", returnDay, returnBranch, `${returnMetricPrefix}Count`]), increment: toFirestoreValue(1) }
            ]
          }
        }
      ]
    };
    try {
      const commitRes = await fetch(`${FIRESTORE_BASE}:commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      if (commitRes.ok) return { ok: true };
      await new Promise((r) => setTimeout(r, 80 + Math.random() * 160));
    } catch (e) {
      return { ok: false, reason: "offline" };
    }
  }
  return { ok: false, reason: "conflict" };
}
const notificationsStore = makeCollectionStore("notifications_col");
function sendNotification(forUser, message) {
  const notif = { id: uid(), forUser, message, read: false, createdAt: Date.now() };
  notificationsStore.upsert(notif);
  return notif;
}
const settingsStore = makeCollectionStore("settings_col");
const DEFAULT_TIER_SETTINGS = {
  id: "tier_settings",
  tiers: [
    { id: "retail", label: "\u0642\u0637\u0627\u0639\u064A", color: "#34D399", archived: false },
    { id: "half", label: "\u0646\u0635 \u062C\u0645\u0644\u0629", color: "#FBBF24", archived: false },
    { id: "wholesale", label: "\u062C\u0645\u0644\u0629", color: "#FB7185", archived: false }
  ],
  hideFromCustomer: true
};
function activeTiers(tierSettings) {
  return tierSettings.tiers.filter((t) => !t.archived);
}
const DEFAULT_INVOICE_NUMBER_SETTINGS = {
  id: "invoice_number_settings",
  nextNumber: 1,
  resetFrequency: "never",
  // "never" | "daily" | "monthly"
  lastResetKey: null
};
const DEFAULT_BRANCH_SETTINGS = {
  id: "branch_settings",
  branches: [
    { id: "sanania", name: "\u0627\u0644\u0633\u0646\u0627\u0646\u064A\u0629" },
    { id: "matary", name: "\u0627\u0644\u0645\u0637\u0631\u064A" }
  ]
};
function suggestUsualBranch(attendance, employeeName) {
  const recent = attendance.filter((a) => a.employeeName === employeeName && a.branchId).sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 10);
  if (!recent.length) return null;
  const counts = {};
  recent.forEach((a) => {
    counts[a.branchId] = (counts[a.branchId] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
function currentResetKey(freq) {
  const now = /* @__PURE__ */ new Date();
  if (freq === "daily") return now.toISOString().slice(0, 10);
  if (freq === "monthly") return now.toISOString().slice(0, 7);
  return null;
}
function takeNextInvoiceNumber(settings) {
  const key = currentResetKey(settings.resetFrequency);
  const needsReset = settings.resetFrequency !== "never" && key !== settings.lastResetKey;
  const number = needsReset ? 1 : settings.nextNumber;
  const updatedSettings = { ...settings, nextNumber: number + 1, lastResetKey: key };
  return { number, updatedSettings };
}
async function claimNextInvoiceNumber(fallbackSettings) {
  const docUrl = `${FIRESTORE_BASE}/settings_col/invoice_number_settings`;
  for (let attempt = 0; attempt < 6; attempt++) {
    let token;
    try {
      token = await ensureAuth();
    } catch (e) {
      break;
    }
    let settings = fallbackSettings;
    let precondition = "currentDocument.exists=false";
    try {
      const getRes = await fetch(docUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (getRes.ok) {
        const doc = await getRes.json();
        settings = { ...DEFAULT_INVOICE_NUMBER_SETTINGS, ...fromFirestoreFields(doc.fields) };
        precondition = `currentDocument.updateTime=${encodeURIComponent(doc.updateTime)}`;
      } else if (getRes.status !== 404) {
        break;
      }
    } catch (e) {
      break;
    }
    const { number, updatedSettings } = takeNextInvoiceNumber(settings);
    try {
      const patchRes = await fetch(`${docUrl}?${precondition}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fields: toFirestoreFields(updatedSettings) })
      });
      if (patchRes.ok) {
        return { number, updatedSettings };
      }
      await new Promise((r) => setTimeout(r, 80 + Math.random() * 160));
    } catch (e) {
      break;
    }
  }
  return takeNextInvoiceNumber(fallbackSettings);
}
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
  sales_col: salesStore,
  settings_col: settingsStore,
  notifications_col: notificationsStore
};
function todayStr() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function getTodayBranchName(attendance, employeeName, branches) {
  const today = todayStr();
  const rec = attendance.find((a) => a.employeeName === employeeName && a.date === today && a.branchId);
  if (!rec) return null;
  const branch = branches.find((b) => b.id === rec.branchId);
  return branch ? branch.name : null;
}
function businessDayOf(ts) {
  const d = new Date(ts);
  if (d.getHours() < 3) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function businessDayRange(daysAgo) {
  const d = /* @__PURE__ */ new Date();
  if (d.getHours() < 3) d.setDate(d.getDate() - 1);
  d.setDate(d.getDate() - daysAgo);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 3, 0, 0, 0).getTime();
  return { start, end: start + 24 * 60 * 60 * 1e3 - 1 };
}
function currentCalendarWeekRange() {
  const d = /* @__PURE__ */ new Date();
  if (d.getHours() < 3) d.setDate(d.getDate() - 1);
  const daysSinceSaturday = (d.getDay() + 1) % 7;
  const saturday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - daysSinceSaturday, 3, 0, 0, 0);
  const start = saturday.getTime();
  return { start, end: start + 7 * 24 * 60 * 60 * 1e3 - 1 };
}
function calendarMonthRange(monthId) {
  const [y, m] = (monthId || todayStr().slice(0, 7)).split("-").map(Number);
  const start = new Date(y, m - 1, 1, 3, 0, 0, 0).getTime();
  const end = new Date(y, m, 1, 3, 0, 0, 0).getTime() - 1;
  return { start, end };
}
function rangeToTimestamps(range) {
  if (range === "today") return businessDayRange(0);
  if (range === "yesterday") return businessDayRange(1);
  if (range === "week") return currentCalendarWeekRange();
  if (range === "month") return calendarMonthRange();
  if (range && /^\d{4}-\d{2}$/.test(range)) return calendarMonthRange(range);
  return { start: businessDayRange(89).start, end: businessDayRange(0).end };
}
function businessDaysInRange(startTs, endTs) {
  const days = [];
  let cursor = businessDayOf(startTs);
  let cursorTs = startTs;
  while (cursorTs <= endTs) {
    days.push(cursor);
    cursorTs += 24 * 60 * 60 * 1e3;
    cursor = businessDayOf(cursorTs);
  }
  return [...new Set(days)];
}
function firestoreFieldPath(segments) {
  return segments.map((seg) => "`" + String(seg).replace(/\\/g, "\\\\").replace(/`/g, "\\`") + "`").join(".");
}
async function incrementDailyAggregate(businessDay, branchName, metric, amount) {
  try {
    const token = await ensureAuth();
    const monthId = businessDay.slice(0, 7);
    const resourceRoot = FIRESTORE_BASE.replace("https://firestore.googleapis.com/v1/", "");
    const branch = branchName || "\u0628\u062F\u0648\u0646 \u0641\u0631\u0639";
    const path = firestoreFieldPath(["days", businessDay, branch, metric]);
    const body = {
      writes: [
        {
          transform: {
            document: `${resourceRoot}/monthly_aggregates_col/${monthId}`,
            fieldTransforms: [{ fieldPath: path, increment: toFirestoreValue(amount) }]
          }
        }
      ]
    };
    const res = await fetch(`${FIRESTORE_BASE}:commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) console.error("incrementDailyAggregate failed", businessDay, branch, metric, await res.text());
  } catch (e) {
    console.error("incrementDailyAggregate error", e);
  }
}
async function fetchMonthlyAggregate(monthId) {
  try {
    const token = await ensureAuth();
    const res = await fetch(`${FIRESTORE_BASE}/monthly_aggregates_col/${monthId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const doc = await res.json();
      return { days: fromFirestoreFields(doc.fields).days || {} };
    }
    if (res.status === 404) return { days: {} };
    notifyStoreError("monthly_aggregates_col", await readErrorDetail(res));
    return null;
  } catch (e) {
    notifyStoreError("monthly_aggregates_col", e.message);
    return null;
  }
}
async function sumDailyAggregates(businessDays, branchFilter) {
  const monthIds = [...new Set(businessDays.map((d) => d.slice(0, 7)))];
  const monthDocs = await Promise.all(monthIds.map((m) => fetchMonthlyAggregate(m)));
  if (monthDocs.some((d) => d === null)) return null;
  const byMonth = {};
  monthIds.forEach((m, i) => {
    byMonth[m] = monthDocs[i];
  });
  const totals = { salesTotal: 0, salesCount: 0, ordersTotal: 0, ordersCount: 0, returnsSalesTotal: 0, returnsSalesCount: 0, returnsOrdersTotal: 0, returnsOrdersCount: 0 };
  businessDays.forEach((day) => {
    const monthDoc = byMonth[day.slice(0, 7)];
    const dayData = monthDoc && monthDoc.days[day] || {};
    Object.entries(dayData).forEach(([branch, metrics]) => {
      if (branchFilter && branchFilter !== "all" && branch !== branchFilter) return;
      totals.salesTotal += metrics.salesTotal || 0;
      totals.salesCount += metrics.salesCount || 0;
      totals.ordersTotal += metrics.ordersTotal || 0;
      totals.ordersCount += metrics.ordersCount || 0;
      totals.returnsSalesTotal += metrics.returnsSalesTotal || 0;
      totals.returnsSalesCount += metrics.returnsSalesCount || 0;
      totals.returnsOrdersTotal += metrics.returnsOrdersTotal || 0;
      totals.returnsOrdersCount += metrics.returnsOrdersCount || 0;
    });
  });
  return totals;
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
async function batchGetImages(ids) {
  if (!ids.length) return {};
  try {
    const token = await ensureAuth();
    const resourceBase = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
    const documents = ids.map((id) => `${resourceBase}/product_images_col/${id}`);
    const res = await fetch(`https://firestore.googleapis.com/v1/${resourceBase}:batchGet`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ documents })
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
const SESSION_KEY = "alawadly_session";
const SESSION_REFRESH_KEY = "alawadly_auth_refresh";
function saveSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id }));
  } catch {
  }
}
function loadSessionUserId() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw).id : null;
  } catch {
    return null;
  }
}
function loadSavedRefreshToken() {
  try {
    return localStorage.getItem(SESSION_REFRESH_KEY);
  } catch {
    return null;
  }
}
function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
  }
  clearAuthTokens();
}
const CASHIER_INVOICES_KEY = "faaroon_cashier_invoices";
function saveCashierInvoices(invoices) {
  try {
    localStorage.setItem(CASHIER_INVOICES_KEY, JSON.stringify({ invoices }));
  } catch {
  }
}
function loadCashierInvoices() {
  try {
    const raw = localStorage.getItem(CASHIER_INVOICES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
let sharedAudioCtx = null;
function getAudioCtx() {
  if (!sharedAudioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    sharedAudioCtx = new Ctor();
  }
  if (sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}
function playBeep(type = "success") {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const now = ctx.currentTime;
    const attack = 0.012;
    if (type === "success") {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.13, now + attack);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === "error") {
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.13, now + attack);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.29);
    } else if (type === "add") {
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(990, now + 0.08);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.11, now + attack);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "remove") {
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.09, now + attack);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "scan") {
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.12, now + attack);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === "switch") {
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.06, now + attack);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    } else {
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(1e-4, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 6e-3);
      gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.045);
      osc.start(now);
      osc.stop(now + 0.05);
    }
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  } catch (e) {
  }
}
const DATA_CACHE_PREFIX = "faaroon_cache_";
function saveDataCache(key, data) {
  try {
    localStorage.setItem(DATA_CACHE_PREFIX + key, JSON.stringify(data));
  } catch {
  }
}
function loadDataCache(key) {
  try {
    const raw = localStorage.getItem(DATA_CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
async function resetProductVersions() {
  try {
    const token = await ensureAuth();
    await fetch(PRODUCTS_VERSION_URL, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  } catch (e) {
    console.error("resetProductVersions failed", e);
  }
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const IDB_NAME = "faaroon_idb";
const IDB_STORE = "cache";
function idbOpen() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("indexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(key) {
  try {
    const db = await idbOpen();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result === void 0 ? null : req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}
async function idbSet(key, value) {
  try {
    const db = await idbOpen();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    return true;
  } catch {
    return false;
  }
}
const PRODUCTS_VERSION_RESOURCE = `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/meta_col/products_version`;
const PRODUCTS_VERSION_URL = `${FIRESTORE_BASE}/meta_col/products_version`;
async function fetchProductVersions() {
  try {
    const token = await ensureAuth();
    const res = await fetch(PRODUCTS_VERSION_URL, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) return {};
    if (!res.ok) {
      notifyStoreError("meta_col", await readErrorDetail(res));
      return null;
    }
    const data = await res.json();
    const fields = fromFirestoreFields(data.fields || {});
    return fields.versions || {};
  } catch (e) {
    console.error("fetchProductVersions failed", e);
    notifyStoreError("meta_col", e.message);
    return null;
  }
}
async function bumpProductVersion(productId) {
  try {
    const token = await ensureAuth();
    const res = await fetch(`${FIRESTORE_BASE}:commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        writes: [{
          transform: {
            document: PRODUCTS_VERSION_RESOURCE,
            fieldTransforms: [{ fieldPath: `versions.${productId}`, increment: { integerValue: "1" } }]
          }
        }]
      })
    });
    if (res.ok) return;
    const token2 = await ensureAuth();
    const url = `${PRODUCTS_VERSION_URL}?updateMask.fieldPaths=${encodeURIComponent(`versions.${productId}`)}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token2}` },
      body: JSON.stringify({ fields: toFirestoreFields({ versions: { [productId]: 1 } }) })
    });
  } catch (e) {
    console.error("bumpProductVersion failed", e);
  }
}
async function dropProductVersion(productId) {
  try {
    const token = await ensureAuth();
    const url = `${PRODUCTS_VERSION_URL}?updateMask.fieldPaths=${encodeURIComponent(`versions.${productId}`)}`;
    await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields: {} })
    });
  } catch (e) {
    console.error("dropProductVersion failed", e);
  }
}
async function batchGetProducts(ids) {
  if (!ids.length) return [];
  try {
    const token = await ensureAuth();
    const documents = ids.map((id) => `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products_col/${id}`);
    const res = await fetch(`${FIRESTORE_BASE}:batchGet`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ documents })
    });
    if (!res.ok) {
      notifyStoreError("products_col", await readErrorDetail(res));
      return null;
    }
    const data = await res.json();
    return (Array.isArray(data) ? data : []).filter((r) => r.found).map((r) => fromFirestoreFields(r.found.fields));
  } catch (e) {
    console.error("batchGetProducts failed", e);
    notifyStoreError("products_col", e.message);
    return null;
  }
}
async function seedProductVersions(products) {
  try {
    const token = await ensureAuth();
    const versions = Object.fromEntries(products.map((p) => [p.id, 1]));
    await fetch(PRODUCTS_VERSION_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ fields: toFirestoreFields({ versions }) })
    });
    return versions;
  } catch (e) {
    console.error("seedProductVersions failed", e);
    return null;
  }
}
async function syncProducts(localProducts, localVersions) {
  const remoteVersions = await fetchProductVersions();
  if (!remoteVersions) return null;
  if (Object.keys(remoteVersions).length === 0) {
    const all = await productsStore.loadAll();
    if (all === null) return null;
    const seeded = all.length ? await seedProductVersions(all) : {};
    return { products: all, versions: seeded || Object.fromEntries(all.map((p) => [p.id, 1])) };
  }
  const byId = Object.fromEntries(localProducts.map((p) => [p.id, p]));
  const changedIds = Object.keys(remoteVersions).filter((id) => remoteVersions[id] !== localVersions[id]);
  const deletedIds = Object.keys(localVersions).filter((id) => !(id in remoteVersions));
  let fetched = [];
  if (changedIds.length) {
    for (let i = 0; i < changedIds.length; i += 200) {
      const chunk = await batchGetProducts(changedIds.slice(i, i + 200));
      if (chunk === null) return null;
      fetched = fetched.concat(chunk);
    }
  }
  fetched.forEach((p) => {
    byId[p.id] = p;
  });
  deletedIds.forEach((id) => {
    delete byId[id];
  });
  return { products: Object.values(byId), versions: remoteVersions };
}
function normalizeArabic(str) {
  return (str || "").toString().trim().toLowerCase().replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/[أإآا]/g, "\u0627").replace(/[ىئ]/g, "\u064A").replace(/ة/g, "\u0647").replace(/ؤ/g, "\u0648").replace(/\s+/g, " ");
}
const namesMatch = (a, b) => normalizeArabic(a) === normalizeArabic(b);
function toEnglishDigits(str) {
  const map = { "\u0660": "0", "\u0661": "1", "\u0662": "2", "\u0663": "3", "\u0664": "4", "\u0665": "5", "\u0666": "6", "\u0667": "7", "\u0668": "8", "\u0669": "9", "\u06F0": "0", "\u06F1": "1", "\u06F2": "2", "\u06F3": "3", "\u06F4": "4", "\u06F5": "5", "\u06F6": "6", "\u06F7": "7", "\u06F8": "8", "\u06F9": "9" };
  return String(str || "").replace(/[٠-٩۰-۹]/g, (d) => map[d]);
}
function validateEgyptPhone(raw) {
  const digits = toEnglishDigits(raw).replace(/[^\d]/g, "");
  if (digits.length !== 11) return "\u0631\u0642\u0645 \u0627\u0644\u062A\u0644\u064A\u0641\u0648\u0646 \u0644\u0627\u0632\u0645 \u064A\u0643\u0648\u0646 \u0661\u0661 \u0631\u0642\u0645";
  if (!/^(010|011|012|015)/.test(digits)) return "\u0631\u0642\u0645 \u0627\u0644\u062A\u0644\u064A\u0641\u0648\u0646 \u0644\u0627\u0632\u0645 \u064A\u0628\u062F\u0623 \u0628\u0640 010 \u0623\u0648 011 \u0623\u0648 012 \u0623\u0648 015";
  return null;
}
function parseNum(val) {
  if (val === void 0 || val === null || val === "") return null;
  const converted = val.toString().replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776)).replace(/,/g, ".").trim();
  const n = parseFloat(converted);
  return isNaN(n) ? null : n;
}
function validateTierPrices(prices) {
  if (prices.some((v) => v === null)) {
    return "\u0645\u0646 \u0641\u0636\u0644\u0643 \u0627\u0643\u062A\u0628 \u0623\u0631\u0642\u0627\u0645 \u0635\u062D\u064A\u062D\u0629 \u0641\u064A \u0643\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631";
  }
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
    return (/* @__PURE__ */ new Date()).toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return (/* @__PURE__ */ new Date()).toDateString();
  }
}
function buildWhatsAppMessage(changedToday, products, tiers) {
  const tierList = tiers || DEFAULT_TIER_SETTINGS.tiers;
  const entries = changedToday.map((c) => products.find((p) => p.id === c.id)).filter(Boolean);
  let msg = `\u{1F4CA} *\u062A\u0642\u0631\u064A\u0631 \u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0623\u0633\u0639\u0627\u0631 - FaAroon*
\u{1F4C5} ${formatArabicDate()}

`;
  entries.forEach((p, i) => {
    const tierText = tierList.map((t) => `${t.label}: ${tierBase(p[t.id])}`).join(" | ");
    msg += `${i + 1}. *${p.name}*
   ${tierText}

`;
  });
  msg += `---------------------------------
\u{1F4CC} \u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u0630\u0643\u0648\u0631\u0629 \u0623\u0639\u0644\u0627\u0647 \u0641\u064A \u0627\u0644\u0633\u064A\u0633\u062A\u0645.`;
  return { msg, count: entries.length };
}
function paymentLabel(o) {
  if (!o.paid) return { label: "\u062F\u0641\u0639 \u0645\u0639\u0644\u0642", color: "#FBBF24" };
  if (o.paymentMethod === "cash") return { label: "\u0643\u0627\u0634", color: "#34D399" };
  if (o.paymentMethod === "vodafone_cash") return { label: "\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634", color: "#34D399" };
  if (o.paymentMethod === "instapay") return { label: "\u0627\u0646\u0633\u062A\u0627\u0628\u0627\u064A", color: "#34D399" };
  if (o.paymentMethod === "split") {
    const via = o.splitTransferMethod === "instapay" ? "\u0627\u0646\u0633\u062A\u0627\u0628\u0627\u064A" : "\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634";
    return { label: `\u0643\u0627\u0634 ${o.cashAmount} + \u062A\u062D\u0648\u064A\u0644 ${via} ${o.transferAmount}`, color: "#FBBF24" };
  }
  return { label: "-", color: "#94A3B8" };
}
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}
function printOrderReceipt(order, onFail) {
  const pay = paymentLabel(order);
  const win = window.open("", "_blank");
  if (!win) {
    if (onFail) onFail("popup");
    return false;
  }
  const dateStr = new Date(order.createdAt).toLocaleString("ar-EG");
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>\u0641\u0627\u062A\u0648\u0631\u0629</title>
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
  <h1>FaAroon</h1>
  <p class="center muted">\u0641\u0627\u062A\u0648\u0631\u0629 \u0623\u0648\u0631\u062F\u0631</p>
  <div class="line"></div>
  <div class="row"><span>\u0627\u0644\u0645\u0646\u062F\u0648\u0628</span><span>${escapeHtml(order.repName)}</span></div>
  <div class="row"><span>\u0627\u0644\u0645\u0646\u0637\u0642\u0629</span><span>${escapeHtml(order.deliveryArea)}</span></div>
  ${order.dispatchLocation ? `<div class="row"><span>\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C</span><span>${escapeHtml(order.dispatchLocation)}</span></div>` : ""}
  <div class="line"></div>
  <div class="row total"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>${order.total}</span></div>
  <div class="row"><span>\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639</span><span>${escapeHtml(pay.label)}</span></div>
  <div class="line"></div>
  ${order.notes ? `<p class="muted">\u0645\u0644\u0627\u062D\u0638\u0627\u062A: ${escapeHtml(order.notes)}</p>` : ""}
  <p class="center muted">${dateStr}</p>
  <p class="center muted">\u0628\u0648\u0627\u0633\u0637\u0629: ${escapeHtml(order.employeeName)}</p>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => {
    try {
      win.print();
    } catch (e) {
      if (onFail) onFail("print");
    }
  }, 300);
  return true;
}
function printSaleReceipt(sale, onFail) {
  const pay = paymentLabel(sale);
  const win = window.open("", "_blank");
  if (!win) {
    if (onFail) onFail("popup");
    return false;
  }
  const dateStr = new Date(sale.createdAt).toLocaleString("ar-EG");
  const itemsHtml = sale.items.map((it) => `<div class="row"><span>${escapeHtml(it.productName)} \xD7 ${it.qty}</span><span>${it.lineTotal}</span></div>`).join("");
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>\u0641\u0627\u062A\u0648\u0631\u0629 \u0628\u064A\u0639</title>
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
  <h1>FaAroon</h1>
  <p class="center muted">\u0641\u0627\u062A\u0648\u0631\u0629 \u0643\u0627\u0634\u064A\u0631 \u0631\u0642\u0645 ${sale.invoiceNumber ?? ""}</p>
  ${sale.customerName ? `<p class="center muted">\u0627\u0644\u0632\u0628\u0648\u0646: ${escapeHtml(sale.customerName)}</p>` : ""}
  <div class="line"></div>
  ${itemsHtml}
  <div class="line"></div>
  <div class="row total"><span>\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A</span><span>${sale.total}</span></div>
  ${sale.fulfillment === "delivery" ? `
  <div class="line"></div>
  <p class="center muted" style="font-weight:bold;">\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0644\u064A\u0641\u0631\u064A</p>
  <div class="row"><span>\u0627\u0644\u0645\u0646\u0637\u0642\u0629</span><span>${escapeHtml(sale.deliveryArea || "")}</span></div>
  <div class="row"><span>\u062A\u0644\u064A\u0641\u0648\u0646 \u0627\u0644\u0632\u0628\u0648\u0646</span><span>${escapeHtml(sale.customerPhone || "")}</span></div>
  ${sale.dispatchLocation ? `<div class="row"><span>\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C</span><span>${escapeHtml(sale.dispatchLocation)}</span></div>` : ""}
  ` : `
  <div class="row"><span>\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639</span><span>${escapeHtml(pay.label)}</span></div>
  `}
  <div class="line"></div>
  <p class="center muted">${dateStr}</p>
  <p class="center muted">\u0628\u0648\u0627\u0633\u0637\u0629: ${escapeHtml(sale.employeeName)}</p>
</body>
</html>`);
  win.document.close();
  win.focus();
  setTimeout(() => {
    try {
      win.print();
    } catch (e) {
      if (onFail) onFail("print");
    }
  }, 300);
  return true;
}
function validatePaymentMethod(pm, price) {
  if (!pm.paymentMethod) return "\u0627\u062E\u062A\u0627\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639";
  if (pm.paymentMethod === "split") {
    if (!pm.splitTransferMethod) return "\u0627\u062E\u062A\u0627\u0631 \u0648\u0633\u064A\u0644\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644 (\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634 \u0623\u0648 \u0627\u0646\u0633\u062A\u0627\u0628\u0627\u064A)";
    const cash = parseNum(pm.cashAmount);
    const transfer = parseNum(pm.transferAmount);
    if (cash === null || transfer === null) return "\u0627\u0643\u062A\u0628 \u0645\u0628\u0627\u0644\u063A \u0635\u062D\u064A\u062D\u0629 \u0644\u0644\u0643\u0627\u0634 \u0648\u0627\u0644\u062A\u062D\u0648\u064A\u0644";
    if (Math.abs(cash + transfer - price) > 0.01) return "\u0645\u062C\u0645\u0648\u0639 \u0627\u0644\u0643\u0627\u0634 \u0648\u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0644\u0627\u0632\u0645 \u064A\u0633\u0627\u0648\u064A \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0643\u0644\u064A";
  }
  return null;
}
const userIsAdmin = (u) => !!u && (u.role === "admin" || u.role === "developer");
const userIsDeveloper = (u) => !!u && u.role === "developer";
function tierRows(v) {
  if (Array.isArray(v)) return v.length ? v : [{ label: "", price: 0 }];
  if (typeof v === "number") return [{ label: "", price: v }];
  return [{ label: "", price: 0 }];
}
function tierBase(v) {
  const rows = tierRows(v);
  return rows[0] && rows[0].price !== void 0 && rows[0].price !== null ? rows[0].price : 0;
}
function TextField({ label, icon: Icon2, ...props }) {
  return /* @__PURE__ */ React.createElement("label", { className: "block mb-4 text-right" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-sm font-medium text-[#94A3B8]" }, label), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("input", { ...props, className: "field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px] transition-colors" }), Icon2 && /* @__PURE__ */ React.createElement(Icon2, { size: 18, className: "absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B]" })));
}
function StatusStamp({ status }) {
  const map = {
    approved: { label: "\u0645\u0639\u062A\u0645\u062F", color: "#34D399", icon: "CheckCircle2" },
    rejected: { label: "\u0645\u0631\u0641\u0648\u0636", color: "#FB7185", icon: "XCircle" },
    pending: { label: "\u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629", color: "#FBBF24", icon: "Clock" }
  };
  const s = map[status];
  return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1 rounded-full border-2 px-3 py-1 text-xs font-bold", style: { borderColor: s.color, color: s.color, transform: "rotate(-3deg)" } }, /* @__PURE__ */ React.createElement(Icon, { name: s.icon, size: 13 }), " ", s.label);
}
function SkeletonRows({ count = 4, height = 56 }) {
  return /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, Array.from({ length: count }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "skeleton", style: { height } })));
}
function AutocompleteInput({ value, onChange, options, placeholder, className, inputClassName, minChars = 2, maxSuggestions = 5, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const normalizedValue = normalizeArabic(value || "");
  const matches = normalizedValue.length >= minChars ? options.filter((o) => normalizeArabic(o).includes(normalizedValue) && o !== value).slice(0, maxSuggestions) : [];
  const pick = (opt) => {
    onChange(opt);
    setFocused(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (matches.length > 0) {
        e.preventDefault();
        pick(matches[Math.min(highlightIndex, matches.length - 1)]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: `relative ${className || ""}` }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value,
      onChange: (e) => {
        onChange(e.target.value);
        setHighlightIndex(0);
      },
      onFocus: () => setFocused(true),
      onBlur: () => setTimeout(() => setFocused(false), 150),
      onKeyDown: handleKeyDown,
      placeholder,
      autoFocus,
      className: inputClassName || "field-input w-full rounded-xl px-3 py-2 text-sm"
    }
  ), focused && matches.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute z-20 top-full inset-x-0 mt-1 panel rounded-xl overflow-hidden shadow-xl" }, matches.map((opt, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: opt,
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => pick(opt),
      className: `w-full text-right px-3 py-2 text-sm ${i === highlightIndex ? "bg-white/10 text-white" : "text-[#CBD5E1]"}`
    },
    opt
  ))));
}
function Modal({ title, accent = "#38BDF8", onClose, children, maxWidthClass = "max-w-sm" }) {
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: `panel rounded-2xl w-full ${maxWidthClass} p-5 modal-pop max-h-[85dvh] overflow-y-auto`, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base", style: { color: accent } }, title), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "text-[#94A3B8] hover:text-white" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 18 }))), children));
}
function LoginScreen({ onLogin, goRegister, error, loading }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center px-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-lg header-bar" }, /* @__PURE__ */ React.createElement(Icon, { name: "Store", size: 30, className: "text-white" })), /* @__PURE__ */ React.createElement("h1", { className: "font-extrabold text-2xl text-sky-400 tracking-wide" }, "FaAroon"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#94A3B8] mt-1" }, "\u0646\u0638\u0627\u0645 \u0625\u062F\u0627\u0631\u0629 \u0623\u0633\u0639\u0627\u0631 \u0648\u0645\u0628\u064A\u0639\u0627\u062A \u0627\u0644\u0645\u062D\u0644")), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-6" }, /* @__PURE__ */ React.createElement(TextField, { label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645", icon: "User", value: name, onChange: (e) => setName(e.target.value), placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645\u0643" }), /* @__PURE__ */ React.createElement(TextField, { label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", icon: "Lock", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }), error && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2 mb-4" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 16 }), " ", error), /* @__PURE__ */ React.createElement("button", { disabled: loading, onClick: () => onLogin(name.trim(), password), className: "btn-sky w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60" }, loading ? /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 18, className: "animate-spin" }) : null, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"), /* @__PURE__ */ React.createElement("button", { onClick: goRegister, className: "w-full text-center text-sm text-sky-400 font-semibold mt-4 hover:underline" }, "\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F \u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F"))));
}
function RegisterScreen({ onRegister, goLogin, error, loading }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center px-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm fade-up" }, /* @__PURE__ */ React.createElement("button", { onClick: goLogin, className: "flex items-center gap-1 text-sm text-[#94A3B8] mb-4 hover:text-white" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16 }), " \u0631\u062C\u0648\u0639 \u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"), /* @__PURE__ */ React.createElement("h1", { className: "font-extrabold text-xl text-sky-400 mb-1" }, "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628 \u062C\u062F\u064A\u062F"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#94A3B8] mb-5" }, "\u0647\u064A\u062A\u0628\u0639\u062A \u0637\u0644\u0628\u0643 \u0644\u0644\u0623\u062F\u0645\u0646 \u0639\u0634\u0627\u0646 \u064A\u0648\u0627\u0641\u0642 \u0639\u0644\u064A\u0647"), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-6" }, /* @__PURE__ */ React.createElement(TextField, { label: "\u0627\u0644\u0627\u0633\u0645", icon: "User", value: name, onChange: (e) => setName(e.target.value), placeholder: "\u0627\u0633\u0645\u0643 \u0628\u0627\u0644\u0643\u0627\u0645\u0644" }), /* @__PURE__ */ React.createElement(TextField, { label: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", icon: "Lock", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u0643\u0644\u0645\u0629 \u0633\u0631 \u0642\u0648\u064A\u0629" }), /* @__PURE__ */ React.createElement(TextField, { label: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", icon: "KeyRound", type: "password", value: confirm, onChange: (e) => setConfirm(e.target.value), placeholder: "\u0627\u0639\u062F \u0643\u062A\u0627\u0628\u0629 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631" }), error && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-rose-400 bg-rose-950/40 border border-rose-900/50 rounded-xl px-3 py-2 mb-4" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 16 }), " ", error), /* @__PURE__ */ React.createElement("button", { disabled: loading, onClick: () => onRegister(name.trim(), password, confirm), className: "btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 disabled:opacity-60" }, loading ? /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 18, className: "animate-spin" }) : null, "\u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628 \u0627\u0644\u062A\u0633\u062C\u064A\u0644"))));
}
function PendingScreen({ status, goLogin }) {
  const isRejected = status === "rejected";
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen flex items-center justify-center px-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-sm text-center fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-8" }, /* @__PURE__ */ React.createElement("div", { className: "stamp-anim inline-block mb-4" }, /* @__PURE__ */ React.createElement(StatusStamp, { status })), /* @__PURE__ */ React.createElement("h2", { className: "font-bold text-lg mb-2 text-white" }, isRejected ? "\u062A\u0645 \u0631\u0641\u0636 \u0637\u0644\u0628\u0643" : "\u0637\u0644\u0628\u0643 \u0642\u064A\u062F \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#94A3B8] mb-6" }, isRejected ? "\u0627\u0644\u0623\u062F\u0645\u0646 \u0631\u0641\u0636 \u0637\u0644\u0628 \u0627\u0646\u0636\u0645\u0627\u0645\u0643 \u0644\u0644\u0645\u062D\u0644. \u062A\u0642\u062F\u0631 \u062A\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0627\u0647 \u0644\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0633\u0628\u0628." : "\u0644\u0633\u0647 \u0627\u0644\u0623\u062F\u0645\u0646 \u0645\u0627 \u0648\u0627\u0641\u0642\u0634 \u0639\u0644\u0649 \u0637\u0644\u0628\u0643\u060C \u062D\u0627\u0648\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u062A\u0627\u0646\u064A \u0628\u0639\u062F \u0634\u0648\u064A\u0629."), /* @__PURE__ */ React.createElement("button", { onClick: goLogin, className: "btn-sky rounded-xl px-6 py-2.5 font-bold" }, "\u0631\u062C\u0648\u0639 \u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644"))));
}
function SideDrawer({ user, onNav, onClose }) {
  const items = [
    { key: "menu", label: "\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629", icon: "Store" },
    { key: "cashier", label: "\u0627\u0644\u0643\u0627\u0634\u064A\u0631", icon: "Wallet" },
    { key: "myInvoices", label: "\u0641\u0648\u0627\u062A\u064A\u0631\u064A", icon: "Receipt" },
    { key: "prices", label: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u062D\u0644", icon: "Store", adminOnly: true },
    { key: "orders", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", icon: "Package" },
    { key: "transfers", label: "\u062A\u062D\u0648\u064A\u0644\u0627\u062A", icon: "Send" },
    { key: "attendance", label: "\u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u0633\u062D\u0628", icon: "Clock" },
    { key: "admin", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", icon: "Users", adminOnly: true },
    { key: "reports", label: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", icon: "BarChart3", adminOnly: true },
    { key: "stock-alerts", label: "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646", icon: "AlertCircle", adminOnly: true },
    { key: "settings", label: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", icon: "Settings" }
  ].filter((i) => !i.adminOnly || userIsAdmin(user));
  const [cashierExpanded, setCashierExpanded] = useState(false);
  const pendingInvoices = loadCashierInvoices()?.invoices || [];
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[120]" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/60", onClick: onClose }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-[#171A20] shadow-2xl p-4 overflow-y-auto", dir: "rtl", style: { animation: "slideInRight 0.18s ease" } }, /* @__PURE__ */ React.createElement("h2", { className: "text-white font-bold text-lg mb-4" }, "\u0627\u0644\u0623\u0642\u0633\u0627\u0645"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, items.map((it) => /* @__PURE__ */ React.createElement("div", { key: it.key }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onNav(it.key), className: "flex-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-[#CBD5E1] hover:bg-white/5 text-right transition-colors" }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 17 }), it.label), it.key === "cashier" && pendingInvoices.length > 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => setCashierExpanded((v) => !v), className: "p-2 text-[#94A3B8]" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronDown", size: 14, style: { transform: cashierExpanded ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.15s" } }))), it.key === "cashier" && cashierExpanded && pendingInvoices.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "pr-8 space-y-1 mb-1" }, pendingInvoices.map((inv) => /* @__PURE__ */ React.createElement("button", { key: inv.id, onClick: () => onNav("cashier"), className: "block w-full text-right text-xs text-[#94A3B8] py-1.5 hover:text-white" }, inv.customerName || inv.label, " \u2014 ", inv.items.length, " \u0635\u0646\u0641 \u0644\u0633\u0647 \u0645\u0627 \u0627\u062A\u0623\u0643\u062F\u0634"))))))));
}
function Header({ user, onLogout, title, onBack, onNav, hideMenu }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "header-bar mx-4 mt-3 mb-2 flex justify-between items-center px-3.5 py-2.5 rounded-2xl shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "text-right flex items-center gap-2.5 min-w-0" }, onBack && /* @__PURE__ */ React.createElement("button", { onClick: onBack, className: "shrink-0 bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 18 })), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("h1", { className: "text-lg font-bold text-white tracking-wide leading-tight truncate" }, title), /* @__PURE__ */ React.createElement("p", { className: "text-white/85 text-[11px] mt-0.5 leading-tight truncate" }, user.name, " \xB7 ", /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, userIsAdmin(user) ? "\u0623\u062F\u0645\u0646" : "\u0645\u0648\u0638\u0641")))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 shrink-0" }, onNav && /* @__PURE__ */ React.createElement("button", { onClick: () => onNav("settings"), className: "bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all" }, /* @__PURE__ */ React.createElement(Icon, { name: "Settings", size: 17 })), onNav && !hideMenu && /* @__PURE__ */ React.createElement("button", { onClick: () => setDrawerOpen(true), className: "bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all" }, /* @__PURE__ */ React.createElement(Icon, { name: "Menu", size: 18 })))), drawerOpen && onNav && /* @__PURE__ */ React.createElement(SideDrawer, { user, onNav: (key) => {
    onNav(key);
    setDrawerOpen(false);
  }, onClose: () => setDrawerOpen(false) }));
}
function NotificationBell({ notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-5 right-5 z-[110]" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOpen((v) => !v), className: "relative bg-sky-600 text-white p-3 rounded-full shadow-lg" }, /* @__PURE__ */ React.createElement(Icon, { name: "Bell", size: 19 }), unreadCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "absolute -top-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#0F172A]" })), open && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[109]", onClick: () => setOpen(false) }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-14 right-0 w-72 max-h-80 overflow-y-auto panel rounded-2xl p-3 shadow-xl z-[111]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-white" }, "\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062A"), unreadCount > 0 && /* @__PURE__ */ React.createElement("button", { onClick: onMarkAllRead, className: "text-[11px] text-sky-400 font-semibold" }, "\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0643\u0644 \u0643\u0645\u0642\u0631\u0648\u0621")), notifications.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#64748B] text-center py-4" }, "\u0645\u0641\u064A\u0634 \u0625\u0634\u0639\u0627\u0631\u0627\u062A"), notifications.map((n) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: n.id,
      onClick: () => onMarkRead(n.id),
      className: `text-xs rounded-xl p-2.5 mb-1.5 cursor-pointer leading-5 ${n.read ? "text-[#64748B]" : "text-white bg-sky-500/10 font-semibold"}`
    },
    n.message,
    /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-[#64748B] mt-1 font-normal" }, new Date(n.createdAt).toLocaleString("ar-EG"))
  )))));
}
function MainMenu({ user, setView, onLogout, hasNew, onDevReset }) {
  const canPrices = userIsAdmin(user) || !!user.permissions?.manageProducts || !!user.permissions?.deleteProducts || !!user.permissions?.editPrices;
  const canAdmin = userIsAdmin(user) || !!user.permissions?.manageUsers;
  const canReports = userIsAdmin(user) || !!user.permissions?.viewReports;
  const canStockAlerts = userIsAdmin(user) || !!user.permissions?.manageStockAlerts;
  const items = [
    { key: "cashier", label: "\u0627\u0644\u0643\u0627\u0634\u064A\u0631", desc: "\u0628\u064A\u0639 \u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0637\u0628\u0627\u0639\u0629 \u0641\u0627\u062A\u0648\u0631\u0629", icon: "Wallet", enabled: true, accent: "#10B981" },
    { key: "myInvoices", label: "\u0641\u0648\u0627\u062A\u064A\u0631\u064A", desc: "\u0641\u0648\u0627\u062A\u064A\u0631\u0643 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0648\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0637\u0628\u0627\u0639\u0629", icon: "Receipt", enabled: true, accent: "#0EA5E9" },
    { key: "prices", label: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u062D\u0644", desc: "\u062C\u0645\u0644\u0629 \xB7 \u0646\u0635 \u062C\u0645\u0644\u0629 \xB7 \u0642\u0637\u0627\u0639\u064A", icon: "Store", enabled: canPrices, accent: "#14B8A6" },
    { key: "orders", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", desc: "\u0645\u062A\u0627\u0628\u0639\u0629 \u062D\u0627\u0644\u0629 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u062F\u0644\u064A\u0641\u0631\u064A", icon: "Package", enabled: true, accent: "#F97316" },
    { key: "transfers", label: "\u062A\u062D\u0648\u064A\u0644\u0627\u062A", desc: "\u062A\u0633\u062C\u064A\u0644 \u062A\u062D\u0648\u064A\u0644\u0627\u062A \u0641\u0644\u0648\u0633", icon: "Send", enabled: true, accent: "#A855F7" },
    { key: "attendance", label: "\u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u0633\u062D\u0628", desc: "\u0633\u062C\u0644 \u062D\u0636\u0648\u0631\u0643 \u0648\u0633\u062D\u0648\u0628\u0627\u062A\u0643", icon: "Clock", enabled: true, accent: "#06B6D4" },
    { key: "admin", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", desc: "\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0627\u0644\u0635\u0644\u0627\u062D\u064A\u0627\u062A", icon: "Users", enabled: canAdmin, accent: "#0EA5E9" },
    { key: "reports", label: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", desc: "\u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0627\u0644\u0645\u0624\u0643\u062F\u0629 \u0648\u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A", icon: "BarChart3", enabled: canReports, accent: "#6366F1" },
    { key: "stock-alerts", label: "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646", desc: "\u0645\u0646\u062A\u062C\u0627\u062A \u062E\u0644\u0635\u062A \u0623\u0648 \u0645\u0637\u0644\u0648\u0628\u0629", icon: "AlertCircle", enabled: canStockAlerts, accent: "#F43F5E" }
  ].filter((i) => i.key !== "admin" && i.key !== "reports" && i.key !== "stock-alerts" && i.key !== "prices" || (i.key === "admin" ? canAdmin : i.key === "reports" ? canReports : i.key === "stock-alerts" ? canStockAlerts : canPrices));
  const FAB_OPTIONS = [
    { key: "prices", label: "\u0645\u0646\u062A\u062C", icon: "Package", color: "#14B8A6", enabled: userIsAdmin(user) || !!user.permissions?.manageProducts },
    { key: "orders", label: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", icon: "Truck", color: "#F97316", enabled: true },
    { key: "cashier", label: "\u0639\u0645\u064A\u0644", icon: "User", color: "#10B981", enabled: true },
    { key: "transfers", label: "\u062A\u062D\u0648\u064A\u0644", icon: "Send", color: "#A855F7", enabled: true }
  ].filter((o) => o.enabled);
  const [fabOpen, setFabOpen] = useState(false);
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout, title: "\u0645\u062D\u0644\u0627\u062A FaAroon", onNav: setView, hideMenu: true }), /* @__PURE__ */ React.createElement("div", { className: "max-w-md mx-auto px-4 py-4 grid grid-cols-2 gap-3 fade-up" }, items.map((it) => {
    const dotRed = it.key === "orders" && hasNew.ordersPending || it.key === "stock-alerts" && hasNew["stock-alerts"];
    const dotGreen = it.key !== "orders" && it.key !== "stock-alerts" && hasNew[it.key];
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: it.key,
        disabled: !it.enabled,
        onClick: () => it.enabled && setView(it.key),
        className: "panel rounded-2xl p-4 text-right flex flex-col gap-2 transition-all",
        style: it.enabled ? {} : { opacity: 0.4 },
        onMouseEnter: (e) => {
          if (it.enabled) e.currentTarget.style.borderColor = it.accent;
        },
        onMouseLeave: (e) => {
          if (it.enabled) e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "relative w-11 h-11 rounded-xl flex items-center justify-center shadow-md", style: { background: it.accent } }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 21, className: "text-white" }), (dotRed || dotGreen) && /* @__PURE__ */ React.createElement("span", { className: "absolute w-3 h-3 rounded-full", style: { top: -3, left: -3, background: dotRed ? "#F43F5E" : "#34D399", boxShadow: "0 0 0 2px #1E293B" } })),
      /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm text-white" }, it.label),
      /* @__PURE__ */ React.createElement("div", { className: "text-xs text-[#94A3B8]" }, it.desc)
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-5 left-5 z-[90] flex flex-col items-start gap-2" }, fabOpen && FAB_OPTIONS.map((opt) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: opt.key,
      onClick: () => {
        setView(opt.key);
        setFabOpen(false);
      },
      className: "flex items-center gap-2 rounded-full pl-4 pr-3 py-2 shadow-lg text-white text-xs font-bold fade-up",
      style: { background: opt.color }
    },
    opt.label,
    /* @__PURE__ */ React.createElement(Icon, { name: opt.icon, size: 16 })
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setFabOpen((v) => !v),
      className: "w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white text-2xl font-bold",
      style: { background: "linear-gradient(135deg, #0EA5E9, #6366F1)", transform: fabOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease" }
    },
    "+"
  )));
}
function DevResetModal({ onClose, onConfirmed }) {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const doReset = async () => {
    if (confirmText.trim() !== "\u062A\u0635\u0641\u064A\u0631") {
      setError('\u0627\u0643\u062A\u0628 "\u062A\u0635\u0641\u064A\u0631" \u0628\u0627\u0644\u0638\u0628\u0637 \u0644\u0644\u062A\u0623\u0643\u064A\u062F');
      return;
    }
    setError("");
    setBusy(true);
    await onConfirmed();
    setBusy(false);
    setDone(true);
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: done ? "\u062A\u0645" : "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062A\u0635\u0641\u064A\u0631", accent: "#F43F5E", onClose }, done ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-emerald-300 mb-4 leading-6" }, "\u062A\u0645 \u0645\u0633\u062D \u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D. \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0641\u0636\u0644\u062A \u0632\u064A \u0645\u0627 \u0647\u064A."), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-sky w-full rounded-xl py-2.5 font-bold" }, "\u062A\u0645\u0627\u0645")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-rose-300 mb-3 leading-6" }, "\u0627\u0644\u062E\u0637\u0648\u0629 \u062F\u064A \u0647\u062A\u0645\u0633\u062D \u0643\u0644 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0648\u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0648\u0627\u0644\u062A\u062D\u0648\u064A\u0644\u0627\u062A \u0648\u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0648\u0645\u0641\u064A\u0634 \u0631\u062C\u0648\u0639 \u0641\u064A\u0647\u0627. \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 (\u0627\u0644\u0623\u062F\u0645\u0646 \u0648\u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646) \u0647\u062A\u0641\u0636\u0644 \u0632\u064A \u0645\u0627 \u0647\u064A."), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, '\u0627\u0643\u062A\u0628 "\u062A\u0635\u0641\u064A\u0631" \u0644\u0644\u062A\u0623\u0643\u064A\u062F'), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: confirmText,
      onChange: (e) => setConfirmText(e.target.value),
      className: "field-input w-full rounded-xl px-4 py-2.5 text-sm mb-3"
    }
  ), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("button", { disabled: busy, onClick: doReset, className: "btn-rose w-full rounded-xl py-2.5 font-bold" }, busy ? "\u0628\u064A\u062A\u0635\u0641\u0631..." : "\u062A\u0635\u0641\u064A\u0631 \u0643\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0646\u0647\u0627\u0626\u064A\u064B\u0627")));
}
function DevSalesResetModal({ onClose, onConfirmed }) {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const doReset = async () => {
    if (confirmText.trim() !== "\u0645\u0633\u062D \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A") {
      setError('\u0627\u0643\u062A\u0628 "\u0645\u0633\u062D \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A" \u0628\u0627\u0644\u0638\u0628\u0637 \u0644\u0644\u062A\u0623\u0643\u064A\u062F');
      return;
    }
    setError("");
    setBusy(true);
    await onConfirmed();
    setBusy(false);
    setDone(true);
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: done ? "\u062A\u0645" : "\u062A\u0623\u0643\u064A\u062F \u0645\u0633\u062D \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A", accent: "#F43F5E", onClose }, done ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-emerald-300 mb-4 leading-6" }, "\u0627\u062A\u0645\u0633\u062D\u062A \u0643\u0644 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0648\u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0628\u0646\u062C\u0627\u062D. \u0628\u0627\u0642\u064A \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0637\u0628\u064A\u0642 (\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646\u060C \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A) \u0641\u0636\u0644\u062A \u0632\u064A \u0645\u0627 \u0647\u064A."), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-sky w-full rounded-xl py-2.5 font-bold" }, "\u062A\u0645\u0627\u0645")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-rose-300 mb-3 leading-6" }, "\u0627\u0644\u062E\u0637\u0648\u0629 \u062F\u064A \u0647\u062A\u0645\u0633\u062D ", /* @__PURE__ */ React.createElement("b", null, "\u0643\u0644 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0648\u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A"), " \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0648\u0645\u0641\u064A\u0634 \u0631\u062C\u0648\u0639 \u0641\u064A\u0647\u0627 \u2014 \u062F\u064A \u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0628\u064A\u0639\u0627\u062A \u062D\u0642\u064A\u0642\u064A\u0629\u060C \u0645\u0634 \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u062C\u0631\u0628\u0629. \u0628\u0627\u0642\u064A \u062D\u0627\u062C\u0627\u062A \u0627\u0644\u062A\u0637\u0628\u064A\u0642 (\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646\u060C \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A) \u0647\u062A\u0641\u0636\u0644 \u0632\u064A \u0645\u0627 \u0647\u064A."), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, '\u0627\u0643\u062A\u0628 "\u0645\u0633\u062D \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A" \u0644\u0644\u062A\u0623\u0643\u064A\u062F'), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: confirmText,
      onChange: (e) => setConfirmText(e.target.value),
      className: "field-input w-full rounded-xl px-4 py-2.5 text-sm mb-3"
    }
  ), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("button", { disabled: busy, onClick: doReset, className: "btn-rose w-full rounded-xl py-2.5 font-bold" }, busy ? "\u0628\u064A\u062A\u0645\u0633\u062D..." : "\u0627\u0645\u0633\u062D \u0643\u0644 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631 \u0648\u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0646\u0647\u0627\u0626\u064A\u064B\u0627")));
}
function TierPriceEditor({ label, color, rows, setRows }) {
  const [numPadRow, setNumPadRow] = useState(null);
  const addRow = () => setRows([...rows, { id: uid(), label: "", price: "" }]);
  const removeRow = (id) => setRows(rows.filter((r) => r.id !== id));
  const updateRow = (id, field, val) => setRows(rows.map((r) => r.id === id ? { ...r, [field]: val } : r));
  const activeRow = rows.find((r) => r.id === numPadRow);
  return /* @__PURE__ */ React.createElement("div", { className: "price-chip !text-right" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold", style: { color } }, label), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: addRow, className: "text-[10px] text-sky-400 font-semibold" }, "+ \u0633\u0639\u0631 \u062A\u0627\u0646\u064A")), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, rows.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "flex gap-1.5 items-center" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setNumPadRow(r.id),
      className: "field-input rounded-lg px-2 py-1.5 text-xs text-center w-20 shrink-0 font-bold tabular-nums",
      style: { color: r.price ? color : "#64748B" }
    },
    r.price || "\u0627\u0644\u0633\u0639\u0631"
  ), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("span", { className: "block text-[10px] text-[#94A3B8] mb-0.5" }, "\u0639\u062F\u062F \u0627\u0644\u0642\u0637\u0639 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /* @__PURE__ */ React.createElement("input", { value: r.label, onChange: (e) => updateRow(r.id, "label", e.target.value), placeholder: "\u0645\u062B\u0627\u0644: \u0645\u0646 10 \u0642\u0637\u0639", className: "field-input rounded-lg px-2 py-1.5 text-xs w-full" })), rows.length > 1 && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => removeRow(r.id), className: "text-rose-400 shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 14 }))))), activeRow && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: "\u0627\u0644\u0633\u0639\u0631",
      initialValue: activeRow.price,
      onConfirm: (val) => {
        updateRow(activeRow.id, "price", val);
        setNumPadRow(null);
      },
      onClose: () => setNumPadRow(null)
    }
  ));
}
function PullToRefresh({ onRefresh }) {
  const [pullDist, setPullDist] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const startY = React.useRef(null);
  const dragging = React.useRef(false);
  const pullDistRef = React.useRef(0);
  const refreshingRef = React.useRef(false);
  const THRESHOLD = 70;
  useEffect(() => {
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
        const dist = Math.min(dy * 0.5, 90);
        pullDistRef.current = dist;
        setPullDist(dist);
      }
    };
    const onTouchEnd = async () => {
      if (!dragging.current) return;
      dragging.current = false;
      if (pullDistRef.current > THRESHOLD) {
        refreshingRef.current = true;
        setRefreshing(true);
        pullDistRef.current = 0;
        setPullDist(0);
        let ok = false;
        try {
          ok = await onRefresh();
        } catch (e) {
          console.error("pull-to-refresh failed", e);
          ok = false;
        }
        refreshingRef.current = false;
        setRefreshing(false);
        if (ok === false) {
          setFailed(true);
          setTimeout(() => setFailed(false), 3e3);
        }
      } else {
        pullDistRef.current = 0;
        setPullDist(0);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, (pullDist > 2 || refreshing) && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "fixed top-0 inset-x-0 z-[100] flex items-start justify-center pointer-events-none",
      style: { height: refreshing ? 50 : pullDist, transition: refreshing ? "height 0.15s ease" : "none" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "bg-[#1E293B] border border-white/10 rounded-full p-2.5 shadow-lg mt-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 18, className: refreshing ? "text-sky-400 animate-spin" : "text-sky-400" }))
  ), failed && /* @__PURE__ */ React.createElement("div", { className: "fixed top-3 inset-x-3 z-[100] flex justify-center pointer-events-none" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 14, className: "text-rose-400 shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-rose-300 font-bold" }, "\u0641\u0634\u0644 \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u2014 \u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A"))));
}
function BarcodeListEditor({ barcodes, setBarcodes, onScan }) {
  const updateAt = (i, val) => setBarcodes(barcodes.map((b, idx) => idx === i ? val : b));
  const removeAt = (i) => setBarcodes(barcodes.length > 1 ? barcodes.filter((_, idx) => idx !== i) : [""]);
  const addBlank = () => setBarcodes([...barcodes, ""]);
  return /* @__PURE__ */ React.createElement("div", { className: "mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#94A3B8]" }, "\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F (\u0627\u062E\u062A\u064A\u0627\u0631\u064A\u060C \u0645\u0645\u0643\u0646 \u0623\u0643\u062A\u0631 \u0645\u0646 \u0648\u0627\u062D\u062F \u0644\u0646\u0641\u0633 \u0627\u0644\u0645\u0646\u062A\u062C)"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: addBlank, className: "text-[10px] text-sky-400 font-semibold shrink-0" }, "+ \u0643\u0648\u062F \u062A\u0627\u0646\u064A")), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, barcodes.map((b, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex gap-2" }, /* @__PURE__ */ React.createElement("input", { value: b, onChange: (e) => updateAt(i, e.target.value), placeholder: "\u0627\u0645\u0633\u062D \u0623\u0648 \u0627\u0643\u062A\u0628 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F", className: "field-input flex-1 rounded-xl px-3 py-2 text-sm" }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => onScan(i), className: "icon-btn rounded-xl px-3 shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "ScanLine", size: 18 })), barcodes.length > 1 && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => removeAt(i), className: "text-rose-400 shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 16 }))))));
}
function BarcodeScannerModal({ onDetected, onClose }) {
  const [error, setError] = useState("");
  const instanceRef = React.useRef(null);
  const stoppedRef = React.useRef(false);
  const killAnyLeakedCamera = () => {
    try {
      document.querySelectorAll("video").forEach((v) => {
        const stream = v.srcObject;
        if (stream && typeof stream.getTracks === "function") {
          stream.getTracks().forEach((t) => t.stop());
        }
        v.srcObject = null;
        if (v.parentNode && !document.getElementById("barcode-reader-box")?.contains(v) && v.id !== "barcode-reader-box") {
          v.parentNode.removeChild(v);
        }
      });
    } catch {
    }
  };
  useEffect(() => {
    if (typeof Html5Qrcode === "undefined") {
      setError("\u0645\u0643\u062A\u0628\u0629 \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u0644\u0633\u0647 \u0628\u062A\u062D\u0645\u0651\u0644\u060C \u062C\u0631\u0628 \u062A\u0627\u0646\u064A \u0628\u0639\u062F \u062B\u0627\u0646\u064A\u0629");
      return;
    }
    const qr = new Html5Qrcode("barcode-reader-box");
    instanceRef.current = qr;
    stoppedRef.current = false;
    const safeStop = () => {
      if (stoppedRef.current) return Promise.resolve();
      stoppedRef.current = true;
      try {
        return qr.stop().catch(() => {
        }).finally(killAnyLeakedCamera);
      } catch {
        killAnyLeakedCamera();
        return Promise.resolve();
      }
    };
    const startPromise = qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 140 } },
      (decodedText) => {
        safeStop().finally(() => onDetected(decodedText));
      },
      () => {
      }
    ).catch(() => setError("\u062A\u0639\u0630\u0631 \u062A\u0634\u063A\u064A\u0644 \u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627 \u2014 \u062A\u0623\u0643\u062F \u0625\u0646\u0643 \u0633\u0645\u062D\u062A \u0644\u0644\u0645\u0648\u0642\u0639 \u0628\u0635\u0644\u0627\u062D\u064A\u0629 \u0627\u0644\u0643\u0627\u0645\u064A\u0631\u0627"));
    return () => {
      startPromise.finally(safeStop);
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[90] flex items-center justify-center p-4 modal-backdrop", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 w-full max-w-sm", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-white text-sm flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "ScanLine", size: 16 }), " \u0627\u0645\u0633\u062D \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F"), /* @__PURE__ */ React.createElement("button", { onClick: onClose }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 20, className: "text-[#94A3B8]" }))), /* @__PURE__ */ React.createElement("div", { id: "barcode-reader-box", className: "rounded-xl overflow-hidden bg-black/40 min-h-[200px]" }), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mt-2 text-center" }, error)));
}
function ProductThumb({ product, editable, onPick }) {
  const fileRef = React.useRef(null);
  const [showLightbox, setShowLightbox] = useState(false);
  return /* @__PURE__ */ React.createElement("div", { className: "relative w-24 h-24 shrink-0" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "w-24 h-24 rounded-2xl overflow-hidden bg-black/30 flex items-center justify-center border border-white/5 cursor-pointer",
      onClick: () => product?.image && setShowLightbox(true)
    },
    product?.image ? /* @__PURE__ */ React.createElement("img", { src: product.image, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ React.createElement(Icon, { name: "Store", size: 32, className: "text-[#475569]" })
  ), editable && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => fileRef.current && fileRef.current.click(),
      className: "absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center border-2 border-[#1E293B] cursor-pointer"
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "Camera", size: 14, className: "text-white" })
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: fileRef,
      type: "file",
      accept: "image/*",
      className: "hidden",
      onChange: (e) => {
        if (e.target.files && e.target.files[0]) onPick(e.target.files[0]);
        e.target.value = "";
      }
    }
  )), showLightbox && product?.image && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-6 modal-backdrop", onClick: () => setShowLightbox(false) }, /* @__PURE__ */ React.createElement("div", { className: "relative", style: { width: "75vw", height: "75vh" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("img", { src: product.image, alt: "", className: "w-full h-full object-contain rounded-2xl" }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowLightbox(false),
      className: "absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 18 })
  ))));
}
function InvoiceThumb({ src, className }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", { src, onClick: () => setOpen(true), className: `${className} cursor-pointer`, alt: "\u0641\u0627\u062A\u0648\u0631\u0629" }), open && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-6 modal-backdrop", onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "relative", style: { width: "75vw", height: "75vh" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("img", { src, alt: "", className: "w-full h-full object-contain rounded-2xl" }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setOpen(false),
      className: "absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 18 })
  ))));
}
function CategoryCombobox({ categories, setCategories, value, onSelect, allowCreate = true, placeholder = "\u0627\u0643\u062A\u0628 \u0623\u0648 \u062F\u0648\u0631 \u0639\u0644\u0649 \u062A\u0635\u0646\u064A\u0641" }) {
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
  return /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: open ? query : selected ? selected.name : query,
      onFocus: () => {
        setOpen(true);
        setQuery("");
      },
      onBlur: () => setTimeout(() => setOpen(false), 120),
      onChange: (e) => setQuery(e.target.value),
      placeholder,
      className: "field-input w-full rounded-xl px-3 py-2 text-sm"
    }
  ), open && /* @__PURE__ */ React.createElement("div", { className: "absolute z-10 mt-1 w-full panel rounded-xl overflow-hidden max-h-52 overflow-y-auto" }, selected && /* @__PURE__ */ React.createElement("button", { onMouseDown: (e) => {
    e.preventDefault();
    onSelect(null);
    setQuery("");
    setOpen(false);
  }, className: "w-full text-right px-3 py-2 text-xs text-rose-400 hover:bg-black/20 border-b border-white/5" }, "\u2715 \u0625\u0644\u063A\u0627\u0621 \u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u062A\u0635\u0646\u064A\u0641"), filtered.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, className: "flex items-center justify-between hover:bg-black/20" }, /* @__PURE__ */ React.createElement("button", { onMouseDown: (e) => {
    e.preventDefault();
    onSelect(c.id);
    setQuery("");
    setOpen(false);
  }, className: "flex-1 text-right px-3 py-2 text-sm text-white" }, c.name), /* @__PURE__ */ React.createElement("button", { onMouseDown: (e) => {
    e.preventDefault();
    deleteCategory(c.id);
  }, className: "text-rose-400 px-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash2", size: 13 })))), filtered.length === 0 && !query.trim() && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#64748B] text-center py-3" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0628\u0639\u062F"), allowCreate && query.trim() && !exactMatch && /* @__PURE__ */ React.createElement("button", { onMouseDown: (e) => {
    e.preventDefault();
    createCategory(query.trim());
  }, className: "w-full text-right px-3 py-2 text-sm text-sky-400 hover:bg-black/20 border-t border-white/5" }, '+ \u0625\u0646\u0634\u0627\u0621 \u062A\u0635\u0646\u064A\u0641 \u062C\u062F\u064A\u062F: "', query.trim(), '"')));
}
const PAYMENT_METHODS = [
  { key: "cash", label: "\u0643\u0627\u0634", icon: "Banknote" },
  { key: "vodafone_cash", label: "\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634", icon: "Smartphone" },
  { key: "instapay", label: "\u0627\u0646\u0633\u062A\u0627\u0628\u0627\u064A", icon: "Smartphone" },
  { key: "split", label: "\u062C\u0632\u0621 \u0643\u0627\u0634 \u0648\u062C\u0632\u0621 \u062A\u062D\u0648\u064A\u0644", icon: "Banknote" }
];
function PaymentMethodPicker({ value, onChange }) {
  const [numPadField, setNumPadField] = useState(null);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 mb-3" }, PAYMENT_METHODS.map((m) => /* @__PURE__ */ React.createElement("button", { key: m.key, onClick: () => onChange({ ...value, paymentMethod: m.key }), className: `toggle-pill rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 ${value.paymentMethod === m.key ? "active-sky" : ""}` }, /* @__PURE__ */ React.createElement(Icon, { name: m.icon, size: 13 }), " ", m.label))), value.paymentMethod === "split" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0627\u0644\u062A\u062D\u0648\u064A\u0644 \u0639\u0646 \u0637\u0631\u064A\u0642"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onChange({ ...value, splitTransferMethod: "vodafone_cash" }), className: `toggle-pill flex-1 rounded-xl py-2 text-xs font-bold ${value.splitTransferMethod === "vodafone_cash" ? "active-sky" : ""}` }, "\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634"), /* @__PURE__ */ React.createElement("button", { onClick: () => onChange({ ...value, splitTransferMethod: "instapay" }), className: `toggle-pill flex-1 rounded-xl py-2 text-xs font-bold ${value.splitTransferMethod === "instapay" ? "active-sky" : ""}` }, "\u0627\u0646\u0633\u062A\u0627\u0628\u0627\u064A")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 mb-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setNumPadField("cash"), className: "field-input rounded-xl px-3 py-2 text-sm text-center", style: { color: value.cashAmount ? void 0 : "#64748B" } }, value.cashAmount || "\u0627\u0644\u0645\u0628\u0644\u063A \u0643\u0627\u0634"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setNumPadField("transfer"), className: "field-input rounded-xl px-3 py-2 text-sm text-center", style: { color: value.transferAmount ? void 0 : "#64748B" } }, value.transferAmount || "\u0627\u0644\u0645\u0628\u0644\u063A \u062A\u062D\u0648\u064A\u0644")), numPadField && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: numPadField === "cash" ? "\u0627\u0644\u0645\u0628\u0644\u063A \u0643\u0627\u0634" : "\u0627\u0644\u0645\u0628\u0644\u063A \u062A\u062D\u0648\u064A\u0644",
      initialValue: numPadField === "cash" ? value.cashAmount : value.transferAmount,
      onConfirm: (val) => {
        onChange({ ...value, [numPadField === "cash" ? "cashAmount" : "transferAmount"]: val });
        setNumPadField(null);
      },
      onClose: () => setNumPadField(null)
    }
  )));
}
const EMPTY_CONFIRM_FORM = { paymentMethod: null, splitTransferMethod: null, cashAmount: "", transferAmount: "" };
function parseQtyThreshold(label) {
  if (!label) return 0;
  const m = toEnglishDigits(label).match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}
function pickBestRowForQty(rows, qty) {
  let best = rows[0];
  let bestThreshold = -1;
  rows.forEach((r) => {
    const t = parseQtyThreshold(r.label);
    if (qty >= t && t >= bestThreshold) {
      bestThreshold = t;
      best = r;
    }
  });
  return best;
}
function TierColorButton({ color, active, onClick, label }) {
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick,
      className: "rounded-xl h-11 border-2 transition-all flex items-center justify-center text-xs font-bold px-2 flex-1 min-w-[64px]",
      style: { background: active ? color : `${color}22`, borderColor: color, color: active ? "#0B0D10" : color }
    },
    label || ""
  );
}
function NewInvoiceTierModal({ customerNameOptions, customerTierMap, tierSettings, busy, onCreate, onClose }) {
  const [tierKey, setTierKey] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [tierAutoPicked, setTierAutoPicked] = useState(false);
  const handleNameChange = (val) => {
    setCustomerName(val);
    const knownTier = customerTierMap[val.trim()];
    if (knownTier && activeTiers(tierSettings).some((t) => t.id === knownTier)) {
      setTierKey(knownTier);
      setTierAutoPicked(true);
    } else if (tierAutoPicked) {
      setTierKey(null);
      setTierAutoPicked(false);
    }
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629", accent: "#10B981", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0627\u0633\u0645 \u0627\u0644\u0632\u0628\u0648\u0646 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /* @__PURE__ */ React.createElement(
    AutocompleteInput,
    {
      value: customerName,
      onChange: handleNameChange,
      options: customerNameOptions,
      placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0632\u0628\u0648\u0646",
      className: "mb-1.5"
    }
  ), tierAutoPicked && /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-sky-400 mb-2.5" }, "\u0627\u062E\u062A\u0631\u0646\u0627 \u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u0633\u0639\u0631 \u062A\u0644\u0642\u0627\u0626\u064A \u0628\u0646\u0627\u0621\u064B \u0639\u0644\u0649 \u0622\u062E\u0631 \u0645\u0631\u0629 \u0627\u0634\u062A\u0631\u0649 \u0641\u064A\u0647\u0627"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 mb-4" }, activeTiers(tierSettings).map((tier) => /* @__PURE__ */ React.createElement(
    TierColorButton,
    {
      key: tier.id,
      color: tier.color,
      active: tierKey === tier.id,
      onClick: () => {
        setTierKey(tier.id);
        setTierAutoPicked(false);
      },
      label: tierSettings.hideFromCustomer ? "" : tier.label
    }
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: !tierKey || busy,
      onClick: () => onCreate(tierKey, customerName.trim()),
      className: "btn-emerald w-full rounded-xl py-2.5 font-bold disabled:opacity-40 flex items-center justify-center gap-2"
    },
    busy && /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }),
    busy ? "\u0628\u064A\u062D\u062C\u0632 \u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629..." : "\u0628\u062F\u0621 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629"
  ));
}
function NumPad({ title, initialValue, error, onConfirm, onClose }) {
  const [value, setValue] = useState("");
  const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "\u232B"];
  const press = (k) => {
    playBeep("tap");
    if (k === "\u232B") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (k === "." && value.includes(".")) return;
    setValue((v) => v + k);
  };
  const editing = value !== "";
  const display = editing ? value : initialValue || "0";
  return ReactDOM.createPortal(
    /* @__PURE__ */ React.createElement(Modal, { title, accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement("div", { className: `text-center text-3xl font-bold mb-4 tabular-nums py-3 border-b border-white/10 min-h-[3rem] ${editing ? "text-white" : "text-[#64748B]"}` }, display), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-4" }, KEYS.map((k) => /* @__PURE__ */ React.createElement("button", { key: k, onClick: () => press(k), className: "btn-ghost rounded-xl py-4 text-xl font-bold" }, k))), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onConfirm(editing ? value : initialValue || ""), className: "btn-emerald flex-1 rounded-xl py-2.5 font-bold" }, "\u062A\u0645"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2.5 font-bold" }, "\u0625\u0644\u063A\u0627\u0621"))),
    document.body
  );
}
function ProductPickerModal({ product, invoice, existingItem, tierSettings, user, onAdd, onUpdate, onSuppressWarning, onClose }) {
  const [tierKey, setTierKey] = useState(existingItem?.tierKey || invoice.tierKey);
  const [qty, setQty] = useState(existingItem ? String(existingItem.qty) : "1");
  const [priceOverridden, setPriceOverridden] = useState(false);
  const [manualPrice, setManualPrice] = useState(existingItem ? String(existingItem.unitPrice) : "");
  const [tierPickerOpen, setTierPickerOpen] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState(null);
  const [numPadTarget, setNumPadTarget] = useState(null);
  const priceLongPressRef = React.useRef(null);
  const tierLongPressRef = React.useRef(null);
  const canQuickTier = userIsAdmin(user) || !!user.permissions?.quickTierChange;
  const canQuickPrice = userIsAdmin(user) || !!user.permissions?.quickPriceOverride;
  const activeTierObj = activeTiers(tierSettings).find((t) => t.id === tierKey);
  const rows = tierRows(product[tierKey]);
  const qtyNum = parseNum(qty) || 1;
  const autoRow = pickBestRowForQty(rows, qtyNum);
  const displayPrice = priceOverridden ? manualPrice : String(autoRow?.price ?? "");
  const lineTotal = (parseNum(displayPrice) || 0) * qtyNum;
  const [fetchedImage, setFetchedImage] = useState(null);
  useEffect(() => {
    if (product.image) return;
    let cancelled = false;
    (async () => {
      const fetched = await batchGetImages([product.id]);
      if (!cancelled) setFetchedImage(fetched[product.id] || null);
    })();
    return () => {
      cancelled = true;
    };
  }, [product.id]);
  const displayImage = product.image || fetchedImage;
  const proceedAdd = (finalPrice, finalQty) => {
    const payload = { productId: product.id, productName: product.name, tierKey, priceNote: autoRow?.label, unitPrice: finalPrice, qty: finalQty, lineTotal: finalPrice * finalQty, priceOverridden };
    if (existingItem) {
      onUpdate(existingItem.id, payload);
    } else {
      onAdd(payload);
    }
  };
  const confirm = () => {
    const q = parseNum(qty);
    if (q === null || q <= 0) {
      setError("\u0627\u0643\u062A\u0628 \u0639\u062F\u062F \u0635\u062D\u064A\u062D");
      return;
    }
    const price = parseNum(displayPrice);
    if (price === null || price < 0) {
      setError("\u0627\u0643\u062A\u0628 \u0633\u0639\u0631 \u0635\u062D\u064A\u062D");
      return;
    }
    setError("");
    const invoiceTierPrice = pickBestRowForQty(tierRows(product[invoice.tierKey]), q).price;
    const cheapestTierPrice = Math.min(...activeTiers(tierSettings).map((t) => pickBestRowForQty(tierRows(product[t.id]), q).price));
    if (price < cheapestTierPrice && !invoice.suppressRed) {
      setWarning({ type: "red", price, q });
      return;
    }
    if (price < invoiceTierPrice && !invoice.suppressYellow) {
      setWarning({ type: "yellow", price, q });
      return;
    }
    proceedAdd(price, q);
  };
  if (warning) {
    const isRed = warning.type === "red";
    return /* @__PURE__ */ React.createElement(Modal, { title: isRed ? "\u26A0\uFE0F \u0623\u0642\u0644 \u0645\u0646 \u0623\u0631\u062E\u0635 \u0633\u0639\u0631 \u0645\u062A\u0627\u062D \u0644\u0644\u0645\u0646\u062A\u062C \u062F\u0647!" : "\u26A0\uFE0F \u0623\u0642\u0644 \u0645\u0646 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u062D\u062F\u062F \u0644\u0644\u0641\u0627\u062A\u0648\u0631\u0629", accent: isRed ? "#EF4444" : "#FBBF24", onClose: () => setWarning(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0644\u064A \u0643\u062A\u0628\u062A\u0647 (", /* @__PURE__ */ React.createElement("span", { className: "font-bold tabular-nums" }, warning.price), ") \u0623\u0642\u0644 \u0645\u0646 ", isRed ? "\u0623\u0631\u062E\u0635 \u0633\u0639\u0631 \u0645\u062A\u0627\u062D \u0644\u0644\u0645\u0646\u062A\u062C \u062F\u0647" : "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u062D\u062F\u062F \u0644\u0646\u0648\u0639 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u062F\u064A", ". \u062A\u062D\u0628 \u062A\u0643\u0645\u0644 \u0628\u064A\u0647\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => proceedAdd(warning.price, warning.q), className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0623\u0643\u0645\u0644 \u0627\u0644\u0628\u064A\u0639"), /* @__PURE__ */ React.createElement("button", { onClick: () => setWarning(null), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0631\u062C\u0648\u0639")), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          onSuppressWarning(isRed ? "red" : "yellow");
          proceedAdd(warning.price, warning.q);
        },
        className: "w-full text-xs text-[#94A3B8] hover:underline"
      },
      "\u0639\u062F\u0645 \u0627\u0644\u062A\u062D\u0630\u064A\u0631 \u062A\u0627\u0646\u064A \u0641\u064A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u062F\u064A"
    ));
  }
  return /* @__PURE__ */ React.createElement(
    Modal,
    {
      title: existingItem ? "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0645\u0646\u062A\u062C" : "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C \u0644\u0644\u0641\u0627\u062A\u0648\u0631\u0629",
      accent: "#10B981",
      onClose,
      maxWidthClass: "max-w-sm sm:max-w-2xl"
    },
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-5" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement(ProductThumb, { product: { image: displayImage } }), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-sm" }, product.name)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#94A3B8]" }, "\u0627\u0644\u062A\u0635\u0646\u064A\u0641"), !tierPickerOpen && canQuickTier && /* @__PURE__ */ React.createElement("button", { onClick: () => setTierPickerOpen(true), className: "text-[11px] text-sky-400 font-semibold" }, "\u062A\u063A\u064A\u064A\u0631")), tierPickerOpen ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 mb-4" }, activeTiers(tierSettings).map((tier) => /* @__PURE__ */ React.createElement(
      TierColorButton,
      {
        key: tier.id,
        color: tier.color,
        active: tierKey === tier.id,
        onClick: () => {
          setTierKey(tier.id);
          setPriceOverridden(false);
          setTierPickerOpen(false);
        },
        label: tierSettings.hideFromCustomer ? "" : tier.label
      }
    ))) : /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flex gap-2 mb-4",
        onTouchStart: () => {
          if (!canQuickTier) tierLongPressRef.current = setTimeout(() => setTierPickerOpen(true), 2e3);
        },
        onTouchEnd: () => {
          if (tierLongPressRef.current) clearTimeout(tierLongPressRef.current);
        },
        onMouseDown: () => {
          if (!canQuickTier) tierLongPressRef.current = setTimeout(() => setTierPickerOpen(true), 2e3);
        },
        onMouseUp: () => {
          if (tierLongPressRef.current) clearTimeout(tierLongPressRef.current);
        }
      },
      /* @__PURE__ */ React.createElement(
        TierColorButton,
        {
          color: activeTierObj?.color,
          active: true,
          onClick: () => {
          },
          label: tierSettings.hideFromCustomer ? "" : activeTierObj?.label
        }
      )
    ), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1.5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#94A3B8]" }, "\u0627\u0644\u0633\u0639\u0631"), !priceOverridden && canQuickPrice && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setManualPrice(displayPrice);
      setPriceOverridden(true);
    }, className: "text-[11px] text-sky-400 font-semibold" }, "\u062A\u063A\u064A\u064A\u0631")), priceOverridden ? /* @__PURE__ */ React.createElement("button", { onClick: () => setNumPadTarget("price"), className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-3 text-center block font-bold tabular-nums" }, manualPrice || "0") : /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "mb-3",
        onTouchStart: () => {
          if (!canQuickPrice) priceLongPressRef.current = setTimeout(() => {
            setManualPrice(displayPrice);
            setPriceOverridden(true);
          }, 2e3);
        },
        onTouchEnd: () => {
          if (priceLongPressRef.current) clearTimeout(priceLongPressRef.current);
        },
        onMouseDown: () => {
          if (!canQuickPrice) priceLongPressRef.current = setTimeout(() => {
            setManualPrice(displayPrice);
            setPriceOverridden(true);
          }, 2e3);
        },
        onMouseUp: () => {
          if (priceLongPressRef.current) clearTimeout(priceLongPressRef.current);
        }
      },
      rows.length > 1 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-[11px] font-semibold rounded-lg py-1.5 mb-2", style: { background: "rgba(139,92,246,0.14)", color: "#C4B5FD" } }, "\u0627\u0644\u0633\u0639\u0631 \u0628\u064A\u062A\u063A\u064A\u0631 \u062A\u0644\u0642\u0627\u0626\u064A\u064B\u0627 \u062D\u0633\u0628 \u0627\u0644\u0643\u0645\u064A\u0629"),
      /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, rows.map((r, i) => {
        const isActive = r === autoRow;
        const qtyText = r.label && r.label.trim() ? r.label.trim() : "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0623\u0633\u0627\u0633\u064A";
        const color = activeTierObj?.color || "#fff";
        return /* @__PURE__ */ React.createElement(
          "div",
          {
            key: i,
            className: "flex items-center justify-between rounded-xl px-3 py-2.5 border-2",
            style: { borderColor: color, background: isActive ? `${color}22` : "transparent", opacity: isActive ? 1 : 0.55 }
          },
          /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2 text-xs font-semibold", style: { color } }, /* @__PURE__ */ React.createElement("span", { className: "w-3.5 h-3.5 rounded-full border-2 shrink-0", style: { borderColor: color, background: isActive ? color : "transparent" } }), qtyText),
          /* @__PURE__ */ React.createElement("span", { className: "font-bold tabular-nums text-base", style: { color } }, r.price, " \u062C")
        );
      }))
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0627\u0644\u0643\u0645\u064A\u0629"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setQty(String((parseNum(qty) || 0) + 1)),
        className: "field-input w-11 h-11 shrink-0 rounded-xl text-xl font-bold flex items-center justify-center"
      },
      "+"
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => setNumPadTarget("qty"), className: "field-input flex-1 rounded-xl px-3 py-2 text-sm text-center block font-bold tabular-nums" }, qty || "0"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setQty(String(Math.max(1, (parseNum(qty) || 1) - 1))),
        className: "field-input w-11 h-11 shrink-0 rounded-xl text-xl font-bold flex items-center justify-center"
      },
      "\u2212"
    )), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl border border-white/10 bg-black/20 p-3 mb-4 space-y-1.5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs text-[#94A3B8]" }, /* @__PURE__ */ React.createElement("span", null, "\u0633\u0639\u0631 \u0627\u0644\u0648\u062D\u062F\u0629"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white tabular-nums" }, displayPrice || 0, " \u062C")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs text-[#94A3B8]" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0643\u0645\u064A\u0629"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white tabular-nums" }, qtyNum, " \u0642\u0637\u0639\u0629")), /* @__PURE__ */ React.createElement("div", { className: "border-t border-white/10 my-1" }), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-[#94A3B8]" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", { className: "text-lg font-bold text-emerald-400 tabular-nums" }, lineTotal, " \u062C"))), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("button", { onClick: confirm, className: "btn-emerald w-full rounded-xl py-2.5 font-bold" }, existingItem ? "\u062D\u0641\u0638 \u0627\u0644\u062A\u0639\u062F\u064A\u0644" : "\u0625\u0636\u0627\u0641\u0629 \u0644\u0644\u0633\u0644\u0629"))),
    numPadTarget && /* @__PURE__ */ React.createElement(
      NumPad,
      {
        title: numPadTarget === "qty" ? "\u0627\u0644\u0643\u0645\u064A\u0629" : "\u0627\u0644\u0633\u0639\u0631",
        initialValue: numPadTarget === "qty" ? qty : manualPrice,
        onConfirm: (v) => {
          if (numPadTarget === "qty") setQty(v);
          else setManualPrice(v);
          setNumPadTarget(null);
        },
        onClose: () => setNumPadTarget(null)
      }
    )
  );
}
function SaleReceiptPreview({ sale, onClose }) {
  const pay = paymentLabel(sale);
  const isDelivery = sale.fulfillment === "delivery";
  const [printError, setPrintError] = useState("");
  const handlePrint = () => {
    printSaleReceipt(sale, (reason) => {
      setPrintError(reason === "popup" ? "\u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u0634 \u0642\u0627\u062F\u0631 \u064A\u0641\u062A\u062D \u0634\u0627\u0634\u0629 \u0627\u0644\u0637\u0628\u0627\u0639\u0629 \u2014 \u062A\u0623\u0643\u062F \u0625\u0646 \u0627\u0644\u0640pop-ups \u0645\u0633\u0645\u0648\u062D\u0629" : "\u062D\u0635\u0644\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0644\u0644\u0637\u0627\u0628\u0639\u0629");
      setTimeout(() => setPrintError(""), 4e3);
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Modal, { title: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629", accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement("div", { className: "bg-white text-black rounded-lg p-4 mb-4 text-sm", dir: "rtl", style: { fontFamily: "Tahoma, Arial, sans-serif" } }, /* @__PURE__ */ React.createElement("h3", { className: "text-center font-bold text-base mb-1" }, "FaAroon"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-gray-500 mb-1" }, "\u0641\u0627\u062A\u0648\u0631\u0629 \u0643\u0627\u0634\u064A\u0631 \u0631\u0642\u0645 ", sale.invoiceNumber ?? ""), sale.customerName && /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-gray-500 mb-1" }, "\u0627\u0644\u0632\u0628\u0648\u0646: ", sale.customerName), /* @__PURE__ */ React.createElement("div", { className: "border-t border-dashed border-gray-300 my-2" }), sale.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex justify-between text-xs py-0.5" }, /* @__PURE__ */ React.createElement("span", null, it.productName, " \xD7 ", it.qty), /* @__PURE__ */ React.createElement("span", null, it.lineTotal))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-dashed border-gray-300 my-2" }), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between font-bold text-sm mb-1" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", null, sale.total)), !isDelivery && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-600" }, /* @__PURE__ */ React.createElement("span", null, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ React.createElement("span", null, pay.label)), isDelivery && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "border-t border-dashed border-gray-300 my-2" }), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-gray-700 mb-1" }, "\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062F\u0644\u064A\u0641\u0631\u064A"), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-600" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0645\u0646\u0637\u0642\u0629"), /* @__PURE__ */ React.createElement("span", null, sale.deliveryArea)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-600" }, /* @__PURE__ */ React.createElement("span", null, "\u062A\u0644\u064A\u0641\u0648\u0646 \u0627\u0644\u0632\u0628\u0648\u0646"), /* @__PURE__ */ React.createElement("span", { dir: "ltr" }, sale.customerPhone)), sale.dispatchLocation && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-600" }, /* @__PURE__ */ React.createElement("span", null, "\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C"), /* @__PURE__ */ React.createElement("span", null, sale.dispatchLocation)))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: handlePrint, className: "btn-emerald flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "Printer", size: 16 }), " \u0637\u0628\u0627\u0639\u0629"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2.5 font-bold" }, "\u0625\u063A\u0644\u0627\u0642"))), printError && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in text-xs text-rose-300 font-bold text-center" }, printError)));
}
function RenameCustomerModal({ initialName, customerNameOptions, onSave, onClose }) {
  const [name, setName] = useState(initialName || "");
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u0627\u0633\u0645 \u0627\u0644\u0632\u0628\u0648\u0646", accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement(
    AutocompleteInput,
    {
      value: name,
      onChange: setName,
      options: customerNameOptions,
      placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0632\u0628\u0648\u0646",
      className: "mb-4",
      autoFocus: true
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => onSave(name.trim()), className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621")));
}
function makeEmptyInvoice(tierKey, label, customerName, invoiceNumber) {
  return { id: uid(), label, invoiceNumber, tierKey, customerName: customerName || "", items: [], suppressYellow: false, suppressRed: false };
}
function CartThumb({ src }) {
  const [open, setOpen] = useState(false);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => src && setOpen(true),
      className: "w-16 rounded-2xl overflow-hidden bg-black/25 flex items-center justify-center shrink-0 border border-white/5"
    },
    src ? /* @__PURE__ */ React.createElement("img", { src, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ React.createElement(Icon, { name: "Store", size: 20, className: "text-[#475569]" })
  ), open && ReactDOM.createPortal(
    /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[80] flex items-center justify-center p-6 photo-lightbox-backdrop", onClick: () => setOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "relative", style: { width: "75vw", height: "75vh" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("img", { src, alt: "", className: "w-full h-full object-contain rounded-2xl" }), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setOpen(false),
        className: "absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center text-white"
      },
      /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 18 })
    ))),
    document.body
  ));
}
function CashierScreen({ user, products, productsLoading, sales, setSales, tierSettings, invoiceNumberSettings, setInvoiceNumberSettings, usingCachedProducts, attendance, branchSettings, categories, setView }) {
  const [invoices, setInvoices] = useState(() => loadCashierInvoices()?.invoices || []);
  const [activeId, setActiveId] = useState(() => {
    const saved = loadCashierInvoices();
    return saved && saved.invoices.length ? saved.invoices[0].id : null;
  });
  const [showNewInvoicePicker, setShowNewInvoicePicker] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  useEffect(() => {
    saveCashierInvoices(invoices);
  }, [invoices]);
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [pickerViaScan, setPickerViaScan] = useState(false);
  const [pickerProduct, setPickerProduct] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [cartNumPad, setCartNumPad] = useState(null);
  const cartLongPressRef = React.useRef(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const checkoutBusyRef = React.useRef(false);
  const [fulfillment, setFulfillment] = useState("pickup");
  const [deliveryForm, setDeliveryForm] = useState({ area: "", phone: "", dispatchLocation: "" });
  const [phoneNumPadOpen, setPhoneNumPadOpen] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [confirmForm, setConfirmForm] = useState(EMPTY_CONFIRM_FORM);
  const [confirmError, setConfirmError] = useState("");
  const [lastSale, setLastSale] = useState(null);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [notFoundToast, setNotFoundToast] = useState(false);
  const [mergePrompt, setMergePrompt] = useState(null);
  const [priceDiffToast, setPriceDiffToast] = useState("");
  const [renamingCustomer, setRenamingCustomer] = useState(false);
  const pressTimerRef = React.useRef(null);
  const handleTabPressStart = (invId) => {
    pressTimerRef.current = setTimeout(() => {
      setActiveId(invId);
      setRenamingCustomer(true);
      pressTimerRef.current = null;
    }, 550);
  };
  const handleTabPressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };
  const [imageCache, setImageCache] = useState({});
  const [addedToast, setAddedToast] = useState("");
  const [historicalSales, setHistoricalSales] = useState([]);
  useEffect(() => {
    (async () => {
      const { start, end } = rangeToTimestamps("all");
      const result = await fetchSalesInRange(start, end);
      if (result) {
        setHistoricalSales(result);
        idbSet("cashier_history_cache", result);
      } else {
        const cached = await idbGet("cashier_history_cache");
        if (cached) setHistoricalSales(cached);
      }
    })();
  }, []);
  const [cancelPrompt, setCancelPrompt] = useState(null);
  const [undoItem, setUndoItem] = useState(null);
  const undoTimerRef = React.useRef(null);
  const activeInvoice = invoices.find((inv) => inv.id === activeId) || null;
  const aggregateSales = (() => {
    const byId = {};
    historicalSales.forEach((s) => {
      byId[s.id] = s;
    });
    sales.forEach((s) => {
      byId[s.id] = s;
    });
    return Object.values(byId);
  })();
  const customerNameOptions = [...new Set(aggregateSales.map((s) => s.customerName).filter(Boolean))];
  const customerTierMap = {};
  aggregateSales.forEach((s) => {
    if (s.customerName && s.tierKey) customerTierMap[s.customerName] = s.tierKey;
  });
  const salesCountByName = {};
  aggregateSales.forEach((s) => {
    s.items.forEach((it) => {
      salesCountByName[it.productName] = (salesCountByName[it.productName] || 0) + it.qty;
    });
  });
  const topProducts = Object.entries(salesCountByName).sort((a, b) => b[1] - a[1]).map(([name]) => products.find((p) => p.name === name)).filter(Boolean).filter((p) => !activeCategory || p.categoryId === activeCategory).slice(0, 8);
  const categoryProducts = activeCategory ? products.filter((p) => p.categoryId === activeCategory) : [];
  const normalizedQuery = normalizeArabic(query);
  const results = normalizedQuery ? products.filter((p) => normalizeArabic(p.name).includes(normalizedQuery)).slice(0, 12) : [];
  const total = activeInvoice ? activeInvoice.items.reduce((s, it) => s + it.lineTotal, 0) : 0;
  const cartProductIds = activeInvoice ? activeInvoice.items.map((it) => it.productId) : [];
  useEffect(() => {
    const visibleIds = [...results.map((p) => p.id), ...topProducts.map((p) => p.id), ...categoryProducts.map((p) => p.id), ...cartProductIds];
    const missing = [...new Set(visibleIds)].filter((id) => !(id in imageCache));
    if (missing.length === 0) return;
    batchGetImages(missing).then((map) => {
      setImageCache((c) => ({ ...c, ...Object.fromEntries(missing.map((id) => [id, map[id] || null])) }));
    });
  }, [results.map((p) => p.id).join(","), topProducts.map((p) => p.id).join(","), categoryProducts.map((p) => p.id).join(","), cartProductIds.join(",")]);
  const createInvoice = async (tierKey, customerName) => {
    setCreatingInvoice(true);
    const { number, updatedSettings } = await claimNextInvoiceNumber(invoiceNumberSettings);
    setInvoiceNumberSettings(updatedSettings);
    const inv = makeEmptyInvoice(tierKey, `\u0641\u0627\u062A\u0648\u0631\u0629 ${number}`, customerName, number);
    setInvoices((list) => [...list, inv]);
    setActiveId(inv.id);
    setShowNewInvoicePicker(false);
    setCreatingInvoice(false);
    playBeep("switch");
  };
  const updateActiveInvoice = (patch) => {
    setInvoices((list) => list.map((inv) => inv.id === activeId ? { ...inv, ...patch } : inv));
  };
  const handleSuppressWarning = (type) => {
    updateActiveInvoice(type === "red" ? { suppressRed: true } : { suppressYellow: true });
  };
  const finishAddOrScan = () => {
    setPickerProduct(null);
    setQuery("");
    if (pickerViaScan) {
      setPickerViaScan(false);
      setScanning(true);
    }
  };
  const commitNewItem = (payload) => {
    updateActiveInvoice({ items: [...activeInvoice.items, { id: uid(), ...payload }] });
    playBeep("add");
    setAddedToast(`\u2713 \u0627\u062A\u0636\u0627\u0641 ${payload.productName}`);
    setTimeout(() => setAddedToast(""), 1500);
    finishAddOrScan();
  };
  const addToCart = (payload) => {
    const existingIndex = activeInvoice.items.findIndex((it) => it.productId === payload.productId);
    if (existingIndex === -1) {
      commitNewItem(payload);
      return;
    }
    const existing = activeInvoice.items[existingIndex];
    if (existing.unitPrice === payload.unitPrice) {
      setMergePrompt({ existingItem: existing, payload });
    } else {
      setPriceDiffToast(`\u062A\u0646\u0628\u064A\u0647: "${payload.productName}" \u0645\u062A\u0633\u062C\u0644 \u0642\u0628\u0644 \u0643\u062F\u0647 \u0628\u0633\u0639\u0631 \u0645\u062E\u062A\u0644\u0641\u060C \u0627\u062A\u0633\u062C\u0644 \u0643\u0645\u0646\u062A\u062C \u0645\u0646\u0641\u0635\u0644`);
      setTimeout(() => setPriceDiffToast(""), 3e3);
      commitNewItem(payload);
    }
  };
  const confirmMerge = () => {
    const { existingItem: ex, payload } = mergePrompt;
    const newQty = ex.qty + payload.qty;
    updateActiveInvoice({
      items: activeInvoice.items.map((it) => it.id === ex.id ? { ...it, qty: newQty, lineTotal: it.unitPrice * newQty } : it)
    });
    setMergePrompt(null);
    finishAddOrScan();
  };
  const cancelMerge = () => {
    setMergePrompt(null);
    finishAddOrScan();
  };
  const updateCartItem = (itemId, payload) => {
    updateActiveInvoice({
      items: activeInvoice.items.map((it) => it.id === itemId ? { ...it, ...payload } : it)
    });
    setEditingItem(null);
  };
  const removeFromCart = (id) => {
    const item = activeInvoice.items.find((it) => it.id === id);
    updateActiveInvoice({ items: activeInvoice.items.filter((it) => it.id !== id) });
    if (item) {
      playBeep("remove");
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      setUndoItem({ item, invoiceId: activeInvoice.id });
      undoTimerRef.current = setTimeout(() => setUndoItem(null), 4e3);
    }
  };
  const undoRemove = () => {
    if (!undoItem) return;
    setInvoices((list) => list.map((inv) => inv.id === undoItem.invoiceId ? { ...inv, items: [...inv.items, undoItem.item] } : inv));
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoItem(null);
    playBeep("tap");
  };
  const setCartItemField = (id, field, rawValue) => {
    const num = parseNum(rawValue);
    if (field === "qty") {
      if (num === null || num <= 0) return "\u0627\u0643\u062A\u0628 \u0639\u062F\u062F \u0635\u062D\u064A\u062D";
    } else {
      if (num === null || num < 0) return "\u0627\u0643\u062A\u0628 \u0633\u0639\u0631 \u0635\u062D\u064A\u062D";
    }
    updateActiveInvoice({
      items: activeInvoice.items.map((it) => {
        if (it.id !== id) return it;
        const qty = field === "qty" ? num : it.qty;
        let unitPrice = field === "unitPrice" ? num : it.unitPrice;
        let priceNote = it.priceNote;
        if (field === "qty" && !it.priceOverridden) {
          const prod = products.find((p) => p.id === it.productId);
          if (prod) {
            const row = pickBestRowForQty(tierRows(prod[it.tierKey]), qty);
            unitPrice = row.price;
            priceNote = row.label;
          }
        }
        return { ...it, qty, unitPrice, priceNote, lineTotal: qty * unitPrice };
      })
    });
    playBeep("tap");
    return null;
  };
  const closeInvoice = (id) => {
    const remaining = invoices.filter((inv) => inv.id !== id);
    setInvoices(remaining);
    if (activeId === id) setActiveId(remaining.length ? remaining[0].id : null);
    setCancelPrompt(null);
  };
  const handleScanResult = (code) => {
    setScanning(false);
    const match = products.find((p) => p.barcodes && p.barcodes.includes(code) || p.barcode === code);
    if (match) {
      playBeep("scan");
      setPickerViaScan(true);
      setPickerProduct(match);
    } else {
      playBeep("error");
      setNotFoundToast(true);
      setTimeout(() => setNotFoundToast(false), 2500);
    }
  };
  const completeSale = () => {
    if (checkoutBusyRef.current) return;
    const err = validatePaymentMethod(confirmForm, total);
    if (err) {
      setConfirmError(err);
      playBeep("error");
      return;
    }
    checkoutBusyRef.current = true;
    setCheckoutBusy(true);
    const isSplit = confirmForm.paymentMethod === "split";
    const sale = {
      id: uid(),
      employeeName: user.name,
      customerName: activeInvoice.customerName || null,
      branchName: getTodayBranchName(attendance, user.name, branchSettings.branches),
      invoiceNumber: activeInvoice.invoiceNumber,
      tierKey: activeInvoice.tierKey,
      items: activeInvoice.items.map((it) => ({ productName: it.productName, unitPrice: it.unitPrice, qty: it.qty, lineTotal: it.lineTotal })),
      total,
      paid: true,
      fulfillment: "pickup",
      paymentMethod: confirmForm.paymentMethod,
      splitTransferMethod: isSplit ? confirmForm.splitTransferMethod : null,
      cashAmount: isSplit ? parseNum(confirmForm.cashAmount) : null,
      transferAmount: isSplit ? parseNum(confirmForm.transferAmount) : null,
      createdAt: Date.now()
    };
    setSales((s) => [...s, sale]);
    playBeep("success");
    salesStore.upsert(sale);
    incrementDailyAggregate(businessDayOf(sale.createdAt), sale.branchName, "salesTotal", sale.total);
    incrementDailyAggregate(businessDayOf(sale.createdAt), sale.branchName, "salesCount", 1);
    setLastSale(sale);
    const closedId = activeId;
    const remaining = invoices.filter((inv) => inv.id !== closedId);
    setInvoices(remaining);
    setActiveId(remaining.length ? remaining[0].id : null);
    setShowCheckout(false);
    setConfirmForm(EMPTY_CONFIRM_FORM);
    setConfirmError("");
    setFulfillment("pickup");
    setDeliveryForm({ area: "", phone: "", dispatchLocation: "" });
    setDeliveryError("");
    setQuery("");
  };
  const completeDeliveryOrder = () => {
    if (checkoutBusyRef.current) return;
    if (!deliveryForm.area.trim()) {
      setDeliveryError("\u0627\u0643\u062A\u0628 \u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0645\u062D\u0644");
      return;
    }
    const phoneErr = validateEgyptPhone(deliveryForm.phone);
    if (phoneErr) {
      setDeliveryError(phoneErr);
      return;
    }
    checkoutBusyRef.current = true;
    setCheckoutBusy(true);
    const sale = {
      id: uid(),
      employeeName: user.name,
      customerName: activeInvoice.customerName || null,
      branchName: getTodayBranchName(attendance, user.name, branchSettings.branches),
      invoiceNumber: activeInvoice.invoiceNumber,
      tierKey: activeInvoice.tierKey,
      items: activeInvoice.items.map((it) => ({ productName: it.productName, unitPrice: it.unitPrice, qty: it.qty, lineTotal: it.lineTotal })),
      total,
      paid: false,
      fulfillment: "delivery",
      deliveryStatus: "prepared",
      deliveryArea: deliveryForm.area.trim(),
      customerPhone: toEnglishDigits(deliveryForm.phone).replace(/[^\d]/g, ""),
      dispatchLocation: deliveryForm.dispatchLocation || null,
      repName: null,
      paymentMethod: null,
      preparedAt: Date.now(),
      createdAt: Date.now()
    };
    setSales((s) => [...s, sale]);
    playBeep("success");
    salesStore.upsert(sale);
    setLastSale(sale);
    const closedId = activeId;
    const remaining = invoices.filter((inv) => inv.id !== closedId);
    setInvoices(remaining);
    setActiveId(remaining.length ? remaining[0].id : null);
    setShowCheckout(false);
    setConfirmForm(EMPTY_CONFIRM_FORM);
    setConfirmError("");
    setFulfillment("pickup");
    setDeliveryForm({ area: "", phone: "", dispatchLocation: "" });
    setDeliveryError("");
    setQuery("");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0627\u0644\u0643\u0627\u0634\u064A\u0631", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg lg:max-w-6xl mx-auto px-4 py-2 fade-up pb-6 lg:grid lg:grid-cols-[14rem_28rem_14rem] lg:justify-center lg:gap-6 lg:items-start" }, /* @__PURE__ */ React.createElement("div", { className: "hidden lg:flex lg:flex-col lg:gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowNewInvoicePicker(true), className: "icon-btn rounded-xl px-3 py-2.5 flex items-center justify-center gap-1.5 font-bold" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 15 }), " \u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ React.createElement("button", { onClick: () => setView("returns"), className: "icon-btn rounded-xl px-3 py-2.5 flex items-center justify-center gap-1.5 font-bold text-rose-400" }, /* @__PURE__ */ React.createElement(Icon, { name: "RotateCcw", size: 15 }), " \u0645\u0631\u062A\u062C\u0639")), /* @__PURE__ */ React.createElement("div", { className: "lg:w-full" }, usingCachedProducts && /* @__PURE__ */ React.createElement("div", { className: "bg-amber-950/40 border border-amber-800 rounded-xl px-3 py-2 mb-3 text-xs text-amber-300 font-bold text-center" }, "\u{1F4F4} \u0645\u0641\u064A\u0634 \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A \u2014 \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u062F\u064A \u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u0627\u0644\u0641\u0648\u0646"), productsLoading && products.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement(SkeletonRows, { count: 5, height: 60 })), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 overflow-x-auto mb-4 pb-1" }, invoices.map((inv) => /* @__PURE__ */ React.createElement("div", { key: inv.id, className: `shrink-0 rounded-xl flex items-center ${activeId === inv.id ? "btn-sky" : "btn-ghost"}` }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setActiveId(inv.id);
        playBeep("switch");
      },
      onTouchStart: () => handleTabPressStart(inv.id),
      onTouchEnd: handleTabPressEnd,
      onMouseDown: () => handleTabPressStart(inv.id),
      onMouseUp: handleTabPressEnd,
      onMouseLeave: handleTabPressEnd,
      className: "pr-3 pl-1.5 py-2 text-xs font-bold"
    },
    inv.customerName || inv.label
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => setCancelPrompt(inv.id), className: "pl-2 pr-1.5 py-2 opacity-70" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 13 })))), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowNewInvoicePicker(true), className: "lg:hidden shrink-0 icon-btn rounded-xl px-3 py-2 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 15 }), " \u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ React.createElement("button", { onClick: () => setView("returns"), className: "lg:hidden shrink-0 icon-btn rounded-xl px-3 py-2 flex items-center gap-1 text-rose-400" }, /* @__PURE__ */ React.createElement(Icon, { name: "RotateCcw", size: 15 }), " \u0645\u0631\u062A\u062C\u0639")), !activeInvoice && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-10 text-sm" }, "\u0627\u0641\u062A\u062D \u0641\u0627\u062A\u0648\u0631\u0629 \u062C\u062F\u064A\u062F\u0629 \u0639\u0634\u0627\u0646 \u062A\u0628\u062F\u0623 \u0627\u0644\u0628\u064A\u0639"), activeInvoice && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Search", size: 16, className: "absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B] pointer-events-none" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: query,
      onChange: (e) => setQuery(e.target.value),
      placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0645\u0646\u062A\u062C \u062A\u0636\u064A\u0641\u0647...",
      className: "field-input w-full rounded-xl pr-9 pl-9 py-2.5 text-sm"
    }
  ), query && /* @__PURE__ */ React.createElement("button", { onClick: () => setQuery(""), className: "absolute top-1/2 -translate-y-1/2 left-3 text-[#64748B]" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 15 }))), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-sky-400 shrink-0" }, "#", activeInvoice.invoiceNumber ?? "?"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPickerViaScan(true);
    setScanning(true);
  }, className: "icon-btn rounded-xl px-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "ScanLine", size: 18 }))), categories.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 overflow-x-auto mb-4 pb-1" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setActiveCategory(null),
      className: `shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold ${!activeCategory ? "btn-emerald" : "btn-ghost"}`
    },
    "\u0627\u0644\u0643\u0644"
  ), categories.map((c) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: c.id,
      onClick: () => setActiveCategory(activeCategory === c.id ? null : c.id),
      className: `shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold ${activeCategory === c.id ? "btn-emerald" : "btn-ghost"}`
    },
    c.name
  ))), activeCategory && !query && /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u0645\u0646\u062A\u062C\u0627\u062A ", categories.find((c) => c.id === activeCategory)?.name || "", " (", categoryProducts.length, ")"), categoryProducts.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-6 text-sm" }, "\u0645\u0641\u064A\u0634 \u0645\u0646\u062A\u062C\u0627\u062A \u0641\u064A \u0627\u0644\u062A\u0635\u0646\u064A\u0641 \u062F\u0647") : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2" }, categoryProducts.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.id,
      onClick: () => {
        setPickerViaScan(false);
        setPickerProduct(p);
      },
      className: "panel rounded-xl p-2 flex flex-col items-center gap-1.5 text-center"
    },
    /* @__PURE__ */ React.createElement("span", { className: "w-14 h-14 rounded-lg overflow-hidden bg-black/25 flex items-center justify-center shrink-0" }, imageCache[p.id] ? /* @__PURE__ */ React.createElement("img", { src: imageCache[p.id], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ React.createElement(Icon, { name: "Store", size: 20, className: "text-[#475569]" })),
    /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-white leading-tight line-clamp-2" }, p.name)
  )))), results.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4" }, results.map((p) => /* @__PURE__ */ React.createElement("button", { key: p.id, onClick: () => {
    setPickerViaScan(false);
    setPickerProduct(p);
  }, className: "panel rounded-xl p-3 w-full text-right flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement("span", { className: "w-9 h-9 rounded-lg overflow-hidden bg-black/25 flex items-center justify-center shrink-0" }, imageCache[p.id] ? /* @__PURE__ */ React.createElement("img", { src: imageCache[p.id], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ React.createElement(Icon, { name: "Store", size: 16, className: "text-[#475569]" })), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm text-white" }, p.name)), /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 16, className: "text-emerald-400" })))), query && results.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-6 mb-4" }, /* @__PURE__ */ React.createElement(Icon, { name: "Search", size: 22, className: "text-[#475569] mx-auto mb-2" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#64748B]" }, "\u0645\u0641\u064A\u0634 \u0645\u0646\u062A\u062C \u0628\u0627\u0644\u0627\u0633\u0645 \u062F\u0647")), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-sm text-white mb-2" }, "\u0627\u0644\u0633\u0644\u0629"), activeInvoice.items.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0627\u0644\u0633\u0644\u0629 \u0641\u0627\u0636\u064A\u0629\u060C \u062F\u0648\u0651\u0631 \u0639\u0644\u0649 \u0645\u0646\u062A\u062C \u0641\u0648\u0642"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4" }, activeInvoice.items.map((it) => /* @__PURE__ */ React.createElement("div", { key: it.id, className: "panel rounded-xl p-3 flex items-stretch gap-3" }, /* @__PURE__ */ React.createElement(CartThumb, { src: imageCache[it.productId] }), /* @__PURE__ */ React.createElement("div", { className: "w-px bg-white/10 self-stretch shrink-0" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2 mb-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditingItem(it), className: "text-center flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-sm text-white truncate" }, it.productName)), /* @__PURE__ */ React.createElement("button", { onClick: () => removeFromCart(it.id), className: "text-rose-400 shrink-0 p-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-xs text-[#94A3B8] pt-2 border-t border-white/5" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onTouchStart: () => {
        cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "qty", value: String(it.qty) }), 2e3);
      },
      onTouchEnd: () => clearTimeout(cartLongPressRef.current),
      onMouseDown: () => {
        cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "qty", value: String(it.qty) }), 2e3);
      },
      onMouseUp: () => clearTimeout(cartLongPressRef.current),
      onMouseLeave: () => clearTimeout(cartLongPressRef.current),
      className: "flex-1 text-center"
    },
    /* @__PURE__ */ React.createElement("span", { className: "block text-[10px] text-[#64748B]" }, "\u0627\u0644\u0643\u0645\u064A\u0629"),
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white tabular-nums" }, it.qty)
  ), /* @__PURE__ */ React.createElement("div", { className: "w-px h-7 bg-white/10 shrink-0" }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onTouchStart: () => {
        cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "unitPrice", value: String(it.unitPrice) }), 2e3);
      },
      onTouchEnd: () => clearTimeout(cartLongPressRef.current),
      onMouseDown: () => {
        cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "unitPrice", value: String(it.unitPrice) }), 2e3);
      },
      onMouseUp: () => clearTimeout(cartLongPressRef.current),
      onMouseLeave: () => clearTimeout(cartLongPressRef.current),
      className: "flex-1 text-center"
    },
    /* @__PURE__ */ React.createElement("span", { className: "block text-[10px] text-[#64748B]" }, "\u0633\u0639\u0631 \u0627\u0644\u0642\u0637\u0639\u0629"),
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white tabular-nums" }, it.unitPrice)
  ), /* @__PURE__ */ React.createElement("div", { className: "w-px h-7 bg-white/10 shrink-0" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 text-center" }, /* @__PURE__ */ React.createElement("span", { className: "block text-[10px] text-[#64748B]" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 tabular-nums" }, it.lineTotal))))))), /* @__PURE__ */ React.createElement("div", { className: "sticky bottom-3 z-10 mt-2" }, activeInvoice.items.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 flex items-center justify-between mb-2 shadow-2xl" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-[#94A3B8]" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-xl text-sky-400 tabular-nums" }, total)), /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: activeInvoice.items.length === 0,
      onClick: () => {
        checkoutBusyRef.current = false;
        setCheckoutBusy(false);
        setShowCheckout(true);
      },
      className: "btn-emerald w-full rounded-xl py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-40 shadow-xl"
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 18 }),
    " \u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0628\u064A\u0639"
  )))), activeInvoice && !query && topProducts.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "hidden lg:block" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, activeCategory ? `\u0627\u0644\u0623\u0643\u062A\u0631 \u0645\u0628\u064A\u0639\u064B\u0627 \u0641\u064A ${categories.find((c) => c.id === activeCategory)?.name || ""}` : "\u0627\u0644\u0623\u0643\u062A\u0631 \u0645\u0628\u064A\u0639\u064B\u0627"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, topProducts.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.id,
      onClick: () => {
        setPickerViaScan(false);
        setPickerProduct(p);
      },
      className: "panel rounded-xl p-2.5 text-right flex items-center gap-2.5 w-full"
    },
    /* @__PURE__ */ React.createElement("span", { className: "w-10 h-10 rounded-lg overflow-hidden bg-black/25 flex items-center justify-center shrink-0" }, imageCache[p.id] ? /* @__PURE__ */ React.createElement("img", { src: imageCache[p.id], alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ React.createElement(Icon, { name: "Store", size: 18, className: "text-[#475569]" })),
    /* @__PURE__ */ React.createElement("span", { className: "min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-xs text-white truncate" }, p.name), /* @__PURE__ */ React.createElement("span", { className: "block font-bold text-sm text-emerald-400 tabular-nums mt-0.5" }, tierBase(p[activeInvoice.tierKey])))
  )))), showNewInvoicePicker && /* @__PURE__ */ React.createElement(NewInvoiceTierModal, { customerNameOptions, customerTierMap, tierSettings, busy: creatingInvoice, onCreate: createInvoice, onClose: () => setShowNewInvoicePicker(false) }), pickerProduct && activeInvoice && !mergePrompt && /* @__PURE__ */ React.createElement(
    ProductPickerModal,
    {
      product: pickerProduct,
      invoice: activeInvoice,
      tierSettings,
      user,
      onAdd: addToCart,
      onSuppressWarning: handleSuppressWarning,
      onClose: () => {
        setPickerProduct(null);
        setPickerViaScan(false);
      }
    }
  ), editingItem && activeInvoice && /* @__PURE__ */ React.createElement(
    ProductPickerModal,
    {
      product: products.find((p) => p.id === editingItem.productId) || { name: editingItem.productName, ...Object.fromEntries(activeTiers(tierSettings).map((t) => [t.id, []])) },
      invoice: activeInvoice,
      existingItem: editingItem,
      tierSettings,
      user,
      onUpdate: updateCartItem,
      onSuppressWarning: handleSuppressWarning,
      onClose: () => setEditingItem(null)
    }
  ), cartNumPad && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: cartNumPad.field === "qty" ? "\u0627\u0644\u0643\u0645\u064A\u0629" : "\u0633\u0639\u0631 \u0627\u0644\u0642\u0637\u0639\u0629",
      initialValue: cartNumPad.value,
      error: cartNumPad.error,
      onConfirm: (val) => {
        const err = setCartItemField(cartNumPad.id, cartNumPad.field, val);
        if (err) setCartNumPad({ ...cartNumPad, error: err });
        else setCartNumPad(null);
      },
      onClose: () => setCartNumPad(null)
    }
  ), scanning && /* @__PURE__ */ React.createElement(BarcodeScannerModal, { onDetected: handleScanResult, onClose: () => {
    setScanning(false);
    setPickerViaScan(false);
  } }), renamingCustomer && activeInvoice && /* @__PURE__ */ React.createElement(
    RenameCustomerModal,
    {
      initialName: activeInvoice.customerName,
      customerNameOptions,
      onSave: (name) => {
        const patch = { customerName: name };
        const knownTier = customerTierMap[name.trim()];
        if (knownTier && activeTiers(tierSettings).some((t) => t.id === knownTier)) {
          patch.tierKey = knownTier;
        }
        updateActiveInvoice(patch);
        setRenamingCustomer(false);
      },
      onClose: () => setRenamingCustomer(false)
    }
  ), mergePrompt && /* @__PURE__ */ React.createElement(Modal, { title: "\u0627\u0644\u0645\u0646\u062A\u062C \u062F\u0647 \u0645\u062A\u0633\u062C\u0644 \u0628\u0627\u0644\u0641\u0639\u0644", accent: "#0EA5E9", onClose: cancelMerge }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, '"', mergePrompt.payload.productName, '" \u0645\u0648\u062C\u0648\u062F \u0628\u0627\u0644\u0641\u0639\u0644 \u0641\u064A \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u062F\u064A \u0628\u0646\u0641\u0633 \u0627\u0644\u0633\u0639\u0631 (\u0627\u0644\u0643\u0645\u064A\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629: ', mergePrompt.existingItem.qty, "). \u0639\u0627\u064A\u0632 \u062A\u0632\u0648\u0651\u062F \u0627\u0644\u0643\u0645\u064A\u0629 \u0639\u0644\u064A\u0647\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: confirmMerge, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0623\u064A\u0648\u0647\u060C \u0632\u0648\u0651\u062F \u0627\u0644\u0643\u0645\u064A\u0629"), /* @__PURE__ */ React.createElement("button", { onClick: cancelMerge, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0644\u0623"))), notFoundToast && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in text-xs text-rose-300 font-bold" }, "\u0645\u0641\u064A\u0634 \u0645\u0646\u062A\u062C \u0628\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u062F\u0647")), priceDiffToast && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-amber-950/90 border border-amber-700 rounded-xl px-4 py-2 toast-in text-xs text-amber-300 font-bold text-center" }, priceDiffToast)), addedToast && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-950/90 border border-emerald-700 rounded-xl px-4 py-2 toast-in text-xs text-emerald-300 font-bold" }, addedToast)), undoItem && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#22252C] border border-white/10 rounded-xl px-4 py-2 toast-in text-xs text-white font-bold flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", null, '\u0627\u062A\u0634\u0627\u0644 "', undoItem.item.productName, '"'), /* @__PURE__ */ React.createElement("button", { onClick: undoRemove, className: "text-sky-400 font-bold" }, "\u062A\u0631\u0627\u062C\u0639"))), cancelPrompt && /* @__PURE__ */ React.createElement(Modal, { title: "\u0625\u0644\u063A\u0627\u0621 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629", accent: "#EF4444", onClose: () => setCancelPrompt(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0647\u062A\u062A\u0645\u0633\u062D \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u062F\u064A \u0628\u0643\u0644 \u0627\u0644\u0644\u064A \u0641\u064A\u0647\u0627 \u0648\u0645\u0634 \u0647\u062A\u0642\u062F\u0631 \u062A\u0631\u062C\u0639\u0647\u0627. \u0645\u062A\u0623\u0643\u062F\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => closeInvoice(cancelPrompt), className: "flex-1 rounded-xl py-2 text-sm font-bold bg-rose-600 text-white" }, "\u0623\u064A\u0648\u0647\u060C \u0627\u0645\u0633\u062D\u0647\u0627"), /* @__PURE__ */ React.createElement("button", { onClick: () => setCancelPrompt(null), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0631\u062C\u0648\u0639"))), showCheckout && /* @__PURE__ */ React.createElement(Modal, { title: "\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0628\u064A\u0639", accent: "#10B981", onClose: () => setShowCheckout(false) }, /* @__PURE__ */ React.createElement("p", { className: "text-center text-2xl font-bold text-white mb-4 tabular-nums" }, total), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setFulfillment("pickup"), className: `flex-1 rounded-xl py-2.5 text-sm font-bold ${fulfillment === "pickup" ? "btn-emerald" : "btn-ghost"}` }, "\u0627\u0633\u062A\u0644\u0627\u0645"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFulfillment("delivery"), className: `flex-1 rounded-xl py-2.5 text-sm font-bold ${fulfillment === "delivery" ? "btn-sky" : "btn-ghost"}` }, "\u062F\u0644\u064A\u0641\u0631\u064A")), fulfillment === "pickup" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(PaymentMethodPicker, { value: confirmForm, onChange: setConfirmForm }), confirmError && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, confirmError), /* @__PURE__ */ React.createElement("button", { onClick: completeSale, disabled: checkoutBusy, className: "btn-emerald w-full rounded-xl py-2.5 font-bold disabled:opacity-40 flex items-center justify-center gap-2" }, checkoutBusy && /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }), checkoutBusy ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062D\u0641\u0638..." : "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0628\u064A\u0639")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(TextField, { label: "\u0627\u0644\u0645\u0646\u0637\u0642\u0629 \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0645\u062D\u0644", icon: "MapPin", value: deliveryForm.area, onChange: (e) => setDeliveryForm({ ...deliveryForm, area: e.target.value }), placeholder: "\u0645\u062B\u0627\u0644: \u0627\u0644\u0645\u0647\u0646\u062F\u0633\u064A\u0646" }), /* @__PURE__ */ React.createElement("label", { className: "block mb-4 text-right" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-sm font-medium text-[#94A3B8]" }, "\u0631\u0642\u0645 \u062A\u0644\u064A\u0641\u0648\u0646 \u0627\u0644\u0632\u0628\u0648\u0646"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setPhoneNumPadOpen(true), className: "field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px] text-right", style: { color: deliveryForm.phone ? void 0 : "#64748B" } }, deliveryForm.phone || "01xxxxxxxxx"), /* @__PURE__ */ React.createElement(Icon, { name: "Smartphone", size: 18, className: "absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B]" }))), phoneNumPadOpen && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: "\u0631\u0642\u0645 \u062A\u0644\u064A\u0641\u0648\u0646 \u0627\u0644\u0632\u0628\u0648\u0646",
      initialValue: deliveryForm.phone,
      onConfirm: (val) => {
        setDeliveryForm({ ...deliveryForm, phone: val });
        setPhoneNumPadOpen(false);
      },
      onClose: () => setPhoneNumPadOpen(false)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C (\u0627\u062E\u062A\u064A\u0627\u0631\u064A \u062F\u0644\u0648\u0642\u062A\u064A)"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, branchSettings.branches.map((b) => /* @__PURE__ */ React.createElement("button", { key: b.id, onClick: () => setDeliveryForm({ ...deliveryForm, dispatchLocation: deliveryForm.dispatchLocation === b.name ? "" : b.name }), className: `toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${deliveryForm.dispatchLocation === b.name ? "active-sky" : ""}` }, b.name)))), deliveryError && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, deliveryError), /* @__PURE__ */ React.createElement("button", { onClick: completeDeliveryOrder, disabled: checkoutBusy, className: "btn-sky w-full rounded-xl py-2.5 font-bold disabled:opacity-40 flex items-center justify-center gap-2" }, checkoutBusy && /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }), checkoutBusy ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062D\u0641\u0638..." : "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0623\u0648\u0631\u062F\u0631"))), lastSale && /* @__PURE__ */ React.createElement(Modal, { title: lastSale.fulfillment === "delivery" ? "\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0623\u0648\u0631\u062F\u0631" : "\u062A\u0645 \u0627\u0644\u0628\u064A\u0639 \u0628\u0646\u062C\u0627\u062D", accent: "#34D399", onClose: () => setLastSale(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 tabular-nums" }, lastSale.total)), lastSale.fulfillment === "delivery" && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-4" }, '\u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0628\u062D\u0627\u0644\u0629 "\u062A\u0645 \u0627\u0644\u062A\u062C\u0647\u064A\u0632" \u2014 \u062A\u0644\u0627\u0642\u064A\u0647 \u0641\u064A \u0642\u0633\u0645 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0644\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644.'), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowReceiptPreview(true), className: "btn-sky w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "Printer", size: 16 }), " \u0645\u0639\u0627\u064A\u0646\u0629 \u0648\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629"), /* @__PURE__ */ React.createElement("button", { onClick: () => setLastSale(null), className: "btn-ghost w-full rounded-xl py-2.5 font-bold" }, "\u0625\u063A\u0644\u0627\u0642")), showReceiptPreview && lastSale && /* @__PURE__ */ React.createElement(SaleReceiptPreview, { sale: lastSale, onClose: () => setShowReceiptPreview(false) })));
}
function makeEmptyRow() {
  return { id: uid(), label: "", price: "" };
}
function makeEmptyNewProduct(tiers) {
  return {
    name: "",
    image: null,
    barcodes: [""],
    costPrice: "",
    categoryId: null,
    priceRows: Object.fromEntries(tiers.map((t) => [t.id, [makeEmptyRow()]]))
  };
}
function PricesScreen({ user, products, setProducts, productsLoading, changedToday, setChangedToday, categories, setCategories, tierSettings, usingCachedProducts, setUsingCachedProducts, branchSettings, setView }) {
  const canEditPrices = userIsAdmin(user) || !!user.permissions?.editPrices;
  const canManageProducts = userIsAdmin(user) || !!user.permissions?.manageProducts;
  const canDeleteProducts = userIsAdmin(user) || !!user.permissions?.deleteProducts;
  const isAdmin = userIsAdmin(user);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({});
  const [editError, setEditError] = useState("");
  const [newProd, setNewProd] = useState(() => makeEmptyNewProduct(activeTiers(tierSettings)));
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
  const [deletePrompt, setDeletePrompt] = useState(null);
  const [costPriceNumPadOpen, setCostPriceNumPadOpen] = useState(false);
  const [newCostPriceNumPadOpen, setNewCostPriceNumPadOpen] = useState(false);
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
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [normalizedQuery, categoryFilter]);
  const [imageCache, setImageCache] = useState({});
  const visibleIdsKey = visibleProducts.map((p) => p.id).join(",");
  useEffect(() => {
    const idsNeeded = visibleProducts.filter((p) => !p.image && imageCache[p.id] === void 0).map((p) => p.id);
    if (!idsNeeded.length) return;
    let cancelled = false;
    (async () => {
      const fetched = await batchGetImages(idsNeeded);
      if (cancelled) return;
      const filled = {};
      idsNeeded.forEach((id) => {
        filled[id] = fetched[id] ?? null;
      });
      setImageCache((c) => ({ ...c, ...filled }));
    })();
    return () => {
      cancelled = true;
    };
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
      resolved: false
    };
    stockAlertsStore.upsert(alert);
    setOutOfStockProduct(null);
    showToast("\u062A\u0645 \u0625\u0628\u0644\u0627\u063A \u0627\u0644\u0623\u062F\u0645\u0646 \u0625\u0646 \u0627\u0644\u0645\u0646\u062A\u062C \u062E\u0644\u0635");
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
      resolved: false
    };
    stockAlertsStore.upsert(alert);
    setMissingProductName("");
    setShowMissingProduct(false);
    showToast("\u062A\u0645 \u0625\u0628\u0644\u0627\u063A \u0627\u0644\u0623\u062F\u0645\u0646 \u0628\u0627\u0644\u0645\u0646\u062A\u062C \u0627\u0644\u0645\u0637\u0644\u0648\u0628");
  };
  const [notFoundBarcode, setNotFoundBarcode] = useState(null);
  const [continueScanAfterAdd, setContinueScanAfterAdd] = useState(false);
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
      const match = products.find((p) => p.barcodes && p.barcodes.includes(code) || p.barcode === code);
      if (match) {
        setQuery(match.name);
        showToast(`\u0644\u0642\u064A\u0646\u0627: ${match.name}`);
      } else {
        setNotFoundBarcode(code);
      }
    }
    setScannerTarget(null);
  };
  const addProductFromNotFoundBarcode = () => {
    setNewProd({ ...makeEmptyNewProduct(activeTiers(tierSettings)), barcodes: [notFoundBarcode] });
    setContinueScanAfterAdd(true);
    setShowAdd(true);
    setNotFoundBarcode(null);
  };
  const handleRefresh = async () => {
    const cached = await idbGet("products_cache");
    const localVersions = cached?.versions || {};
    const result = await syncProducts(products, localVersions);
    if (result) {
      setProducts(result.products);
      setUsingCachedProducts(false);
      idbSet("products_cache", result);
    }
    return !!result;
  };
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
    showToast("\u062A\u0645 \u062A\u0631\u062D\u064A\u0644 \u0627\u0644\u0635\u0648\u0631\u060C \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0647\u064A\u0641\u062A\u062D \u0623\u0633\u0631\u0639 \u0628\u0643\u062A\u064A\u0631 \u0645\u0646 \u0627\u0644\u0645\u0631\u0629 \u0627\u0644\u062C\u0627\u064A\u0629");
  };
  const toEditRows = (arr) => {
    const rows = tierRows(arr);
    return rows.map((r) => ({ id: uid(), label: r.label || "", price: r.price === "" || r.price === null ? "" : String(r.price) }));
  };
  const startEdit = (p) => {
    setEditingId(p.id);
    setEditError("");
    const existingBarcodes = p.barcodes && p.barcodes.length ? p.barcodes : p.barcode ? [p.barcode] : [""];
    const priceRows = Object.fromEntries(activeTiers(tierSettings).map((t) => [t.id, toEditRows(p[t.id])]));
    setDraft({ priceRows, costPrice: p.costPrice ?? "", barcodes: existingBarcodes });
  };
  const validateRows = (rows) => {
    for (const r of rows) {
      if (parseNum(r.price) === null) return "\u0627\u0643\u062A\u0628 \u0623\u0633\u0639\u0627\u0631 \u0635\u062D\u064A\u062D\u0629 \u0641\u064A \u0643\u0644 \u0627\u0644\u062E\u0627\u0646\u0627\u062A";
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
    for (const tier of activeTiers(tierSettings)) {
      const rowsErr = validateRows(draft.priceRows[tier.id]);
      if (rowsErr) {
        setEditError(rowsErr);
        return;
      }
    }
    const err = validateTierPrices(activeTiers(tierSettings).map((t) => parseNum(draft.priceRows[t.id][0].price)));
    if (err) {
      setEditError(err);
      return;
    }
    const tierFields = Object.fromEntries(activeTiers(tierSettings).map((t) => [t.id, toStoredRows(draft.priceRows[t.id])]));
    const updated = {
      ...p,
      ...tierFields,
      barcodes: cleanBarcodes(draft.barcodes),
      updatedAt: Date.now()
    };
    if (isAdmin) updated.costPrice = draft.costPrice !== "" ? parseNum(draft.costPrice) : null;
    setProducts(products.map((x) => x.id === p.id ? updated : x));
    productsStore.upsert(stripImage(updated));
    bumpProductVersion(p.id);
    logChange(p.id, p.name);
    setEditingId(null);
    setEditError("");
  };
  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    productsStore.remove(id);
    productImagesStore.remove(id);
    dropProductVersion(id);
  };
  const pickExistingProductImage = async (p, file) => {
    try {
      const dataUrl = await resizeImageFile(file);
      const updated = { ...p, image: dataUrl };
      setProducts(products.map((x) => x.id === p.id ? updated : x));
      setImageCache((c) => ({ ...c, [p.id]: dataUrl }));
      productImagesStore.upsert({ id: p.id, image: dataUrl });
    } catch {
    }
  };
  const pickNewProductImage = async (file) => {
    try {
      const dataUrl = await resizeImageFile(file);
      setNewProd((v) => ({ ...v, image: dataUrl }));
    } catch {
      setAddError("\u062A\u0639\u0630\u0631 \u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0635\u0648\u0631\u0629\u060C \u062C\u0631\u0628 \u0635\u0648\u0631\u0629 \u062A\u0627\u0646\u064A\u0629");
    }
  };
  const validateNewProduct = () => {
    if (!newProd.name.trim()) return "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C";
    for (const tier of activeTiers(tierSettings)) {
      const rowsErr = validateRows(newProd.priceRows[tier.id]);
      if (rowsErr) return rowsErr;
    }
    return validateTierPrices(activeTiers(tierSettings).map((t) => parseNum(newProd.priceRows[t.id][0].price)));
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
    const tierFields = Object.fromEntries(activeTiers(tierSettings).map((t) => [t.id, toStoredRows(newProd.priceRows[t.id])]));
    const costPrice = isAdmin && newProd.costPrice !== "" ? parseNum(newProd.costPrice) : null;
    if (overwriteId) {
      const existing = products.find((p) => p.id === overwriteId);
      const image = newProd.image || existing.image || null;
      const updated = { ...existing, name: newProd.name.trim(), ...tierFields, image, barcodes: cleanBarcodes(newProd.barcodes), categoryId: newProd.categoryId, updatedAt: Date.now(), ...isAdmin ? { costPrice } : {} };
      setProducts(products.map((p) => p.id === overwriteId ? updated : p));
      productsStore.upsert(stripImage(updated));
      bumpProductVersion(overwriteId);
      if (newProd.image) {
        setImageCache((c) => ({ ...c, [overwriteId]: newProd.image }));
        productImagesStore.upsert({ id: overwriteId, image: newProd.image });
      }
      logChange(overwriteId, updated.name);
    } else {
      const newId = uid();
      const newProduct = { id: newId, name: newProd.name.trim(), ...tierFields, image: newProd.image || null, barcodes: cleanBarcodes(newProd.barcodes), costPrice, categoryId: newProd.categoryId, createdAt: Date.now(), updatedAt: Date.now() };
      setProducts([...products, newProduct]);
      productsStore.upsert(stripImage(newProduct));
      bumpProductVersion(newId);
      if (newProd.image) {
        setImageCache((c) => ({ ...c, [newId]: newProd.image }));
        productImagesStore.upsert({ id: newId, image: newProd.image });
      }
      logChange(newId, newProduct.name);
    }
    setNewProd(makeEmptyNewProduct(activeTiers(tierSettings)));
    setAddError("");
    setDuplicateMatch(null);
    setShowAdd(false);
    if (continueScanAfterAdd) {
      setContinueScanAfterAdd(false);
      setScannerTarget({ mode: "lookup" });
    }
  };
  const { msg: reportMsg, count: reportCount } = buildWhatsAppMessage(changedToday, products, activeTiers(tierSettings));
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(reportMsg)}`;
  const handleSendReportClick = (e) => {
    if (reportCount === 0) {
      e.preventDefault();
      showToast("\u0645\u0641\u064A\u0634 \u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0646\u0647\u0627\u0631\u062F\u0647 \u0644\u0633\u0647");
      return;
    }
    setShowClearConfirm(true);
  };
  const clearChangeLog = () => {
    changedToday.forEach((c) => changesStore.remove(c.id));
    setChangedToday([]);
  };
  const canSeeReportButton = canEditPrices || canManageProducts;
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(PullToRefresh, { onRefresh: handleRefresh }), /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0645\u062D\u0644", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up" }, usingCachedProducts && /* @__PURE__ */ React.createElement("div", { className: "bg-amber-950/40 border border-amber-800 rounded-xl px-3 py-2 mb-3 text-xs text-amber-300 font-bold text-center" }, "\u{1F4F4} \u0645\u0641\u064A\u0634 \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A \u2014 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u062F\u064A \u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u0627\u0644\u0641\u0648\u0646"), canSeeReportButton && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3" }, /* @__PURE__ */ React.createElement("a", { href: whatsappHref, target: "_blank", rel: "noopener noreferrer", onClick: handleSendReportClick, className: "btn-whatsapp flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 no-underline" }, /* @__PURE__ */ React.createElement(Icon, { name: "MessageCircle", size: 18 }), " \u0625\u0631\u0633\u0627\u0644 \u062A\u0642\u0631\u064A\u0631 \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0644\u0644\u0648\u0627\u062A\u0633\u0627\u0628", /* @__PURE__ */ React.createElement("span", { className: "bg-black/25 px-2 py-0.5 rounded-full text-xs" }, changedToday.length)), changedToday.length > 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => setShowManualReset(true), title: "\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0639\u062F\u0627\u062F", className: "icon-btn rounded-xl px-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "RotateCcw", size: 18 }))), toast && /* @__PURE__ */ React.createElement("div", { className: "toast-in text-xs text-center text-[#CBD5E1] bg-black/30 border border-white/10 rounded-xl px-3 py-2 mb-3" }, toast), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0645\u0646\u062A\u062C... (\u0639\u0631\u0628\u064A \u0623\u0648 English)", className: "field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px]" }), /* @__PURE__ */ React.createElement(Icon, { name: "Search", size: 18, className: "absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setScannerTarget({ mode: "lookup" }), title: "\u0627\u0645\u0633\u062D \u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F", className: "icon-btn rounded-xl px-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "ScanLine", size: 18 }))), isAdmin && legacyImageProducts.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "panel rounded-xl p-3 mb-3 border border-amber-500/30 bg-amber-500/5" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-300 font-bold mb-1.5" }, "\u062A\u062D\u0633\u064A\u0646 \u0627\u0644\u0623\u062F\u0627\u0621 \u0645\u062A\u0627\u062D"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#CBD5E1] mb-2" }, "\u0641\u064A\u0647 ", legacyImageProducts.length, " \u0645\u0646\u062A\u062C \u0644\u0633\u0647 \u0635\u0648\u0631\u0647\u0645 \u0645\u062A\u062E\u0632\u0646\u0629 \u0628\u0627\u0644\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 (\u0628\u062A\u062E\u0644\u064A \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u064A\u0641\u062A\u062D \u0623\u0628\u0637\u0623). \u062A\u0631\u062D\u064A\u0644\u0647\u0645 \u0645\u0631\u0629 \u0648\u0627\u062D\u062F\u0629 \u0628\u0633 \u0647\u064A\u062E\u0644\u064A \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u064A\u0641\u062A\u062D \u0623\u0633\u0631\u0639 \u0628\u0643\u062A\u064A\u0631 \u0645\u0646 \u0628\u0639\u062F\u0647\u0627."), migrating ? /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-300 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 14, className: "animate-spin" }), " \u0628\u064A\u062A\u0631\u062D\u0651\u0644... ", migrateProgress) : /* @__PURE__ */ React.createElement("button", { onClick: migrateImages, className: "btn-emerald rounded-lg px-3 py-1.5 text-xs font-bold" }, "\u062A\u0631\u062D\u064A\u0644 \u0627\u0644\u0635\u0648\u0631 \u062F\u0644\u0648\u0642\u062A\u064A")), (categories.length > 0 || isAdmin) && /* @__PURE__ */ React.createElement("div", { className: "mb-3 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "Tag", size: 16, className: "text-[#64748B] shrink-0" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement(
    CategoryCombobox,
    {
      categories,
      setCategories,
      value: categoryFilter,
      onSelect: setCategoryFilter,
      allowCreate: isAdmin,
      placeholder: "\u0641\u0644\u062A\u0631\u0629 \u0628\u0627\u0644\u062A\u0635\u0646\u064A\u0641 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"
    }
  ))), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowMissingProduct(true), className: "w-full text-xs text-purple-300 font-semibold bg-purple-500/10 border border-purple-500/20 rounded-xl py-2 mb-3 flex items-center justify-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "Tag", size: 13 }), " \u0639\u0627\u064A\u0632 \u062A\u0628\u0644\u0651\u063A \u0639\u0646 \u0645\u0646\u062A\u062C \u0645\u0634 \u0645\u0648\u062C\u0648\u062F \u0641\u064A \u0627\u0644\u0642\u0627\u064A\u0645\u0629\u061F"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pb-4" }, productsLoading && products.length === 0 && /* @__PURE__ */ React.createElement(SkeletonRows, { count: 6, height: 110 }), !productsLoading && products.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0636\u0627\u0641\u0629 \u0628\u0639\u062F"), products.length > 0 && filteredProducts.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0645\u0641\u064A\u0634 \u0646\u062A\u0627\u0626\u062C \u062A\u0637\u0627\u0628\u0642 \u0628\u062D\u062B\u0643"), visibleProducts.map((p) => {
    const editing = editingId === p.id;
    const cat = categories.find((c) => c.id === p.categoryId);
    return /* @__PURE__ */ React.createElement("div", { key: p.id, className: "panel p-4 rounded-2xl relative" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(ProductThumb, { product: { ...p, image: resolvedImage(p) }, editable: canManageProducts, onPick: (file) => pickExistingProductImage(p, file) }), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base text-white" }, p.name), cat && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full inline-block mt-1" }, cat.name))), /* @__PURE__ */ React.createElement("div", { className: "pt-2 border-t border-white/5" }, editing ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, activeTiers(tierSettings).map((tier) => /* @__PURE__ */ React.createElement(
      TierPriceEditor,
      {
        key: tier.id,
        label: tier.label,
        color: tier.color,
        rows: draft.priceRows[tier.id],
        setRows: (rows) => setDraft({ ...draft, priceRows: { ...draft.priceRows, [tier.id]: rows } })
      }
    ))) : /* @__PURE__ */ React.createElement("div", { className: "grid gap-1.5 text-center text-[11px]", style: { gridTemplateColumns: `repeat(${activeTiers(tierSettings).length}, 1fr)` } }, activeTiers(tierSettings).map((tier) => /* @__PURE__ */ React.createElement("div", { key: tier.id, className: "price-chip" }, /* @__PURE__ */ React.createElement("span", { className: "block text-[#94A3B8] mb-1" }, tier.label), /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, tierRows(p[tier.id]).map((r, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("span", { className: "font-bold tabular-nums", style: { color: tier.color } }, r.price), (r.label || i > 0) && /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold text-[#CBD5E1] leading-tight mt-0.5" }, r.label || "\u0633\u0639\u0631 \u062A\u0627\u0646\u064A")))))))), editing && /* @__PURE__ */ React.createElement("div", { className: "mt-2" }, /* @__PURE__ */ React.createElement(BarcodeListEditor, { barcodes: draft.barcodes, setBarcodes: (barcodes) => setDraft({ ...draft, barcodes }), onScan: (i) => setScannerTarget({ mode: "edit", index: i }) })), editing && isAdmin && /* @__PURE__ */ React.createElement("div", { className: "mt-2" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setCostPriceNumPadOpen(true),
        className: "field-input rounded-md px-2 py-1.5 text-xs text-center w-full",
        style: { color: draft.costPrice ? void 0 : "#64748B" }
      },
      draft.costPrice || "\u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621 (\u064A\u0638\u0647\u0631 \u0644\u0643 \u0628\u0633)"
    ), costPriceNumPadOpen && /* @__PURE__ */ React.createElement(
      NumPad,
      {
        title: "\u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621",
        initialValue: draft.costPrice,
        onConfirm: (val) => {
          setDraft({ ...draft, costPrice: val });
          setCostPriceNumPadOpen(false);
        },
        onClose: () => setCostPriceNumPadOpen(false)
      }
    )), !editing && isAdmin && p.costPrice != null && /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-[#64748B] mt-1.5 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Wallet", size: 10 }), " \u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621: ", p.costPrice), editing && editError && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-400 mt-2 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 12 }), " ", editError), (canEditPrices || canManageProducts || canDeleteProducts) && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 justify-end mt-3 pt-2 border-t border-white/5" }, editing ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => saveEdit(p), className: "text-xs btn-emerald px-3 py-1 rounded-lg font-semibold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Check", size: 13 }), " \u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setEditingId(null);
      setEditError("");
    }, className: "text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 13 }), " \u0625\u0644\u063A\u0627\u0621")) : /* @__PURE__ */ React.createElement(React.Fragment, null, canEditPrices && /* @__PURE__ */ React.createElement("button", { onClick: () => startEdit(p), className: "text-xs bg-amber-600/20 text-amber-400 px-3 py-1 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Pencil", size: 13 }), " \u062A\u0639\u062F\u064A\u0644"), canDeleteProducts && /* @__PURE__ */ React.createElement("button", { onClick: () => setDeletePrompt(p), className: "text-xs bg-rose-600/20 text-rose-400 px-2 py-1 rounded-lg font-semibold hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash2", size: 13 }), " \u062D\u0630\u0641"))), !editing && /* @__PURE__ */ React.createElement("div", { className: "flex justify-end mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setOutOfStockProduct(p), className: "text-xs bg-amber-600/10 text-amber-400 px-2.5 py-1 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 12 }), " \u0627\u0644\u0645\u0646\u062A\u062C \u062E\u0644\u0635")));
  }), filteredProducts.length > visibleProducts.length && /* @__PURE__ */ React.createElement("button", { onClick: () => setVisibleCount((c) => c + PAGE_SIZE), className: "btn-ghost w-full rounded-xl py-2.5 text-sm font-bold" }, "\u0639\u0631\u0636 \u0627\u0644\u0645\u0632\u064A\u062F (", filteredProducts.length - visibleProducts.length, " \u0645\u062A\u0628\u0642\u064A)")), canManageProducts && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setShowAdd(true);
    setAddError("");
  }, className: "btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-6" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 18 }), " \u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C \u062C\u062F\u064A\u062F"), showAdd && /* @__PURE__ */ React.createElement(Modal, { title: "\u2795 \u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C \u062C\u062F\u064A\u062F", accent: "#34D399", onClose: () => setShowAdd(false) }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement(ProductThumb, { product: { image: newProd.image }, editable: true, onPick: pickNewProductImage }), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#94A3B8]" }, "\u0627\u0636\u063A\u0637 \u0639\u0644\u0649 \u0627\u0644\u0623\u064A\u0642\u0648\u0646\u0629 \u0644\u0625\u0636\u0627\u0641\u0629 \u0635\u0648\u0631\u0629 \u0627\u0644\u0645\u0646\u062A\u062C (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)")), /* @__PURE__ */ React.createElement("input", { placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C", value: newProd.name, onChange: (e) => setNewProd({ ...newProd, name: e.target.value }), className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-3" }), /* @__PURE__ */ React.createElement(BarcodeListEditor, { barcodes: newProd.barcodes, setBarcodes: (barcodes) => setNewProd({ ...newProd, barcodes }), onScan: (i) => setScannerTarget({ mode: "new", index: i }) }), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-3" }, activeTiers(tierSettings).map((tier) => /* @__PURE__ */ React.createElement(
    TierPriceEditor,
    {
      key: tier.id,
      label: tier.label,
      color: tier.color,
      rows: newProd.priceRows[tier.id],
      setRows: (rows) => setNewProd({ ...newProd, priceRows: { ...newProd.priceRows, [tier.id]: rows } })
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u0645\u0646\u062A\u062C (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /* @__PURE__ */ React.createElement(
    CategoryCombobox,
    {
      categories,
      setCategories,
      value: newProd.categoryId,
      onSelect: (id) => setNewProd({ ...newProd, categoryId: id }),
      allowCreate: true,
      placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u062A\u0635\u0646\u064A\u0641 \u0623\u0648 \u062F\u0648\u0631 \u0639\u0644\u064A\u0647"
    }
  )), isAdmin && /* @__PURE__ */ React.createElement("label", { className: "block mb-3 text-right" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8] flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Wallet", size: 12 }), " \u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621 (\u064A\u0638\u0647\u0631 \u0644\u0643 \u0628\u0633\u060C \u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setNewCostPriceNumPadOpen(true),
      className: "field-input w-full rounded-xl px-3 py-2 text-sm text-center",
      style: { color: newProd.costPrice ? void 0 : "#64748B" }
    },
    newProd.costPrice || "\u062A\u0643\u0644\u0641\u0629 \u0627\u0644\u0634\u0631\u0627\u0621"
  ), newCostPriceNumPadOpen && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: "\u0633\u0639\u0631 \u0627\u0644\u0634\u0631\u0627\u0621",
      initialValue: newProd.costPrice,
      onConfirm: (val) => {
        setNewProd({ ...newProd, costPrice: val });
        setNewCostPriceNumPadOpen(false);
      },
      onClose: () => setNewCostPriceNumPadOpen(false)
    }
  )), addError && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-400 mb-3 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 12 }), " ", addError), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: addProduct, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowAdd(false), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621"))), duplicateMatch && /* @__PURE__ */ React.createElement(Modal, { title: "\u26A0\uFE0F \u0641\u064A\u0647 \u0645\u0646\u062A\u062C \u0628\u0646\u0641\u0633 \u0627\u0644\u0627\u0633\u0645", accent: "#FBBF24", onClose: () => setDuplicateMatch(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0641\u064A\u0647 \u0645\u0646\u062A\u062C \u0645\u062D\u0641\u0648\u0638 \u0639\u0646\u062F\u0647 \u0646\u0641\u0633 \u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0633\u0645 \u0642\u0631\u064A\u0628 \u062C\u062F\u064B\u0627 \u0645\u0646\u0647: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, duplicateMatch.name), ". \u062A\u062D\u0628 \u062A\u0633\u062A\u0628\u062F\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u0647 \u0628\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629 \u0627\u0644\u0644\u064A \u0643\u062A\u0628\u062A\u0647\u0627\u060C \u0648\u0644\u0627 \u062A\u0644\u063A\u064A\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => finalizeAddProduct(duplicateMatch.id), className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0627\u0633\u062A\u0628\u062F\u0627\u0644 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A"), /* @__PURE__ */ React.createElement("button", { onClick: () => setDuplicateMatch(null), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621"))), outOfStockProduct && /* @__PURE__ */ React.createElement(Modal, { title: "\u0627\u0644\u0645\u0646\u062A\u062C \u062E\u0644\u0635 \u0641\u064A\u0646\u061F", accent: "#F59E0B", onClose: () => setOutOfStockProduct(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, outOfStockProduct.name), " \u2014 \u0627\u062E\u062A\u0627\u0631 \u0627\u0644\u0641\u0631\u0639 \u0627\u0644\u0644\u064A \u0627\u0644\u0645\u0646\u062A\u062C \u062E\u0644\u0635 \u0641\u064A\u0647\u060C \u0647\u064A\u062A\u0628\u0639\u062A \u0644\u0644\u0623\u062F\u0645\u0646 \u0639\u0644\u0649 \u0637\u0648\u0644."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, branchSettings.branches.map((b) => /* @__PURE__ */ React.createElement("button", { key: b.id, onClick: () => reportOutOfStock(outOfStockProduct, b.name), className: "btn-sky flex-1 rounded-xl py-2.5 text-sm font-bold" }, b.name)))), showMissingProduct && /* @__PURE__ */ React.createElement(Modal, { title: "\u0645\u0646\u062A\u062C \u0645\u0634 \u0645\u0648\u062C\u0648\u062F \u0641\u064A \u0627\u0644\u0642\u0627\u064A\u0645\u0629", accent: "#A855F7", onClose: () => {
    setShowMissingProduct(false);
    setMissingProductName("");
  } }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-3" }, "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0623\u0648 \u0648\u0635\u0641 \u0627\u0644\u0645\u0646\u062A\u062C \u0627\u0644\u0644\u064A \u0627\u0644\u0632\u0628\u0648\u0646 \u0633\u0623\u0644 \u0639\u0646\u0647\u060C \u0647\u064A\u062A\u0628\u0639\u062A \u0644\u0644\u0623\u062F\u0645\u0646."), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: missingProductName,
      onChange: (e) => setMissingProductName(e.target.value),
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C \u0627\u0644\u0645\u0637\u0644\u0648\u0628",
      className: "field-input w-full rounded-xl px-4 py-2.5 text-sm mb-3"
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: submitMissingProduct, className: "btn-sky w-full rounded-xl py-2.5 font-bold" }, "\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0623\u062F\u0645\u0646")), scannerTarget && /* @__PURE__ */ React.createElement(BarcodeScannerModal, { onDetected: handleScanResult, onClose: () => setScannerTarget(null) }), notFoundBarcode && /* @__PURE__ */ React.createElement(Modal, { title: "\u0645\u0641\u064A\u0634 \u0645\u0646\u062A\u062C \u0628\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u062F\u0647", accent: "#FBBF24", onClose: () => setNotFoundBarcode(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, notFoundBarcode), " \u0645\u0634 \u0645\u062A\u0633\u062C\u0644 \u0644\u0623\u064A \u0645\u0646\u062A\u062C. \u062A\u062D\u0628 \u062A\u0636\u064A\u0641\u0647 \u0643\u0645\u0646\u062A\u062C \u062C\u062F\u064A\u062F \u0628\u0627\u0644\u0628\u0627\u0631\u0643\u0648\u062F \u062F\u0647\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: addProductFromNotFoundBarcode, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u062A\u062C"), /* @__PURE__ */ React.createElement("button", { onClick: () => setNotFoundBarcode(null), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621"))), showClearConfirm && /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F4CB} \u062A\u0645 \u0641\u062A\u062D \u0648\u0627\u062A\u0633\u0627\u0628", accent: "#25D366", onClose: () => setShowClearConfirm(false) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0627\u062E\u062A\u0627\u0631 \u062C\u0631\u0648\u0628 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646 \u0645\u0646 \u0648\u0627\u062A\u0633\u0627\u0628 \u0648\u0627\u0628\u0639\u062A \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0627\u0644\u0644\u064A \u0627\u062A\u0641\u062A\u062D\u062A. \u062A\u062D\u0628 \u062A\u0635\u0641\u0651\u0631 \u0639\u062F\u0627\u062F \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u062F\u0644\u0648\u0642\u062A\u064A\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    clearChangeLog();
    setShowClearConfirm(false);
  }, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062A\u0635\u0641\u064A\u0631 \u0627\u0644\u0639\u062F\u0627\u062F"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowClearConfirm(false), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0633\u064A\u0628\u0647 \u0632\u064A \u0645\u0627 \u0647\u0648"))), showManualReset && /* @__PURE__ */ React.createElement(Modal, { title: "\u26A0\uFE0F \u062A\u0635\u0641\u064A\u0631 \u0639\u062F\u0627\u062F \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A", accent: "#FB7185", onClose: () => setShowManualReset(false) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0647\u064A\u062A\u0635\u0641\u0651\u0631 \u0639\u062F\u062F \u0627\u0644\u062A\u0639\u062F\u064A\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u062F\u0644\u0648\u0642\u062A\u064A (", changedToday.length, ") \u0645\u0646 \u063A\u064A\u0631 \u0645\u0627 \u062A\u062A\u0628\u0639\u062A \u0623\u064A \u0631\u0633\u0627\u0644\u0629. \u0645\u062A\u0623\u0643\u062F\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    clearChangeLog();
    setShowManualReset(false);
  }, className: "btn-rose flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0623\u064A\u0648\u0647\u060C \u0635\u0641\u0651\u0631 \u0627\u0644\u0639\u062F\u0627\u062F"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowManualReset(false), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0644\u0623\u060C \u0631\u062C\u0651\u0639\u0646\u064A"))), deletePrompt && /* @__PURE__ */ React.createElement(Modal, { title: "\u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C", accent: "#EF4444", onClose: () => setDeletePrompt(null) }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, '\u0647\u064A\u062A\u0645\u0633\u062D "', deletePrompt.name, '" \u0646\u0647\u0627\u0626\u064A\u064B\u0627 \u0645\u0646 \u0643\u0644 \u0627\u0644\u0623\u062C\u0647\u0632\u0629\u060C \u0645\u0634 \u0647\u062A\u0642\u062F\u0631 \u062A\u0631\u062C\u0651\u0639\u0647. \u0645\u062A\u0623\u0643\u062F\u061F'), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    removeProduct(deletePrompt.id);
    setDeletePrompt(null);
  }, className: "btn-rose flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0623\u064A\u0648\u0647\u060C \u0627\u0645\u0633\u062D\u0647"), /* @__PURE__ */ React.createElement("button", { onClick: () => setDeletePrompt(null), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0644\u0623\u060C \u0631\u062C\u0651\u0639\u0646\u064A")))));
}
function OrdersScreen({ user, sales, setSales, users, branchSettings, setView }) {
  const [tab, setTab] = useState("pending");
  const [sendingOrder, setSendingOrder] = useState(null);
  const [receivingOrder, setReceivingOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const deliveries = sales.filter((s) => s.fulfillment === "delivery");
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1e3;
  const pendingReceipt = deliveries.filter((s) => s.deliveryStatus === "sent").sort((a, b) => (a.sentAt || 0) - (b.sentAt || 0));
  const mine = deliveries.filter((s) => userIsAdmin(user) || !!user.permissions?.viewAllOrders || s.employeeName === user.name).filter((s) => s.deliveryStatus !== "done" || s.receivedAt && now - s.receivedAt < DAY_MS).sort((a, b) => b.createdAt - a.createdAt);
  const statusLabel = (s) => {
    if (s.deliveryStatus === "prepared") return { label: "\u062A\u0645 \u0627\u0644\u062A\u062C\u0647\u064A\u0632", color: "#FBBF24" };
    if (s.deliveryStatus === "sent") return { label: "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644", color: "#38BDF8" };
    return { label: "\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645", color: "#34D399" };
  };
  const registerSend = (form) => {
    const err = form.paidUpfront ? validatePaymentMethod(form, sendingOrder.total) : null;
    if (!form.repName.trim()) return "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062F\u0648\u0628";
    if (!sendingOrder.dispatchLocation && !form.dispatchLocation) return "\u0627\u062E\u062A\u0627\u0631 \u0645\u0643\u0627\u0646 \u062E\u0631\u0648\u062C \u0627\u0644\u0623\u0648\u0631\u062F\u0631";
    if (err) return err;
    return null;
  };
  const submitSend = (form) => {
    const err = registerSend(form);
    if (err) return err;
    const now2 = Date.now();
    const isSplit = form.paymentMethod === "split";
    const updated = {
      ...sendingOrder,
      repName: form.repName.trim(),
      dispatchLocation: sendingOrder.dispatchLocation || form.dispatchLocation,
      sentBy: user.name,
      sentAt: now2,
      deliveryStatus: form.paidUpfront ? "done" : "sent",
      paid: !!form.paidUpfront,
      paymentMethod: form.paidUpfront ? form.paymentMethod : null,
      splitTransferMethod: form.paidUpfront && isSplit ? form.splitTransferMethod : null,
      cashAmount: form.paidUpfront && isSplit ? parseNum(form.cashAmount) : null,
      transferAmount: form.paidUpfront && isSplit ? parseNum(form.transferAmount) : null,
      receivedBy: form.paidUpfront ? user.name : null,
      receivedAt: form.paidUpfront ? now2 : null
    };
    setSales(sales.map((s) => s.id === updated.id ? updated : s));
    salesStore.upsert(updated);
    if (form.paidUpfront) {
      incrementDailyAggregate(businessDayOf(updated.createdAt), updated.dispatchLocation, "ordersTotal", updated.total);
      incrementDailyAggregate(businessDayOf(updated.createdAt), updated.dispatchLocation, "ordersCount", 1);
    }
    setSendingOrder(null);
    return null;
  };
  const submitReceive = (form) => {
    const err = validatePaymentMethod(form, receivingOrder.total);
    if (err) return err;
    const now2 = Date.now();
    const isSplit = form.paymentMethod === "split";
    const updated = {
      ...receivingOrder,
      deliveryStatus: "done",
      paid: true,
      paymentMethod: form.paymentMethod,
      splitTransferMethod: isSplit ? form.splitTransferMethod : null,
      cashAmount: isSplit ? parseNum(form.cashAmount) : null,
      transferAmount: isSplit ? parseNum(form.transferAmount) : null,
      receivedBy: user.name,
      receivedAt: now2
    };
    setSales(sales.map((s) => s.id === updated.id ? updated : s));
    salesStore.upsert(updated);
    incrementDailyAggregate(businessDayOf(updated.createdAt), updated.dispatchLocation, "ordersTotal", updated.total);
    incrementDailyAggregate(businessDayOf(updated.createdAt), updated.dispatchLocation, "ordersCount", 1);
    if (updated.employeeName) {
      sendNotification(updated.employeeName, `\u0623\u0648\u0631\u062F\u0631 (\u0641\u0627\u062A\u0648\u0631\u0629 #${updated.invoiceNumber ?? "?"}) / (${updated.deliveryArea}) \u062A\u0645 \u0627\u0633\u062A\u0644\u0627\u0645\u0647`);
    }
    setReceivingOrder(null);
    return null;
  };
  const renderCard = (s) => {
    const st = statusLabel(s);
    const canSend = s.deliveryStatus === "prepared" && s.employeeName === user.name;
    const canReceive = s.deliveryStatus === "sent";
    return /* @__PURE__ */ React.createElement("div", { key: s.id, className: "panel p-4 rounded-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base text-white flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "Truck", size: 15, className: "text-[#94A3B8]" }), " ", s.deliveryArea), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mt-0.5" }, "\u0641\u0627\u062A\u0648\u0631\u0629 #", s.invoiceNumber ?? "?", " \xB7 ", s.items.length, " \u0635\u0646\u0641")), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg text-sky-400 tabular-nums" }, s.total)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2 border-t border-white/5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: `${st.color}22`, color: st.color } }, st.label), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-amber-300" }, s.employeeName, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#64748B] font-normal" }, "\xB7 ", new Date(s.createdAt).toLocaleDateString("ar-EG")))), s.repName && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#CBD5E1] mt-2" }, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628: ", s.repName), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setDetailOrder(s), className: "text-xs text-sky-400 font-semibold hover:underline" }, "\u0639\u0631\u0636 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644"), canSend && /* @__PURE__ */ React.createElement("button", { onClick: () => setSendingOrder(s), className: "btn-sky text-xs px-3 py-1.5 rounded-lg font-bold" }, "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644"), canReceive && /* @__PURE__ */ React.createElement("button", { onClick: () => setReceivingOrder(s), className: "btn-emerald text-xs px-3 py-1.5 rounded-lg font-bold" }, "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645")));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(PullToRefresh, { onRefresh: async () => {
    const fresh = await fetchOpenDeliveryOrders();
    if (fresh) {
      setSales((prev) => [...prev.filter((s) => s.fulfillment !== "delivery"), ...fresh]);
      idbSet("open_orders_cache", fresh);
    }
  } }), /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0627\u0644\u0637\u0644\u0628\u0627\u062A", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setTab("pending"), className: `flex-1 rounded-xl py-2.5 text-sm font-bold ${tab === "pending" ? "btn-sky" : "btn-ghost"}` }, "\u0645\u062D\u062A\u0627\u062C\u0629 \u0625\u062C\u0631\u0627\u0621", pendingReceipt.length > 0 ? ` (${pendingReceipt.length})` : ""), /* @__PURE__ */ React.createElement("button", { onClick: () => setTab("mine"), className: `flex-1 rounded-xl py-2.5 text-sm font-bold ${tab === "mine" ? "btn-sky" : "btn-ghost"}` }, "\u0623\u0648\u0631\u062F\u0631\u0627\u062A\u064A")), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pb-6" }, tab === "pending" && /* @__PURE__ */ React.createElement(React.Fragment, null, pendingReceipt.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-10 text-sm" }, "\u0645\u0641\u064A\u0634 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0645\u062D\u062A\u0627\u062C\u0629 \u0627\u0633\u062A\u0644\u0627\u0645 \u062F\u0644\u0648\u0642\u062A\u064A"), pendingReceipt.map(renderCard)), tab === "mine" && /* @__PURE__ */ React.createElement(React.Fragment, null, mine.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-10 text-sm" }, "\u0645\u0641\u064A\u0634 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0644\u0633\u0647"), mine.map(renderCard)))), sendingOrder && /* @__PURE__ */ React.createElement(
    SendOrderModal,
    {
      order: sendingOrder,
      branchSettings,
      onSubmit: submitSend,
      onClose: () => setSendingOrder(null)
    }
  ), receivingOrder && /* @__PURE__ */ React.createElement(
    ReceiveOrderModal,
    {
      order: receivingOrder,
      onSubmit: submitReceive,
      onClose: () => setReceivingOrder(null)
    }
  ), detailOrder && /* @__PURE__ */ React.createElement(OrderDetailModal, { order: detailOrder, onClose: () => setDetailOrder(null) }));
}
function SendOrderModal({ order, branchSettings, onSubmit, onClose }) {
  const [repName, setRepName] = useState("");
  const [dispatchLocation, setDispatchLocation] = useState("");
  const [paidUpfront, setPaidUpfront] = useState(null);
  const [pm, setPm] = useState(EMPTY_CONFIRM_FORM);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = React.useRef(false);
  const submit = () => {
    if (busyRef.current) return;
    if (!repName.trim()) {
      setError("\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062F\u0648\u0628");
      return;
    }
    if (!order.dispatchLocation && !dispatchLocation) {
      setError("\u0627\u062E\u062A\u0627\u0631 \u0645\u0643\u0627\u0646 \u062E\u0631\u0648\u062C \u0627\u0644\u0623\u0648\u0631\u062F\u0631");
      return;
    }
    if (paidUpfront === null) {
      setError("\u062D\u062F\u062F \u0627\u0644\u0623\u0648\u0631\u062F\u0631 \u0645\u062F\u0641\u0648\u0639 \u0645\u0642\u062F\u0645\u064B\u0627 \u0648\u0644\u0627 \u0644\u0623");
      return;
    }
    const form = { repName, dispatchLocation, paidUpfront, ...pm };
    busyRef.current = true;
    setBusy(true);
    const err = onSubmit(form);
    if (err) {
      setError(err);
      busyRef.current = false;
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644", accent: "#38BDF8", onClose }, /* @__PURE__ */ React.createElement(TextField, { label: "\u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062F\u0648\u0628", icon: "User", value: repName, onChange: (e) => setRepName(e.target.value), placeholder: "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062F\u0648\u0628" }), !order.dispatchLocation && /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, branchSettings.branches.map((b) => /* @__PURE__ */ React.createElement("button", { key: b.id, onClick: () => setDispatchLocation(b.name), className: `toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${dispatchLocation === b.name ? "active-sky" : ""}` }, b.name)))), /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0645\u062F\u0641\u0648\u0639 \u0645\u0642\u062F\u0645\u064B\u0627\u061F"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPaidUpfront(true), className: `flex-1 rounded-xl py-2 text-sm font-bold ${paidUpfront === true ? "btn-emerald" : "btn-ghost"}` }, "\u0623\u064A\u0648\u0647\u060C \u0627\u062A\u062F\u0641\u0639"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPaidUpfront(false), className: `flex-1 rounded-xl py-2 text-sm font-bold ${paidUpfront === false ? "btn-sky" : "btn-ghost"}` }, "\u0644\u0623\u060C \u0647\u064A\u062A\u062F\u0641\u0639 \u0639\u0646\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645"))), paidUpfront === true && /* @__PURE__ */ React.createElement(PaymentMethodPicker, { value: pm, onChange: setPm }), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("button", { onClick: submit, disabled: busy, className: "btn-sky w-full rounded-xl py-2.5 font-bold disabled:opacity-40 flex items-center justify-center gap-2" }, busy && /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }), busy ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062D\u0641\u0638..." : "\u062A\u0645"));
}
function ReceiveOrderModal({ order, onSubmit, onClose }) {
  const [pm, setPm] = useState(EMPTY_CONFIRM_FORM);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = React.useRef(false);
  const submit = () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const err = onSubmit(pm);
    if (err) {
      setError(err);
      busyRef.current = false;
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645", accent: "#10B981", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#CBD5E1] mb-4" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 tabular-nums" }, order.total)), /* @__PURE__ */ React.createElement(PaymentMethodPicker, { value: pm, onChange: setPm }), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("button", { onClick: submit, disabled: busy, className: "btn-emerald w-full rounded-xl py-2.5 font-bold disabled:opacity-40 flex items-center justify-center gap-2" }, busy && /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }), busy ? "\u062C\u0627\u0631\u064D \u0627\u0644\u062D\u0641\u0638..." : "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645"));
}
function OrderDetailModal({ order, onClose }) {
  const pay = paymentLabel(order);
  return /* @__PURE__ */ React.createElement(Modal, { title: `\u0641\u0627\u062A\u0648\u0631\u0629 #${order.invoiceNumber ?? "?"}`, accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 text-xs text-[#CBD5E1] mb-4" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0627\u0644\u0645\u0646\u0637\u0642\u0629: "), order.deliveryArea), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u062A\u0644\u064A\u0641\u0648\u0646 \u0627\u0644\u0632\u0628\u0648\u0646: "), /* @__PURE__ */ React.createElement("span", { dir: "ltr" }, order.customerPhone)), order.dispatchLocation && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C: "), order.dispatchLocation), order.repName && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628: "), order.repName), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0623\u0646\u0634\u0623\u0647\u0627: "), order.employeeName, " \xB7 ", new Date(order.createdAt).toLocaleString("ar-EG")), order.sentBy && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0633\u062C\u0651\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644: "), order.sentBy, " \xB7 ", new Date(order.sentAt).toLocaleString("ar-EG")), order.receivedBy && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0623\u0643\u0651\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: "), order.receivedBy, " \xB7 ", new Date(order.receivedAt).toLocaleString("ar-EG")), order.deliveryStatus === "done" && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639: "), pay.label), /* @__PURE__ */ React.createElement("div", { className: "border-t border-white/5 pt-1.5 mt-1.5" }, order.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", null, it.productName, " \xD7 ", it.qty), /* @__PURE__ */ React.createElement("span", { className: "tabular-nums" }, it.lineTotal)))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-1.5 border-t border-white/5 font-bold text-white" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", { className: "tabular-nums" }, order.total))), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost w-full rounded-xl py-2.5 font-bold" }, "\u0625\u063A\u0644\u0627\u0642"));
}
function TransfersScreen({ user, transfers, setTransfers, setView }) {
  const [showAdd, setShowAdd] = useState(false);
  const [personName, setPersonName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountNumPadOpen, setAmountNumPadOpen] = useState(false);
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
      setError("\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0634\u062E\u0635");
      return;
    }
    const amt = parseNum(amount);
    if (amt === null || amt <= 0) {
      setError("\u0627\u0643\u062A\u0628 \u0645\u0628\u0644\u063A \u0635\u062D\u064A\u062D");
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
      confirmedAt: null
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
      confirmedAt: Date.now()
    };
    setTransfers(transfers.map((t) => t.id === confirmingTransfer.id ? updated : t));
    transfersStore.upsert(updated);
    setConfirmingTransfer(null);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(PullToRefresh, { onRefresh: handleRefresh }), /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u062A\u062D\u0648\u064A\u0644\u0627\u062A", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up" }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setShowAdd(true);
    setError("");
  }, className: "btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-4" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 18 }), " \u062A\u0633\u062C\u064A\u0644 \u062A\u062D\u0648\u064A\u0644 \u062C\u062F\u064A\u062F"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pb-6" }, transfers.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u062A\u062D\u0648\u064A\u0644\u0627\u062A \u0645\u0633\u062C\u0644\u0629 \u0628\u0639\u062F"), transfers.map((t) => {
    const pay = paymentLabel(t);
    return /* @__PURE__ */ React.createElement("div", { key: t.id, className: "panel p-4 rounded-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-white text-sm" }, t.personName), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-purple-400 tabular-nums" }, t.amount)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2 border-t border-white/5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: `${pay.color}22`, color: pay.color } }, pay.label), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-amber-300" }, t.createdBy, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#64748B] font-normal" }, "\xB7 ", new Date(t.createdAt).toLocaleString("ar-EG")))), t.paid && t.confirmedBy && /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-emerald-400 mt-2 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 12 }), " \u0627\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0644\u0648\u0633: ", t.confirmedBy), !t.paid && /* @__PURE__ */ React.createElement("div", { className: "flex justify-end mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => openConfirm(t), className: "text-xs btn-emerald px-3 py-1 rounded-lg font-semibold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 13 }), " \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062F\u0641\u0639")));
  })), showAdd && /* @__PURE__ */ React.createElement(Modal, { title: "\u{1F4B8} \u062A\u062D\u0648\u064A\u0644 \u062C\u062F\u064A\u062F", accent: "#A855F7", onClose: () => setShowAdd(false) }, /* @__PURE__ */ React.createElement("label", { className: "block mb-3 text-right" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0627\u0633\u0645 \u0627\u0644\u0634\u062E\u0635"), /* @__PURE__ */ React.createElement("input", { list: "transfer-names", value: personName, onChange: (e) => setPersonName(e.target.value), className: "field-input w-full rounded-xl px-4 py-2.5 text-sm", placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0634\u062E\u0635" }), /* @__PURE__ */ React.createElement("datalist", { id: "transfer-names" }, nameOptions.map((n) => /* @__PURE__ */ React.createElement("option", { value: n, key: n })))), /* @__PURE__ */ React.createElement("label", { className: "block mb-3 text-right" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs font-medium text-[#94A3B8]" }, "\u0627\u0644\u0645\u0628\u0644\u063A"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setAmountNumPadOpen(true),
      className: "field-input w-full rounded-xl px-4 py-2.5 text-sm text-center",
      style: { color: amount ? void 0 : "#64748B" }
    },
    amount || "\u0627\u0644\u0645\u0628\u0644\u063A"
  ), amountNumPadOpen && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: "\u0627\u0644\u0645\u0628\u0644\u063A",
      initialValue: amount,
      onConfirm: (val) => {
        setAmount(val);
        setAmountNumPadOpen(false);
      },
      onClose: () => setAmountNumPadOpen(false)
    }
  )), error && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-400 mb-3 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 12 }), " ", error), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: addTransfer, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowAdd(false), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621"))), confirmingTransfer && /* @__PURE__ */ React.createElement(Modal, { title: "\u2705 \u062A\u0623\u0643\u064A\u062F \u0627\u0633\u062A\u0644\u0627\u0645 \u0627\u0644\u062F\u0641\u0639", accent: "#34D399", onClose: () => setConfirmingTransfer(null) }, /* @__PURE__ */ React.createElement("div", { className: "panel rounded-xl p-3 mb-4 text-sm" }, /* @__PURE__ */ React.createElement("p", { className: "text-white font-bold" }, confirmingTransfer.personName), /* @__PURE__ */ React.createElement("p", { className: "text-purple-400 font-bold tabular-nums mt-1" }, confirmingTransfer.amount, " \u062C\u0646\u064A\u0647")), /* @__PURE__ */ React.createElement(PaymentMethodPicker, { value: confirmForm, onChange: setConfirmForm }), confirmError && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-400 mb-3 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 12 }), " ", confirmError), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: finalizeConfirm, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmingTransfer(null), className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621")))));
}
function OrderReceiptPreview({ order, onClose }) {
  const pay = paymentLabel(order);
  const [printError, setPrintError] = useState("");
  const handlePrint = () => {
    printOrderReceipt(order, (reason) => {
      setPrintError(reason === "popup" ? "\u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u0634 \u0642\u0627\u062F\u0631 \u064A\u0641\u062A\u062D \u0634\u0627\u0634\u0629 \u0627\u0644\u0637\u0628\u0627\u0639\u0629 \u2014 \u062A\u0623\u0643\u062F \u0625\u0646 \u0627\u0644\u0640pop-ups \u0645\u0633\u0645\u0648\u062D\u0629" : "\u062D\u0635\u0644\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0644\u0644\u0637\u0627\u0628\u0639\u0629");
      setTimeout(() => setPrintError(""), 4e3);
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Modal, { title: "\u0645\u0639\u0627\u064A\u0646\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629", accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement("div", { className: "bg-white text-black rounded-lg p-4 mb-4 text-sm", dir: "rtl", style: { fontFamily: "Tahoma, Arial, sans-serif" } }, /* @__PURE__ */ React.createElement("h3", { className: "text-center font-bold text-base mb-1" }, "FaAroon"), /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-gray-500 mb-2" }, "\u0641\u0627\u062A\u0648\u0631\u0629 \u0623\u0648\u0631\u062F\u0631"), /* @__PURE__ */ React.createElement("div", { className: "border-t border-dashed border-gray-300 my-2" }), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs py-0.5" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628"), /* @__PURE__ */ React.createElement("span", null, order.repName)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs py-0.5" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0645\u0646\u0637\u0642\u0629"), /* @__PURE__ */ React.createElement("span", null, order.deliveryArea)), order.dispatchLocation && /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs py-0.5" }, /* @__PURE__ */ React.createElement("span", null, "\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C"), /* @__PURE__ */ React.createElement("span", null, order.dispatchLocation)), /* @__PURE__ */ React.createElement("div", { className: "border-t border-dashed border-gray-300 my-2" }), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between font-bold text-sm mb-1" }, /* @__PURE__ */ React.createElement("span", null, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", null, order.total)), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between text-xs text-gray-600" }, /* @__PURE__ */ React.createElement("span", null, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"), /* @__PURE__ */ React.createElement("span", null, pay.label))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: handlePrint, className: "btn-emerald flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "Printer", size: 16 }), " \u0637\u0628\u0627\u0639\u0629"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2.5 font-bold" }, "\u0625\u063A\u0644\u0627\u0642"))), printError && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in text-xs text-rose-300 font-bold text-center" }, printError)));
}
function ReportsScreen({ user, sales, branchSettings, setView }) {
  const [filterType, setFilterType] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [previewSale, setPreviewSale] = useState(null);
  const [range, setRange] = useState("today");
  const monthOptions = (() => {
    const opts = [];
    const d = /* @__PURE__ */ new Date();
    d.setDate(1);
    for (let i = 0; i < 12; i++) {
      const id = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      opts.push({ id, label: d.toLocaleDateString("ar-EG", { year: "numeric", month: "long" }) });
      d.setMonth(d.getMonth() - 1);
    }
    return opts;
  })();
  const [fetchedSales, setFetchedSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const { start: rangeStart, end: rangeEnd } = rangeToTimestamps(range);
  const [aggTotals, setAggTotals] = useState(null);
  const [aggLoading, setAggLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setAggLoading(true);
    const days = businessDaysInRange(rangeStart, rangeEnd);
    sumDailyAggregates(days, filterBranch).then((totals) => {
      if (cancelled) return;
      setAggTotals(totals);
      setAggLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [rangeStart, rangeEnd, filterBranch]);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setOffline(false);
    const cacheKey = `reports_range:${range}`;
    (async () => {
      const result = await fetchSalesInRange(rangeStart, rangeEnd);
      if (cancelled) return;
      if (result) {
        setFetchedSales(result);
        idbSet(cacheKey, result);
      } else {
        const cached = await idbGet(cacheKey);
        setFetchedSales(cached || []);
        setOffline(true);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [range]);
  const rangeSales = (() => {
    const byId = {};
    fetchedSales.forEach((s) => {
      byId[s.id] = s;
    });
    sales.forEach((s) => {
      if ((s.createdAt || 0) >= rangeStart && (s.createdAt || 0) <= rangeEnd) byId[s.id] = s;
    });
    return Object.values(byId);
  })();
  const paidOrders = rangeSales.filter((s) => s.fulfillment === "delivery" && s.paid).sort((a, b) => b.createdAt - a.createdAt);
  const sortedSales = rangeSales.filter((s) => s.fulfillment !== "delivery").sort((a, b) => b.createdAt - a.createdAt);
  const branchFilteredOrders = filterBranch === "all" ? paidOrders : paidOrders.filter((o) => o.dispatchLocation === filterBranch);
  const branchFilteredSales = filterBranch === "all" ? sortedSales : sortedSales.filter((s) => s.branchName === filterBranch || s.dispatchLocation === filterBranch);
  const showOrders = filterType === "all" || filterType === "orders";
  const showSales = filterType === "all" || filterType === "sales";
  const visibleOrders = showOrders ? branchFilteredOrders : [];
  const visibleSales = showSales ? branchFilteredSales : [];
  const ordersTotal = visibleOrders.reduce((s, o) => s + o.total, 0);
  const salesTotal = visibleSales.reduce((s, sale) => s + sale.total, 0);
  const combinedTotal = ordersTotal + salesTotal;
  const combinedCount = visibleOrders.length + visibleSales.length;
  const mergedItems = [
    ...visibleOrders.map((o) => ({ kind: "order", data: o, createdAt: o.createdAt })),
    ...visibleSales.map((s) => ({ kind: "sale", data: s, createdAt: s.createdAt }))
  ].sort((a, b) => b.createdAt - a.createdAt);
  const activeFilterCount = (filterType !== "all" ? 1 : 0) + (filterBranch !== "all" ? 1 : 0) + (range !== "today" ? 1 : 0);
  const renderOrderCard = (o) => {
    const pay = paymentLabel(o);
    const expanded = expandedId === o.id;
    return /* @__PURE__ */ React.createElement("div", { key: o.id, className: "panel p-4 rounded-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base text-white flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "Truck", size: 15, className: "text-[#94A3B8]" }), " ", o.repName), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "MapPin", size: 12 }), " ", o.deliveryArea)), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg text-sky-400 tabular-nums" }, o.total)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2 border-t border-white/5" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: `${pay.color}22`, color: pay.color } }, pay.label), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-amber-300" }, o.employeeName, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#64748B] font-normal" }, "\xB7 ", new Date(o.createdAt).toLocaleDateString("ar-EG")))), o.receivedBy && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 12 }), " \u0627\u0633\u062A\u0644\u0645 \u0627\u0644\u0641\u0644\u0648\u0633: ", o.receivedBy), expanded && /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-3 border-t border-white/5 space-y-2 text-xs" }, o.dispatchLocation && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0645\u0643\u0627\u0646 \u0627\u0644\u062E\u0631\u0648\u062C: "), o.dispatchLocation), o.notes && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1] bg-black/15 rounded-lg px-2.5 py-1.5" }, "\u{1F4DD} ", o.notes), o.paymentMethod === "split" && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062F\u0641\u0639: "), "\u0643\u0627\u0634 ", o.cashAmount, " + \u062A\u062D\u0648\u064A\u0644 ", o.splitTransferMethod === "instapay" ? "\u0627\u0646\u0633\u062A\u0627\u0628\u0627\u064A" : "\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634", " ", o.transferAmount), /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0648\u0642\u062A \u0627\u0644\u0625\u0646\u0634\u0627\u0621: "), new Date(o.createdAt).toLocaleString("ar-EG")), o.receivedAt && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0648\u0642\u062A \u062A\u0623\u0643\u064A\u062F \u0627\u0644\u062F\u0641\u0639: "), new Date(o.receivedAt).toLocaleString("ar-EG")), o.invoiceImage && /* @__PURE__ */ React.createElement(InvoiceThumb, { src: o.invoiceImage, className: "w-20 h-20 rounded-lg object-cover border border-white/10" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setExpandedId(expanded ? null : o.id), className: "text-xs text-sky-400 font-semibold hover:underline" }, expanded ? "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" : "\u0639\u0631\u0636 \u0643\u0644 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPreviewOrder(o), className: "text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Printer", size: 13 }), " \u0637\u0628\u0627\u0639\u0629")));
  };
  const renderSaleCard = (s) => {
    const pay = paymentLabel(s);
    const expanded = expandedId === s.id;
    const isDelivery = s.fulfillment === "delivery";
    const deliveryStatusLabel = isDelivery ? s.deliveryStatus === "prepared" ? { label: "\u062A\u0645 \u0627\u0644\u062A\u062C\u0647\u064A\u0632", color: "#FBBF24" } : s.deliveryStatus === "sent" ? { label: "\u062A\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644", color: "#38BDF8" } : { label: "\u062A\u0645 \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645", color: "#34D399" } : null;
    return /* @__PURE__ */ React.createElement("div", { key: s.id, className: "panel p-4 rounded-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-base text-white flex items-center gap-1.5" }, isDelivery ? /* @__PURE__ */ React.createElement(Icon, { name: "Truck", size: 15, className: "text-[#94A3B8]" }) : /* @__PURE__ */ React.createElement(Icon, { name: "Wallet", size: 15, className: "text-[#94A3B8]" }), isDelivery ? s.deliveryArea : s.customerName || "\u0628\u062F\u0648\u0646 \u0627\u0633\u0645 \u0632\u0628\u0648\u0646"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mt-0.5" }, "\u0641\u0627\u062A\u0648\u0631\u0629 #", s.invoiceNumber ?? "?", " \xB7 ", s.items.length, " \u0635\u0646\u0641", s.branchName || s.dispatchLocation ? ` \xB7 ${s.branchName || s.dispatchLocation}` : "")), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-lg text-sky-400 tabular-nums" }, s.total)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between pt-2 border-t border-white/5" }, isDelivery ? /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: `${deliveryStatusLabel.color}22`, color: deliveryStatusLabel.color } }, deliveryStatusLabel.label) : /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full", style: { background: `${pay.color}22`, color: pay.color } }, pay.label), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold text-amber-300" }, s.employeeName, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#64748B] font-normal" }, "\xB7 ", new Date(s.createdAt).toLocaleDateString("ar-EG")))), expanded && /* @__PURE__ */ React.createElement("div", { className: "mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs" }, isDelivery && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u062A\u0644\u064A\u0641\u0648\u0646 \u0627\u0644\u0632\u0628\u0648\u0646: "), /* @__PURE__ */ React.createElement("span", { dir: "ltr" }, s.customerPhone)), s.repName && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0627\u0644\u0645\u0646\u062F\u0648\u0628: "), s.repName), s.deliveryStatus === "done" && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639: "), pay.label), s.sentBy && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0633\u062C\u0651\u0644 \u0627\u0644\u0625\u0631\u0633\u0627\u0644: "), s.sentBy, s.sentAt ? ` \xB7 ${new Date(s.sentAt).toLocaleString("ar-EG")}` : ""), s.receivedBy && /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0623\u0643\u0651\u062F \u0627\u0644\u0627\u0633\u062A\u0644\u0627\u0645: "), s.receivedBy, s.receivedAt ? ` \xB7 ${new Date(s.receivedAt).toLocaleString("ar-EG")}` : "")), s.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-center justify-between text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("span", null, it.productName, " \xD7 ", it.qty), /* @__PURE__ */ React.createElement("span", { className: "tabular-nums" }, it.lineTotal))), /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1] pt-1.5 border-t border-white/5" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0648\u0642\u062A \u0627\u0644\u0628\u064A\u0639: "), new Date(s.createdAt).toLocaleString("ar-EG"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setExpandedId(expanded ? null : s.id), className: "text-xs text-sky-400 font-semibold hover:underline" }, expanded ? "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644" : "\u0639\u0631\u0636 \u0643\u0644 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPreviewSale(s), className: "text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "Printer", size: 13 }), " \u0637\u0628\u0627\u0639\u0629")));
  };
  const aggGrossTotal = (filterType !== "orders" ? aggTotals?.salesTotal || 0 : 0) + (filterType !== "sales" ? aggTotals?.ordersTotal || 0 : 0);
  const aggReturnsTotal = (filterType !== "orders" ? aggTotals?.returnsSalesTotal || 0 : 0) + (filterType !== "sales" ? aggTotals?.returnsOrdersTotal || 0 : 0);
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up" }, loading ? /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#64748B] mb-3" }, "\u0628\u064A\u062D\u0645\u0651\u0644...") : offline ? /* @__PURE__ */ React.createElement("p", { className: "text-xs text-amber-400 mb-3" }, "\u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u2014 \u0645\u0646 \u063A\u064A\u0631 \u0625\u0646\u062A\u0631\u0646\u062A") : null, /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 mb-4 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8]" }, filterType === "orders" ? "\u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0645\u0624\u0643\u062F\u0629 \u0627\u0644\u062F\u0641\u0639" : filterType === "sales" ? "\u0641\u0648\u0627\u062A\u064A\u0631 \u0627\u0644\u0643\u0627\u0634\u064A\u0631" : "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A"), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-emerald-400" }, combinedCount)), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8]" }, "\u0635\u0627\u0641\u064A \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A", aggReturnsTotal > 0 ? " (\u0628\u0639\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A)" : ""), aggLoading ? /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-sky-400 tabular-nums" }, "...") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold text-sky-400 tabular-nums" }, aggGrossTotal - aggReturnsTotal), aggReturnsTotal > 0 && /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-rose-400 tabular-nums" }, "\u0645\u0631\u062A\u062C\u0639\u0627\u062A: \u2212", aggReturnsTotal, " \u062C")))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setFilterOpen(true),
      className: "w-full rounded-xl py-2.5 mb-4 text-sm font-bold btn-ghost flex items-center justify-center gap-2"
    },
    "\u0641\u0644\u062A\u0631\u0629",
    activeFilterCount > 0 && /* @__PURE__ */ React.createElement("span", { className: "bg-sky-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center" }, activeFilterCount)
  ), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pb-6" }, filterType === "all" && /* @__PURE__ */ React.createElement(React.Fragment, null, mergedItems.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0644\u0633\u0647 \u0645\u0641\u064A\u0634 \u0639\u0645\u0644\u064A\u0627\u062A"), mergedItems.map((item) => item.kind === "order" ? renderOrderCard(item.data) : renderSaleCard(item.data))), filterType === "orders" && /* @__PURE__ */ React.createElement(React.Fragment, null, visibleOrders.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0644\u0633\u0647 \u0645\u0641\u064A\u0634 \u0623\u0648\u0631\u062F\u0631\u0627\u062A \u0645\u0624\u0643\u062F\u0629 \u0627\u0644\u062F\u0641\u0639"), visibleOrders.map(renderOrderCard)), filterType === "sales" && /* @__PURE__ */ React.createElement(React.Fragment, null, visibleSales.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0644\u0633\u0647 \u0645\u0641\u064A\u0634 \u0641\u0648\u0627\u062A\u064A\u0631 \u0643\u0627\u0634\u064A\u0631"), visibleSales.map(renderSaleCard)))), filterOpen && /* @__PURE__ */ React.createElement(Modal, { title: "\u0641\u0644\u062A\u0631\u0629 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631", accent: "#0EA5E9", onClose: () => setFilterOpen(false) }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0627\u0644\u0641\u062A\u0631\u0629"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-2 overflow-x-auto" }, [
    { key: "today", label: "\u0627\u0644\u064A\u0648\u0645" },
    { key: "yesterday", label: "\u0623\u0645\u0633" },
    { key: "week", label: "\u0627\u0644\u0623\u0633\u0628\u0648\u0639 \u062F\u0647 (\u0633\u0628\u062A-\u062C\u0645\u0639\u0629)" },
    { key: "month", label: "\u0627\u0644\u0634\u0647\u0631 \u062F\u0647" },
    { key: "all", label: "\u0622\u062E\u0631 3 \u0634\u0647\u0648\u0631" }
  ].map((t) => /* @__PURE__ */ React.createElement("button", { key: t.key, onClick: () => setRange(t.key), className: `shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${range === t.key ? "btn-sky" : "btn-ghost"}` }, t.label))), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: /^\d{4}-\d{2}$/.test(range) ? range : "",
      onChange: (e) => {
        if (e.target.value) setRange(e.target.value);
      },
      className: "field-input w-full rounded-xl px-3 py-2 text-xs mb-4"
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u0623\u0648 \u0627\u062E\u062A\u0627\u0631 \u0634\u0647\u0631 \u062A\u0627\u0646\u064A..."),
    monthOptions.map((m) => /* @__PURE__ */ React.createElement("option", { key: m.id, value: m.id }, m.label))
  ), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0646\u0648\u0639 \u0627\u0644\u0639\u0645\u0644\u064A\u0629"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterType("all"), className: `flex-1 rounded-xl py-2 text-xs font-bold ${filterType === "all" ? "btn-sky" : "btn-ghost"}` }, "\u0627\u0644\u0643\u0644"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterType("orders"), className: `flex-1 rounded-xl py-2 text-xs font-bold ${filterType === "orders" ? "btn-sky" : "btn-ghost"}` }, "\u0623\u0648\u0631\u062F\u0631\u0627\u062A"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterType("sales"), className: `flex-1 rounded-xl py-2 text-xs font-bold ${filterType === "sales" ? "btn-sky" : "btn-ghost"}` }, "\u0643\u0627\u0634\u064A\u0631")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0627\u0644\u0641\u0631\u0639"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: filterBranch,
      onChange: (e) => setFilterBranch(e.target.value),
      className: "field-input w-full rounded-xl px-3 py-2.5 text-sm mb-4"
    },
    /* @__PURE__ */ React.createElement("option", { value: "all" }, "\u0643\u0644 \u0627\u0644\u0641\u0631\u0648\u0639"),
    (branchSettings?.branches || []).map((b) => /* @__PURE__ */ React.createElement("option", { key: b.id, value: b.name }, b.name))
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilterOpen(false), className: "btn-emerald w-full rounded-xl py-2.5 font-bold" }, "\u062A\u0645\u0627\u0645")), previewOrder && /* @__PURE__ */ React.createElement(OrderReceiptPreview, { order: previewOrder, onClose: () => setPreviewOrder(null) }), previewSale && /* @__PURE__ */ React.createElement(SaleReceiptPreview, { sale: previewSale, onClose: () => setPreviewSale(null) }));
}
const ATTENDANCE_STATUS = {
  present: { label: "\u062D\u0636\u0631", color: "#34D399" },
  absent: { label: "\u0644\u0645 \u064A\u062D\u0636\u0631", color: "#FB7185" },
  half_morning: { label: "\u0646\u0635 \u064A\u0648\u0645 \u0635\u0628\u0627\u062D\u064A", color: "#FBBF24" },
  half_evening: { label: "\u0646\u0635 \u064A\u0648\u0645 \u0645\u0633\u0627\u0626\u064A", color: "#FBBF24" }
};
function DayEditModal({ dateStr, existing, branches, suggestedBranchId, onSave, onClose }) {
  const [status, setStatus] = useState(existing?.attendanceStatus || null);
  const [branchId, setBranchId] = useState(existing?.branchId || suggestedBranchId || (branches[0]?.id ?? null));
  const needsBranch = status === "present" || status === "half_morning" || status === "half_evening";
  const save = () => {
    onSave({ attendanceStatus: status, branchId: needsBranch ? branchId : null });
  };
  const dayLabel = new Date(dateStr).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });
  return /* @__PURE__ */ React.createElement(Modal, { title: dayLabel, accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u0627\u0644\u062D\u0636\u0648\u0631"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 mb-4" }, Object.entries(ATTENDANCE_STATUS).map(([key, s]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key,
      onClick: () => setStatus(status === key ? null : key),
      className: "toggle-pill rounded-xl py-2 text-xs font-bold",
      style: status === key ? { background: `${s.color}33`, color: s.color, borderColor: s.color } : {}
    },
    s.label
  ))), needsBranch && branches.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u0627\u0644\u0641\u0631\u0639"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 mb-4" }, branches.map((b) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: b.id,
      onClick: () => setBranchId(b.id),
      className: "toggle-pill rounded-xl py-2 text-xs font-bold",
      style: branchId === b.id ? { background: "rgba(14,165,233,0.18)", color: "#38BDF8", borderColor: "#0EA5E9" } : {}
    },
    b.name
  )))), /* @__PURE__ */ React.createElement("button", { onClick: save, className: "btn-emerald w-full rounded-xl py-2.5 font-bold" }, "\u062D\u0641\u0638"));
}
function WithdrawalEntryModal({ onSave, onClose }) {
  const [amount, setAmount] = useState("");
  const [amountNumPadOpen, setAmountNumPadOpen] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const save = () => {
    const a = parseNum(amount);
    if (a === null || a <= 0) {
      setError("\u0627\u0643\u062A\u0628 \u0645\u0628\u0644\u063A \u0635\u062D\u064A\u062D");
      return;
    }
    onSave({ amount: a, note: note.trim() });
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u0633\u062C\u064A\u0644 \u0633\u062D\u0628 \u0641\u0644\u0648\u0633", accent: "#FBBF24", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0627\u0644\u0645\u0628\u0644\u063A"), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setAmountNumPadOpen(true),
      className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-3 text-center",
      style: { color: amount ? void 0 : "#64748B" }
    },
    amount || "\u0627\u0644\u0645\u0628\u0644\u063A"
  ), amountNumPadOpen && /* @__PURE__ */ React.createElement(
    NumPad,
    {
      title: "\u0627\u0644\u0645\u0628\u0644\u063A",
      initialValue: amount,
      onConfirm: (val) => {
        setAmount(val);
        setAmountNumPadOpen(false);
      },
      onClose: () => setAmountNumPadOpen(false)
    }
  ), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-1.5" }, "\u0645\u0644\u0627\u062D\u0638\u0629 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A\u060C \u062A\u0628\u0642\u0649 \u0644\u064A\u0643 \u0628\u0633)"), /* @__PURE__ */ React.createElement("input", { value: note, onChange: (e) => setNote(e.target.value), placeholder: "\u0645\u062B\u0627\u0644: \u0645\u0635\u0627\u0631\u064A\u0641 \u0645\u0634\u0648\u0627\u0631", className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-3" }), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("button", { onClick: save, className: "btn-emerald w-full rounded-xl py-2.5 font-bold" }, "\u062A\u0633\u062C\u064A\u0644"));
}
function AttendanceCalendar({ employeeName, records, withdrawals, editable, branches, onEditDay }) {
  const [monthDate, setMonthDate] = useState(() => {
    const d = /* @__PURE__ */ new Date();
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
  const weekdayLabels = ["\u0633", "\u062D", "\u0646", "\u062B", "\u0631", "\u062E", "\u062C"];
  const today = todayStr();
  const changeMonth = (delta) => {
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + delta);
    setMonthDate(d);
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => changeMonth(-1), className: "icon-btn rounded-lg px-3 py-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16, className: "rotate-180" })), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm text-white" }, monthLabel), /* @__PURE__ */ React.createElement("button", { onClick: () => changeMonth(1), className: "icon-btn rounded-lg px-3 py-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-7 gap-1 mb-1" }, weekdayLabels.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "text-center text-[10px] text-[#64748B] font-bold" }, w))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-7 gap-1 mb-4" }, Array.from({ length: startOffset }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: `e${i}` })), Array.from({ length: daysCount }).map((_, i) => {
    const day = i + 1;
    const dateStr = `${monthPrefix}-${String(day).padStart(2, "0")}`;
    const rec = byDate[dateStr];
    const withdrawalTotal = withdrawalTotalByDate[dateStr];
    const statusInfo = rec?.attendanceStatus ? ATTENDANCE_STATUS[rec.attendanceStatus] : null;
    const isToday = dateStr === today;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: day,
        onClick: () => setSelectedDay(dateStr),
        className: "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5",
        style: {
          background: statusInfo ? `${statusInfo.color}1F` : "rgba(255,255,255,0.03)",
          border: isToday ? "1.5px solid #38BDF8" : "1px solid transparent"
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-white" }, day),
      statusInfo && /* @__PURE__ */ React.createElement("span", { className: "w-1.5 h-1.5 rounded-full", style: { background: statusInfo.color } }),
      withdrawalTotal ? /* @__PURE__ */ React.createElement("span", { className: "text-[8px] text-amber-300 font-bold leading-none" }, withdrawalTotal) : null
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2 mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "price-chip text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-[#94A3B8] mb-0.5" }, "\u0623\u064A\u0627\u0645 \u0627\u0644\u062D\u0636\u0648\u0631"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-emerald-400 tabular-nums" }, stats.present)), /* @__PURE__ */ React.createElement("div", { className: "price-chip text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-[#94A3B8] mb-0.5" }, "\u0623\u064A\u0627\u0645 \u0627\u0644\u063A\u064A\u0627\u0628"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-rose-400 tabular-nums" }, stats.absent)), /* @__PURE__ */ React.createElement("div", { className: "price-chip text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-[#94A3B8] mb-0.5" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u062D\u0628"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-amber-400 tabular-nums" }, monthWithdrawalTotal))), selectedDay && editable && /* @__PURE__ */ React.createElement(
    DayEditModal,
    {
      dateStr: selectedDay,
      existing: byDate[selectedDay],
      branches,
      suggestedBranchId: suggestUsualBranch(records, employeeName),
      onSave: (vals) => {
        onEditDay(selectedDay, vals);
        setSelectedDay(null);
      },
      onClose: () => setSelectedDay(null)
    }
  ), selectedDay && !editable && /* @__PURE__ */ React.createElement(Modal, { title: new Date(selectedDay).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" }), accent: "#0EA5E9", onClose: () => setSelectedDay(null) }, /* @__PURE__ */ React.createElement("div", { className: "space-y-2 text-sm" }, /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, "\u0627\u0644\u062D\u0636\u0648\u0631: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold", style: { color: ATTENDANCE_STATUS[byDate[selectedDay]?.attendanceStatus]?.color } }, ATTENDANCE_STATUS[byDate[selectedDay]?.attendanceStatus]?.label || "-")), /* @__PURE__ */ React.createElement("p", { className: "text-[#CBD5E1]" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0633\u062D\u0628 \u0641\u064A \u0627\u0644\u064A\u0648\u0645 \u062F\u0647: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-amber-300" }, withdrawalTotalByDate[selectedDay] || 0)))));
}
function AttendanceScreen({ user, users, attendance, setAttendance, withdrawals, setWithdrawals, branchSettings, setView }) {
  const isAdmin = userIsAdmin(user) || !!user.permissions?.viewAllAttendance;
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
      branchId: vals.branchId || null,
      createdAt: existing ? existing.createdAt : Date.now(),
      updatedAt: Date.now()
    };
    setAttendance(existing ? attendance.map((r) => r.id === existing.id ? record : r) : [...attendance, record]);
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
      createdAt: now
    };
    setWithdrawals([...withdrawals, record]);
    withdrawalsStore.upsert(record);
    setShowWithdrawal(false);
  };
  if (isAdmin && !selectedEmployee) {
    const employeeList = users.filter((u) => u.role === "employee" && u.status === "approved");
    return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(PullToRefresh, { onRefresh: handleRefresh }), /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u0633\u062D\u0628", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up space-y-3 pb-6" }, employeeList.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0648\u0638\u0641\u064A\u0646 \u0645\u0639\u062A\u0645\u062F\u064A\u0646 \u0628\u0639\u062F"), employeeList.map((u) => /* @__PURE__ */ React.createElement("button", { key: u.id, onClick: () => setSelectedEmployee(u.name), className: "panel rounded-2xl p-4 w-full text-right flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white text-sm" }, u.name), /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16, className: "text-[#94A3B8] rotate-180" })))));
  }
  const myWithdrawals = !isAdmin ? withdrawals.filter((w) => w.employeeName === user.name).sort((a, b) => b.createdAt - a.createdAt).slice(0, 40) : [];
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(PullToRefresh, { onRefresh: handleRefresh }), /* @__PURE__ */ React.createElement(
    Header,
    {
      user,
      onLogout: () => setView("logout"),
      onBack: () => isAdmin ? setSelectedEmployee(null) : setView("menu"),
      title: isAdmin ? selectedEmployee : "\u0627\u0644\u062D\u0636\u0648\u0631 \u0648\u0627\u0644\u0633\u062D\u0628"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up pb-6" }, /* @__PURE__ */ React.createElement(
    AttendanceCalendar,
    {
      employeeName: selectedEmployee,
      records: attendance,
      withdrawals,
      editable: !isAdmin,
      branches: branchSettings.branches,
      onEditDay: (dateStr, vals) => saveDay(selectedEmployee, dateStr, vals)
    }
  ), !isAdmin && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowWithdrawal(true), className: "btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mt-2 mb-5" }, /* @__PURE__ */ React.createElement(Icon, { name: "Wallet", size: 17 }), " \u062A\u0633\u062C\u064A\u0644 \u0633\u062D\u0628 \u0641\u0644\u0648\u0633"), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-sm text-white mb-2" }, "\u0633\u062D\u0648\u0628\u0627\u062A\u064A"), myWithdrawals.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-4 text-xs" }, "\u0644\u0633\u0647 \u0645\u0627 \u0633\u062C\u0644\u062A\u0634 \u0623\u064A \u0633\u062D\u0628"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, myWithdrawals.map((w) => /* @__PURE__ */ React.createElement("div", { key: w.id, className: "panel rounded-xl p-3 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8]" }, new Date(w.createdAt).toLocaleString("ar-EG")), w.note && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#CBD5E1] mt-0.5" }, w.note)), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-amber-300 tabular-nums" }, w.amount))))), showWithdrawal && /* @__PURE__ */ React.createElement(WithdrawalEntryModal, { onSave: saveWithdrawal, onClose: () => setShowWithdrawal(false) })));
}
function StockAlertsScreen({ user, stockAlerts, setStockAlerts, setView }) {
  const [branchFilter, setBranchFilter] = useState("all");
  const unresolved = stockAlerts.filter((a) => !a.resolved).filter((a) => {
    if (branchFilter === "all") return true;
    if (branchFilter === "missing") return a.type === "missingProduct";
    return a.branch === branchFilter;
  }).sort((a, b) => b.reportedAt - a.reportedAt);
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
    setStockAlerts(stockAlerts.map((a) => a.id === alert.id ? updated : a));
    stockAlertsStore.upsert(updated);
  };
  const AlertCard = ({ a }) => /* @__PURE__ */ React.createElement("div", { className: "panel p-4 rounded-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-2 mb-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1.5",
      style: { background: a.type === "outOfStock" ? "#F59E0B22" : "#A855F722", color: a.type === "outOfStock" ? "#F59E0B" : "#C084FC" }
    },
    a.type === "outOfStock" ? "\u0645\u0646\u062A\u062C \u062E\u0644\u0635" : "\u0637\u0644\u0628 \u0645\u0646\u062A\u062C \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F"
  ), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-sm text-white" }, a.productName), a.branch && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "MapPin", size: 12 }), " \u0641\u0631\u0639 ", a.branch)), !a.resolved && /* @__PURE__ */ React.createElement("button", { onClick: () => resolve(a), className: "text-xs btn-emerald px-3 py-1.5 rounded-lg font-semibold shrink-0 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 13 }), " \u062A\u0645 \u0627\u0644\u062D\u0644")), /* @__PURE__ */ React.createElement("p", { className: "text-xs font-bold text-amber-300" }, a.reportedBy, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#64748B] font-normal" }, "\xB7 ", new Date(a.reportedAt).toLocaleString("ar-EG"))));
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(PullToRefresh, { onRefresh: handleRefresh }), /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3 overflow-x-auto" }, [
    { key: "all", label: "\u0627\u0644\u0643\u0644" },
    { key: "\u0627\u0644\u0633\u0646\u0627\u0646\u064A\u0629", label: "\u0627\u0644\u0633\u0646\u0627\u0646\u064A\u0629" },
    { key: "\u0627\u0644\u0645\u0637\u0631\u064A", label: "\u0627\u0644\u0645\u0637\u0631\u064A" },
    { key: "missing", label: "\u0645\u0646\u062A\u062C\u0627\u062A \u0645\u0637\u0644\u0648\u0628\u0629" }
  ].map((tab) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: tab.key,
      onClick: () => setBranchFilter(tab.key),
      className: `toggle-pill rounded-full px-3 py-1.5 text-xs font-bold shrink-0 ${branchFilter === tab.key ? "active-sky" : ""}`
    },
    tab.label
  ))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pb-4" }, unresolved.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[#64748B] py-8 text-sm" }, "\u0645\u0641\u064A\u0634 \u062A\u0646\u0628\u064A\u0647\u0627\u062A \u062C\u062F\u064A\u062F\u0629"), unresolved.map((a) => /* @__PURE__ */ React.createElement(AlertCard, { key: a.id, a }))), resolved.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowResolved((v) => !v), className: "text-xs text-sky-400 font-semibold mb-3 hover:underline" }, showResolved ? "\u0625\u062E\u0641\u0627\u0621 \u0627\u0644\u0645\u064F\u062A\u0645 \u062D\u0644\u0647\u0627" : `\u0639\u0631\u0636 \u0627\u0644\u0645\u064F\u062A\u0645 \u062D\u0644\u0647\u0627 (${resolved.length})`), showResolved && /* @__PURE__ */ React.createElement("div", { className: "space-y-3 pb-6 opacity-60" }, resolved.map((a) => /* @__PURE__ */ React.createElement(AlertCard, { key: a.id, a }))))));
}
function ChangePasswordModal({ user, users, setUsers, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (!currentPassword) {
      setError("\u0627\u0643\u062A\u0628 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setError("\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0644\u0627\u0632\u0645 \u062A\u0643\u0648\u0646 \u0664 \u062D\u0631\u0648\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("\u0643\u0644\u0645\u062A\u0627 \u0627\u0644\u0633\u0631 \u0645\u0634 \u0645\u062A\u0637\u0627\u0628\u0642\u062A\u064A\u0646");
      return;
    }
    setBusy(true);
    const email = authEmailForName(user.name);
    const reauth = await signInWithEmailPassword(email, currentPassword);
    if (reauth.networkError) {
      setBusy(false);
      setError("\u0645\u0641\u064A\u0634 \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A\u060C \u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0644\u0646\u062A \u0648\u062C\u0631\u0628 \u062A\u0627\u0646\u064A");
      return;
    }
    if (!reauth.ok) {
      setBusy(false);
      setError(`\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u063A\u0644\u0637 (${reauth.detail || "?"})`);
      return;
    }
    setAuthTokens(reauth.data);
    const res = await updateOwnPassword(newPassword);
    setBusy(false);
    if (!res.ok) {
      setError(`\u062D\u0635\u0644\u062A \u0645\u0634\u0643\u0644\u0629\u060C \u062C\u0631\u0628 \u062A\u0627\u0646\u064A (${res.detail || "?"})`);
      return;
    }
    onClose();
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631", accent: "#38BDF8", onClose }, /* @__PURE__ */ React.createElement("input", { type: "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629", className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-2" }), /* @__PURE__ */ React.createElement("input", { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631 \u0627\u0644\u062C\u062F\u064A\u062F\u0629", className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-2" }), /* @__PURE__ */ React.createElement("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631", className: "field-input w-full rounded-xl px-3 py-2 text-sm mb-3" }), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { disabled: busy, onClick: save, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold disabled:opacity-60" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621")));
}
function TierSettingsModal({ tierSettings, setTierSettings, onClose }) {
  const [tiers, setTiers] = useState(tierSettings.tiers);
  const [hideFromCustomer, setHideFromCustomer] = useState(tierSettings.hideFromCustomer);
  const [tierError, setTierError] = useState("");
  const TIER_COLOR_CHOICES = ["#34D399", "#FBBF24", "#FB7185", "#60A5FA", "#A78BFA", "#F97316", "#2DD4BF"];
  const activeList = tiers.filter((t) => !t.archived);
  const archivedList = tiers.filter((t) => t.archived);
  const updateTier = (id, patch) => {
    setTiers(tiers.map((t) => t.id === id ? { ...t, ...patch } : t));
  };
  const addTier = () => {
    const usedColors = tiers.map((t) => t.color);
    const nextColor = TIER_COLOR_CHOICES.find((c) => !usedColors.includes(c)) || "#94A3B8";
    setTiers([...tiers, { id: uid(), label: "", color: nextColor, archived: false }]);
  };
  const archiveTier = (id) => {
    if (activeList.length <= 1) return;
    updateTier(id, { archived: true });
  };
  const restoreTier = (id) => {
    updateTier(id, { archived: false });
  };
  const save = () => {
    if (activeList.some((t) => !t.label.trim())) {
      setTierError("\u0644\u0627\u0632\u0645 \u0643\u0644 \u062A\u0635\u0646\u064A\u0641 \u064A\u0643\u0648\u0646 \u0644\u0647 \u0627\u0633\u0645");
      return;
    }
    setTierError("");
    const updated = { ...tierSettings, tiers, hideFromCustomer };
    setTierSettings(updated);
    settingsStore.upsert(updated);
    onClose();
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u0645\u064A\u0632\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629", accent: "#10B981", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0627\u0644\u0623\u0633\u0639\u0627\u0631 (\u0627\u0644\u0623\u0633\u0645\u0627\u0621 \u0648\u0627\u0644\u0623\u0644\u0648\u0627\u0646)"), activeList.map((tier) => /* @__PURE__ */ React.createElement("div", { key: tier.id, className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: tier.label,
      onChange: (e) => updateTier(tier.id, { label: e.target.value }),
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u062A\u0635\u0646\u064A\u0641",
      className: "field-input flex-1 rounded-xl px-3 py-2 text-sm"
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: tier.color,
      onChange: (e) => updateTier(tier.id, { color: e.target.value }),
      className: "w-11 h-10 rounded-lg border border-white/10 bg-transparent shrink-0"
    }
  ), activeList.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => archiveTier(tier.id), className: "text-rose-400 shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash2", size: 16 })))), /* @__PURE__ */ React.createElement("button", { onClick: addTier, className: "w-full text-xs text-sky-400 font-semibold flex items-center justify-center gap-1 py-2 mb-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 14 }), " \u0625\u0636\u0627\u0641\u0629 \u062A\u0635\u0646\u064A\u0641 \u0633\u0639\u0631 \u062C\u062F\u064A\u062F"), archivedList.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "mb-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0645\u062D\u0630\u0648\u0641\u0629 (\u062A\u0642\u062F\u0631 \u062A\u0631\u062C\u0651\u0639\u0647\u0627)"), archivedList.map((tier) => /* @__PURE__ */ React.createElement("div", { key: tier.id, className: "flex items-center gap-2 mb-2 opacity-70" }, /* @__PURE__ */ React.createElement("span", { className: "flex-1 field-input rounded-xl px-3 py-2 text-sm" }, tier.label || "(\u0628\u062F\u0648\u0646 \u0627\u0633\u0645)"), /* @__PURE__ */ React.createElement("span", { className: "w-11 h-10 rounded-lg shrink-0", style: { background: tier.color } }), /* @__PURE__ */ React.createElement("button", { onClick: () => restoreTier(tier.id), className: "text-emerald-400 shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "RefreshCw", size: 16 }))))), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-xs text-[#CBD5E1] mb-3" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: hideFromCustomer, onChange: (e) => setHideFromCustomer(e.target.checked) }), "\u0625\u062E\u0641\u0627\u0621 \u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A \u0639\u0646 \u0627\u0644\u0632\u0628\u0648\u0646 \u0641\u064A \u0627\u0644\u0643\u0627\u0634\u064A\u0631 (\u0632\u0631\u0627\u064A\u0631 \u0645\u0644\u0648\u0646\u0629 \u0628\u0633)"), tierError && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, tierError), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: save, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621")));
}
function InvoiceNumberSettingsModal({ invoiceNumberSettings, setInvoiceNumberSettings, onClose }) {
  const [resetFrequency, setResetFrequency] = useState(invoiceNumberSettings.resetFrequency);
  const [resetNowConfirm, setResetNowConfirm] = useState(false);
  const FREQ_OPTIONS = [
    { key: "never", label: "\u0623\u0628\u062F\u064B\u0627 (\u064A\u0641\u0636\u0644 \u064A\u0632\u064A\u062F \u0639\u0644\u0649 \u0637\u0648\u0644)" },
    { key: "daily", label: "\u064A\u0648\u0645\u064A\u064B\u0627 (\u064A\u0631\u062C\u0639 \u0661 \u0643\u0644 \u064A\u0648\u0645)" },
    { key: "monthly", label: "\u0634\u0647\u0631\u064A\u064B\u0627 (\u064A\u0631\u062C\u0639 \u0661 \u0643\u0644 \u0634\u0647\u0631)" }
  ];
  const save = () => {
    const updated = { ...invoiceNumberSettings, resetFrequency };
    setInvoiceNumberSettings(updated);
    settingsStore.upsert(updated);
    onClose();
  };
  const resetNow = () => {
    const updated = { ...invoiceNumberSettings, resetFrequency, nextNumber: 1, lastResetKey: currentResetKey(resetFrequency) };
    setInvoiceNumberSettings(updated);
    settingsStore.upsert(updated);
    setResetNowConfirm(false);
    onClose();
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u0631\u0642\u064A\u0645 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631", accent: "#10B981", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-3" }, "\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u062C\u0627\u064A\u0629: ", /* @__PURE__ */ React.createElement("span", { className: "text-white font-bold" }, invoiceNumberSettings.nextNumber)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u0627\u0644\u0631\u064A\u0633\u064A\u062A \u0627\u0644\u062A\u0644\u0642\u0627\u0626\u064A"), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4" }, FREQ_OPTIONS.map((opt) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: opt.key,
      onClick: () => setResetFrequency(opt.key),
      className: `w-full text-right rounded-xl px-3 py-2.5 text-sm font-bold ${resetFrequency === opt.key ? "toggle-pill active-sky" : "field-input"}`
    },
    opt.label
  ))), !resetNowConfirm ? /* @__PURE__ */ React.createElement("button", { onClick: () => setResetNowConfirm(true), className: "w-full text-xs text-rose-400 font-semibold py-2 mb-3" }, "\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u062A\u0631\u0642\u064A\u0645 \u0644\u0640 \u0661 \u062F\u0644\u0648\u0642\u062A\u064A") : /* @__PURE__ */ React.createElement("div", { className: "mb-3 bg-rose-950/40 border border-rose-800 rounded-xl p-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-300 mb-2" }, "\u0645\u062A\u0623\u0643\u062F\u061F \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0627\u0644\u062C\u0627\u064A\u0629 \u0647\u062A\u0627\u062E\u062F \u0631\u0642\u0645 \u0661"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: resetNow, className: "flex-1 rounded-lg py-1.5 text-xs font-bold bg-rose-600 text-white" }, "\u0623\u064A\u0648\u0647"), /* @__PURE__ */ React.createElement("button", { onClick: () => setResetNowConfirm(false), className: "btn-ghost flex-1 rounded-lg py-1.5 text-xs font-bold" }, "\u0625\u0644\u063A\u0627\u0621"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: save, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621")));
}
function BranchSettingsModal({ branchSettings, setBranchSettings, onClose }) {
  const [branches, setBranches] = useState(branchSettings.branches);
  const [error, setError] = useState("");
  const updateBranch = (id, name) => {
    setBranches(branches.map((b) => b.id === id ? { ...b, name } : b));
  };
  const addBranch = () => {
    setBranches([...branches, { id: uid(), name: "" }]);
  };
  const removeBranch = (id) => {
    if (branches.length <= 1) return;
    setBranches(branches.filter((b) => b.id !== id));
  };
  const save = () => {
    if (branches.some((b) => !b.name.trim())) {
      setError("\u0644\u0627\u0632\u0645 \u0643\u0644 \u0641\u0631\u0639 \u064A\u0643\u0648\u0646 \u0644\u0647 \u0627\u0633\u0645");
      return;
    }
    setError("");
    const updated = { ...branchSettings, branches };
    setBranchSettings(updated);
    settingsStore.upsert(updated);
    onClose();
  };
  return /* @__PURE__ */ React.createElement(Modal, { title: "\u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u062D\u0644", accent: "#0EA5E9", onClose }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#94A3B8] mb-2" }, "\u0623\u0633\u0645\u0627\u0621 \u0627\u0644\u0641\u0631\u0648\u0639"), branches.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: b.name,
      onChange: (e) => updateBranch(b.id, e.target.value),
      placeholder: "\u0627\u0633\u0645 \u0627\u0644\u0641\u0631\u0639",
      className: "field-input flex-1 rounded-xl px-3 py-2 text-sm"
    }
  ), branches.length > 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => removeBranch(b.id), className: "text-rose-400 shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash2", size: 16 })))), /* @__PURE__ */ React.createElement("button", { onClick: addBranch, className: "w-full text-xs text-sky-400 font-semibold flex items-center justify-center gap-1 py-2 mb-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "Plus", size: 14 }), " \u0625\u0636\u0627\u0641\u0629 \u0641\u0631\u0639 \u062C\u062F\u064A\u062F"), error && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400 text-xs mb-3" }, error), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: save, className: "btn-emerald flex-1 rounded-xl py-2 text-sm font-bold" }, "\u062D\u0641\u0638"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0625\u0644\u063A\u0627\u0621")));
}
function SettingsScreen({ user, users, setUsers, tierSettings, setTierSettings, invoiceNumberSettings, setInvoiceNumberSettings, branchSettings, setBranchSettings, onDevReset, onDevSalesReset, setView }) {
  const isAdmin = userIsAdmin(user);
  const isDev = userIsDeveloper(user);
  const canTierSettings = isAdmin || !!user.permissions?.manageTierSettings;
  const canInvoiceNumbering = isAdmin || !!user.permissions?.manageInvoiceNumbering;
  const canBranches = isAdmin || !!user.permissions?.manageBranches;
  const [openSection, setOpenSection] = useState(null);
  const items = [
    { key: "password", label: "\u062A\u063A\u064A\u064A\u0631 \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631", icon: "Lock" },
    ...isDev ? [{ key: "dev", label: "\u0623\u062F\u0648\u0627\u062A \u0627\u0644\u0635\u064A\u0627\u0646\u0629 (Reset)", icon: "KeyRound" }] : [],
    ...isDev ? [{ key: "devSales", label: "\u0645\u0633\u062D \u0627\u0644\u0645\u0628\u064A\u0639\u0627\u062A \u0648\u0627\u0644\u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0627\u0644\u0642\u062F\u064A\u0645\u0629", icon: "RotateCcw" }] : [],
    ...canTierSettings ? [{ key: "tiers", label: "\u0645\u064A\u0632\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629", icon: "Settings" }] : [],
    ...canInvoiceNumbering ? [{ key: "invoiceNumbering", label: "\u062A\u0631\u0642\u064A\u0645 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631", icon: "Tag" }] : [],
    ...canBranches ? [{ key: "branches", label: "\u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u062D\u0644", icon: "MapPin" }] : []
  ];
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up space-y-2 pb-6" }, items.map((it) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: it.key,
      onClick: () => setOpenSection(it.key),
      className: "panel rounded-2xl p-4 w-full flex items-center justify-between text-right"
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm text-white flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { name: it.icon, size: 16 }), it.label),
    /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16, className: "text-[#64748B]" })
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setView("logout"),
      className: "w-full rounded-2xl p-4 flex items-center gap-2 text-right mt-2",
      style: { background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)" }
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "LogOut", size: 16, className: "text-rose-400" }),
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm text-rose-400" }, "\u062A\u0633\u062C\u064A\u0644 \u062E\u0631\u0648\u062C")
  )), openSection === "password" && /* @__PURE__ */ React.createElement(ChangePasswordModal, { user, users, setUsers, onClose: () => setOpenSection(null) }), openSection === "dev" && /* @__PURE__ */ React.createElement(DevResetModal, { onConfirmed: onDevReset, onClose: () => setOpenSection(null) }), openSection === "devSales" && /* @__PURE__ */ React.createElement(DevSalesResetModal, { onConfirmed: onDevSalesReset, onClose: () => setOpenSection(null) }), openSection === "tiers" && /* @__PURE__ */ React.createElement(TierSettingsModal, { tierSettings, setTierSettings, onClose: () => setOpenSection(null) }), openSection === "invoiceNumbering" && /* @__PURE__ */ React.createElement(InvoiceNumberSettingsModal, { invoiceNumberSettings, setInvoiceNumberSettings, onClose: () => setOpenSection(null) }), openSection === "branches" && /* @__PURE__ */ React.createElement(BranchSettingsModal, { branchSettings, setBranchSettings, onClose: () => setOpenSection(null) }));
}
function AdminScreen({ user, users, setUsers, setView }) {
  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved" && u.role !== "admin" && u.role !== "developer");
  const otherAdmins = users.filter((u) => (u.role === "admin" || u.role === "developer") && u.id !== user.id);
  const [justActed, setJustActed] = useState(null);
  const isSeniorTo = (me, target) => {
    if (me.id === target.id) return false;
    if (!me.promotedAt && !target.promotedAt) return false;
    if (!me.promotedAt) return true;
    if (!target.promotedAt) return false;
    return me.promotedAt < target.promotedAt;
  };
  const PERMISSIONS = [
    { key: "manageProducts", label: "\u0635\u0644\u0627\u062D\u064A\u0629 \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
    { key: "deleteProducts", label: "\u0635\u0644\u0627\u062D\u064A\u0629 \u062D\u0630\u0641 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A" },
    { key: "editPrices", label: "\u0635\u0644\u0627\u062D\u064A\u0629 \u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631" },
    { key: "manageUsers", label: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 (\u0627\u0644\u0645\u0648\u0627\u0641\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0637\u0644\u0628\u0627\u062A \u0648\u0635\u0644\u0627\u062D\u064A\u0627\u062A \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646)" },
    { key: "viewReports", label: "\u0627\u0644\u0627\u0637\u0644\u0627\u0639 \u0639\u0644\u0649 \u0627\u0644\u062A\u0642\u0627\u0631\u064A\u0631" },
    { key: "manageStockAlerts", label: "\u062A\u0646\u0628\u064A\u0647\u0627\u062A \u0627\u0644\u0645\u062E\u0632\u0648\u0646" },
    { key: "viewAllOrders", label: "\u0631\u0624\u064A\u0629 \u0643\u0644 \u0627\u0644\u0623\u0648\u0631\u062F\u0631\u0627\u062A (\u0645\u0634 \u0623\u0648\u0631\u062F\u0631\u0627\u062A\u0647 \u0628\u0633)" },
    { key: "viewAllAttendance", label: "\u0631\u0624\u064A\u0629 \u062D\u0636\u0648\u0631 \u0648\u0633\u062D\u0628 \u0643\u0644 \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646" },
    { key: "quickTierChange", label: "\u062A\u063A\u064A\u064A\u0631 \u062A\u0635\u0646\u064A\u0641 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0641\u064A \u0627\u0644\u0643\u0627\u0634\u064A\u0631 \u0645\u0628\u0627\u0634\u0631\u0629" },
    { key: "quickPriceOverride", label: "\u062A\u0639\u062F\u064A\u0644 \u0627\u0644\u0633\u0639\u0631 \u064A\u062F\u0648\u064A \u0641\u064A \u0627\u0644\u0643\u0627\u0634\u064A\u0631 \u0645\u0628\u0627\u0634\u0631\u0629" },
    { key: "manageTierSettings", label: "\u0645\u064A\u0632\u0627\u062A \u0625\u0636\u0627\u0641\u064A\u0629 (\u0623\u0644\u0648\u0627\u0646 \u0627\u0644\u062A\u0635\u0646\u064A\u0641\u0627\u062A)" },
    { key: "manageInvoiceNumbering", label: "\u062A\u0631\u0642\u064A\u0645 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631" },
    { key: "manageBranches", label: "\u0641\u0631\u0648\u0639 \u0627\u0644\u0645\u062D\u0644" }
  ];
  const decide = (u, status) => {
    const updated = { ...u, status };
    setUsers(users.map((x) => x.id === u.id ? updated : x));
    usersStore.upsert(updated);
    setJustActed(u.id);
    setTimeout(() => setJustActed(null), 500);
  };
  const togglePermission = (u, key) => {
    const updated = { ...u, permissions: { ...u.permissions, [key]: !u.permissions?.[key] } };
    setUsers(users.map((x) => x.id === u.id ? updated : x));
    usersStore.upsert(updated);
  };
  const promoteToAdmin = (u) => {
    const allTrue = Object.fromEntries(PERMISSIONS.map((p) => [p.key, true]));
    const updated = { ...u, role: "admin", promotedAt: Date.now(), promotedBy: user.id, permissions: allTrue };
    setUsers(users.map((x) => x.id === u.id ? updated : x));
    usersStore.upsert(updated);
  };
  const demoteToEmployee = (u) => {
    if (!isSeniorTo(user, u)) return;
    const noPerms = Object.fromEntries(PERMISSIONS.map((p) => [p.key, false]));
    const updated = { ...u, role: "employee", promotedAt: null, promotedBy: null, permissions: noPerms };
    setUsers(users.map((x) => x.id === u.id ? updated : x));
    usersStore.upsert(updated);
  };
  const removeUser = (id) => {
    const target = users.find((x) => x.id === id);
    if (target && (target.role === "admin" || target.role === "developer") && !isSeniorTo(user, target)) return;
    setUsers(users.filter((u) => u.id !== id));
    usersStore.remove(id);
  };
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState("");
  const [restoreDone, setRestoreDone] = useState(false);
  const restoreFileRef = React.useRef(null);
  const legacyUsers = users.filter((u) => u.authUid && u.id !== u.authUid);
  const [migrating, setMigrating] = useState(false);
  const [migrateProgress, setMigrateProgress] = useState("");
  const [migrateDone, setMigrateDone] = useState(false);
  const migrateUserIds = async () => {
    setMigrating(true);
    setMigrateDone(false);
    let done = 0;
    const updated = [...users];
    for (const u of legacyUsers) {
      const newRecord = { ...u, id: u.authUid };
      const ok = await usersStore.upsert(newRecord);
      if (ok) {
        await usersStore.remove(u.id);
        const idx = updated.findIndex((x) => x.id === u.id);
        if (idx !== -1) updated[idx] = newRecord;
      }
      done++;
      setMigrateProgress(`${done}/${legacyUsers.length}`);
    }
    setUsers(updated);
    setMigrating(false);
    setMigrateDone(true);
  };
  const downloadBackup = async () => {
    setBackingUp(true);
    const data = {};
    for (const [name, store] of Object.entries(STORE_BY_COLLECTION)) {
      data[name] = await store.loadAll() || [];
    }
    const payload = { exportedAt: Date.now(), app: "FaAroon", data };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
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
      setRestoreProgress("\u0645\u0644\u0641 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D \u2014 \u062A\u0623\u0643\u062F \u0625\u0646\u0647 \u0646\u0641\u0633 \u0645\u0644\u0641 \u0627\u0644\u0646\u0633\u062E\u0629 \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0627\u0644\u0644\u064A \u0646\u0632\u0651\u0644\u062A\u0647 \u0645\u0646 \u0647\u0646\u0627");
    }
    setRestoring(false);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-4 fade-up space-y-6" }, /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", { className: "font-bold text-sm text-sky-400 mb-3" }, "\u0637\u0644\u0628\u0627\u062A \u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631 (", pending.length, ")"), pending.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#64748B]" }, "\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A \u062C\u062F\u064A\u062F\u0629"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, pending.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.id, className: "panel rounded-2xl p-4 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm text-white" }, u.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-[#64748B]" }, "\u0637\u0644\u0628 \u0627\u0646\u0636\u0645\u0627\u0645 \u062C\u062F\u064A\u062F")), /* @__PURE__ */ React.createElement("div", { className: `flex gap-2 ${justActed === u.id ? "stamp-anim" : ""}` }, /* @__PURE__ */ React.createElement("button", { onClick: () => decide(u, "approved"), className: "btn-emerald rounded-lg p-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 17 })), /* @__PURE__ */ React.createElement("button", { onClick: () => decide(u, "rejected"), className: "btn-rose rounded-lg p-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "XCircle", size: 17 }))))))), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", { className: "font-bold text-sm text-sky-400 mb-3" }, "\u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0648\u0646 \u0627\u0644\u0645\u0639\u062A\u0645\u062F\u0648\u0646 (", approved.length, ")"), approved.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#64748B]" }, "\u0644\u0627 \u064A\u0648\u062C\u062F \u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646 \u0628\u0639\u062F"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, approved.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.id, className: "panel rounded-2xl p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm flex items-center gap-2 text-white" }, u.name, " ", /* @__PURE__ */ React.createElement(StatusStamp, { status: u.status })), /* @__PURE__ */ React.createElement("button", { onClick: () => removeUser(u.id), className: "text-rose-400 hover:text-rose-300" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash2", size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, PERMISSIONS.map((p) => /* @__PURE__ */ React.createElement("label", { key: p.key, className: "flex items-center gap-2 text-xs text-[#CBD5E1]" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: !!u.permissions?.[p.key], onChange: () => togglePermission(u, p.key) }), p.label))), /* @__PURE__ */ React.createElement("button", { onClick: () => promoteToAdmin(u), className: "btn-ghost w-full rounded-xl py-2 text-xs font-bold mt-3" }, "\u0631\u0641\u0639\u0647 \u0644\u0623\u062F\u0645\u0646 \u0643\u0627\u0645\u0644"))))), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", { className: "font-bold text-sm text-sky-400 mb-3" }, "\u0627\u0644\u0623\u062F\u0645\u0646\u0632 \u0627\u0644\u0622\u062E\u0631\u064A\u0646 (", otherAdmins.length, ")"), otherAdmins.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#64748B]" }, "\u0645\u0641\u064A\u0634 \u0623\u062F\u0645\u0646\u0632 \u062A\u0627\u0646\u064A\u064A\u0646"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, otherAdmins.map((u) => {
    const senior = isSeniorTo(user, u);
    return /* @__PURE__ */ React.createElement("div", { key: u.id, className: "panel rounded-2xl p-4 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-sm text-white" }, u.name), /* @__PURE__ */ React.createElement("div", { className: "text-xs text-[#64748B]" }, u.role === "developer" ? "\u0645\u0637\u0648\u0651\u0631" : "\u0623\u062F\u0645\u0646", !u.promotedAt ? " \xB7 \u0623\u0635\u0644\u064A" : "")), u.role !== "developer" && (senior ? /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => demoteToEmployee(u), className: "btn-ghost rounded-lg px-3 py-1.5 text-xs font-bold" }, "\u062E\u0641\u0636\u0647 \u0644\u0645\u0648\u0638\u0641"), /* @__PURE__ */ React.createElement("button", { onClick: () => removeUser(u.id), className: "text-rose-400 hover:text-rose-300" }, /* @__PURE__ */ React.createElement(Icon, { name: "Trash2", size: 16 }))) : /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-[#64748B]" }, "\u0623\u0642\u062F\u0645 \u0645\u0646\u0643 \u2014 \u0645\u064A\u0646\u0641\u0639\u0634 \u062A\u0639\u062F\u0644\u0647")));
  }))), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", { className: "font-bold text-sm text-sky-400 mb-3" }, "\u0627\u0644\u0646\u0633\u062E \u0627\u0644\u0627\u062D\u062A\u064A\u0627\u0637\u064A"), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 space-y-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#CBD5E1] mb-2" }, "\u062A\u062D\u0645\u064A\u0644 \u0646\u0633\u062E\u0629 \u0645\u0646 \u0643\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0637\u0628\u064A\u0642 (\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0623\u0648\u0631\u062F\u0631\u0627\u062A\u060C \u062A\u062D\u0648\u064A\u0644\u0627\u062A\u060C \u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646...) \u0641\u064A \u0645\u0644\u0641 \u0648\u0627\u062D\u062F \u062A\u0642\u062F\u0631 \u062A\u062D\u062A\u0641\u0638 \u0628\u064A\u0647."), /* @__PURE__ */ React.createElement("button", { onClick: downloadBackup, disabled: backingUp, className: "btn-emerald w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2" }, backingUp ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }), " \u0628\u064A\u062C\u0647\u0651\u0632 \u0627\u0644\u0645\u0644\u0641...") : "\u062A\u062D\u0645\u064A\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629")), /* @__PURE__ */ React.createElement("div", { className: "pt-3 border-t border-white/5" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#CBD5E1] mb-2" }, "\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0646 \u0645\u0644\u0641 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0633\u0627\u0628\u0642. \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629 ", /* @__PURE__ */ React.createElement("span", { className: "font-bold text-amber-300" }, "\u0645\u0634 \u0647\u062A\u062A\u0645\u0633\u062D"), " \u2014 \u0627\u0644\u0645\u0644\u0641 \u0647\u064A\u062F\u0645\u062C \u0628\u064A\u0627\u0646\u0627\u062A\u0647 \u0645\u0639 \u0627\u0644\u0645\u0648\u062C\u0648\u062F."), restoring ? /* @__PURE__ */ React.createElement("p", { className: "text-xs text-sky-400 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 14, className: "animate-spin" }), " \u0628\u064A\u0633\u062A\u0639\u064A\u062F... ", restoreProgress) : restoreDone ? /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-400 font-bold flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 14 }), " \u062A\u0645\u062A \u0627\u0644\u0627\u0633\u062A\u0639\u0627\u062F\u0629 \u0628\u0646\u062C\u0627\u062D") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => restoreFileRef.current && restoreFileRef.current.click(), className: "btn-ghost w-full rounded-xl py-2.5 text-sm font-bold" }, "\u0627\u062E\u062A\u064A\u0627\u0631 \u0645\u0644\u0641 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629"), restoreProgress && !restoring && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-400 mt-2" }, restoreProgress)), /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: restoreFileRef,
      type: "file",
      accept: "application/json",
      className: "hidden",
      onChange: (e) => {
        if (e.target.files && e.target.files[0]) restoreBackup(e.target.files[0]);
        e.target.value = "";
      }
    }
  )))), legacyUsers.length > 0 && /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", { className: "font-bold text-sm text-sky-400 mb-3" }, "\u062A\u062D\u062F\u064A\u062B \u062D\u0633\u0627\u0628\u0627\u062A \u0627\u0644\u0645\u0648\u0638\u0641\u064A\u0646"), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 space-y-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#CBD5E1]" }, "\u0641\u064A\u0647 ", legacyUsers.length, " \u062D\u0633\u0627\u0628 \u0645\u0648\u0638\u0641 \u0645\u062A\u062E\u0632\u0646 \u0628\u0637\u0631\u064A\u0642\u0629 \u0642\u062F\u064A\u0645\u0629\u060C \u0644\u0627\u0632\u0645 \u0646\u062D\u062F\u062B\u0647\u0627 \u0627\u0644\u0623\u0648\u0644 \u0642\u0628\u0644 \u0645\u0627 \u0646\u0642\u062F\u0631 \u0646\u0623\u0645\u0651\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0635\u062D. \u064A\u0641\u0636\u0651\u0644 \u062A\u0639\u0645\u0644 \u0646\u0633\u062E\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629 \u0641\u0648\u0642 \u0642\u0628\u0644 \u0645\u0627 \u062A\u0639\u0645\u0644 \u0627\u0644\u062A\u062D\u062F\u064A\u062B \u062F\u0647."), migrateDone ? /* @__PURE__ */ React.createElement("p", { className: "text-xs text-emerald-400 font-bold flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 14 }), " \u062A\u0645 \u0627\u0644\u062A\u062D\u062F\u064A\u062B") : /* @__PURE__ */ React.createElement("button", { onClick: migrateUserIds, disabled: migrating, className: "btn-emerald w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2" }, migrating ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Icon, { name: "Loader2", size: 16, className: "animate-spin" }), " \u0628\u064A\u062D\u062F\u062B... ", migrateProgress) : "\u062A\u062D\u062F\u064A\u062B \u0627\u0644\u062D\u0633\u0627\u0628\u0627\u062A \u062F\u0644\u0648\u0642\u062A\u064A")))));
}
function App() {
  const [booting, setBooting] = useState(true);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [changedToday, setChangedToday] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [sales, setSales] = useState([]);
  const [tierSettings, setTierSettings] = useState(DEFAULT_TIER_SETTINGS);
  const [invoiceNumberSettings, setInvoiceNumberSettings] = useState(DEFAULT_INVOICE_NUMBER_SETTINGS);
  const [branchSettings, setBranchSettings] = useState(DEFAULT_BRANCH_SETTINGS);
  const [screen, setScreen] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingStatus, setPendingStatus] = useState("pending");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [lastSeen, setLastSeen] = useState({ prices: 0, reports: 0 });
  const [reminder, setReminder] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const remindedDateRef = React.useRef(null);
  const [syncError, setSyncError] = useState(null);
  const [syncErrorCopied, setSyncErrorCopied] = useState(false);
  useEffect(() => {
    const handler = (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement("span");
      ripple.className = "ripple-el";
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
      btn.style.overflow = "hidden";
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);
  useEffect(() => {
    const handler = (e) => {
      setSyncError(e.detail);
      setTimeout(() => setSyncError(null), 1e4);
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
    }
  };
  useEffect(() => {
    (async () => {
      const savedRefresh = loadSavedRefreshToken();
      if (!savedRefresh) {
        setBooting(false);
        return;
      }
      restoreRefreshToken(savedRefresh);
      let authFailedForReal = false;
      try {
        await ensureAuth();
      } catch (e) {
        if (!e.isNetworkError) authFailedForReal = true;
      }
      if (authFailedForReal) {
        clearSession();
        setBooting(false);
        return;
      }
      const storedUsers = await usersStore.loadAll();
      let u;
      if (storedUsers) {
        u = storedUsers;
        saveDataCache("users", storedUsers);
      } else {
        const cachedUsers = loadDataCache("users");
        if (!cachedUsers) {
          clearSession();
          setBooting(false);
          return;
        }
        u = cachedUsers;
      }
      setUsers(u);
      const [changesResult, categoriesResult, transfersResult, openOrdersResult] = await Promise.all([
        changesStore.loadAll(),
        categoriesStore.loadAll(),
        transfersStore.loadAll(),
        fetchOpenDeliveryOrders()
      ]);
      setChangedToday(changesResult || []);
      if (categoriesResult) {
        setCategories(categoriesResult);
        saveDataCache("categories", categoriesResult);
      } else {
        setCategories(loadDataCache("categories") || []);
      }
      setTransfers(transfersResult || []);
      if (openOrdersResult) {
        setSales(openOrdersResult);
        idbSet("open_orders_cache", openOrdersResult);
      } else {
        setSales(await idbGet("open_orders_cache") || []);
      }
      const sessionId = loadSessionUserId();
      if (sessionId) {
        const found = u.find((x) => x.id === sessionId && x.status === "approved");
        if (found) {
          setCurrentUser(found);
          setLastSeen({ prices: Date.now(), reports: Date.now() });
          setScreen("menu");
          ensureSettingsLoaded();
        }
      }
      setBooting(false);
      syncOfflineQueue();
    })();
  }, []);
  useEffect(() => {
    if (sales.length) idbSet("open_orders_cache", sales.filter((s) => s.fulfillment === "delivery"));
  }, [sales]);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  useEffect(() => {
    const updateCount = () => setPendingSyncCount(getOfflineQueue().length);
    updateCount();
    if (!currentUser) return;
    const onQueueChange = (e) => setPendingSyncCount(e.detail);
    const onOnline = () => syncOfflineQueue();
    window.addEventListener("offline-queue-change", onQueueChange);
    window.addEventListener("online", onOnline);
    const interval = setInterval(syncOfflineQueue, 3e4);
    return () => {
      window.removeEventListener("offline-queue-change", onQueueChange);
      window.removeEventListener("online", onOnline);
      clearInterval(interval);
    };
  }, [currentUser]);
  useEffect(() => {
    const check = () => {
      if (!currentUser) return;
      const now = /* @__PURE__ */ new Date();
      const todayKey = now.toDateString();
      const pastCutoff = now.getHours() > 11 || now.getHours() === 11 && now.getMinutes() >= 30;
      if (!pastCutoff || remindedDateRef.current === todayKey) return;
      const mine = sales.filter((s) => s.fulfillment === "delivery" && s.deliveryStatus !== "done" && s.employeeName === currentUser.name);
      if (mine.length > 0) {
        setReminder(mine);
        remindedDateRef.current = todayKey;
        sendNotification(currentUser.name, `\u0639\u0646\u062F\u0643 ${mine.length} ${mine.length === 1 ? "\u0623\u0648\u0631\u062F\u0631" : "\u0623\u0648\u0631\u062F\u0631\u0627\u062A"} \u0644\u0633\u0647 \u0645\u0627 \u0627\u062A\u0642\u0641\u0644\u0634 (\u062A\u062C\u0647\u064A\u0632/\u0625\u0631\u0633\u0627\u0644)`);
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification("FaAroon", { body: `\u0639\u0646\u062F\u0643 ${mine.length} \u0623\u0648\u0631\u062F\u0631 \u0644\u0633\u0647 \u0645\u0627 \u0627\u062A\u0642\u0641\u0644\u0634` });
          } catch {
          }
        }
      }
    };
    check();
    const interval = setInterval(check, 6e4);
    return () => clearInterval(interval);
  }, [currentUser, sales]);
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      const all = await notificationsStore.loadAll();
      if (!cancelled && all) {
        setNotifications(all.filter((n) => n.forUser === currentUser.name).sort((a, b) => b.createdAt - a.createdAt));
      }
    };
    load();
    const interval = setInterval(load, 6e4);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [currentUser]);
  const markNotificationRead = (id) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;
    const updated = { ...target, read: true };
    setNotifications(notifications.map((n) => n.id === id ? updated : n));
    notificationsStore.upsert(updated);
  };
  const markAllNotificationsRead = () => {
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    unread.forEach((n) => notificationsStore.upsert({ ...n, read: true }));
  };
  const handleLogin = async (name, password) => {
    setAuthError("");
    if (!name || !password) {
      setAuthError("\u0645\u0646 \u0641\u0636\u0644\u0643 \u0627\u0643\u062A\u0628 \u0627\u0644\u0627\u0633\u0645 \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631");
      return;
    }
    setAuthLoading(true);
    const email = authEmailForName(name);
    let signIn = await signInWithEmailPassword(email, password);
    if (signIn.networkError) {
      setAuthLoading(false);
      setAuthError("\u0645\u0641\u064A\u0634 \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A\u060C \u062A\u0623\u0643\u062F \u0645\u0646 \u0627\u0644\u0646\u062A \u0648\u062C\u0631\u0628 \u062A\u0627\u0646\u064A");
      return;
    }
    if (!signIn.ok) {
      setAuthLoading(false);
      setAuthError(`\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u0644\u0637 (${signIn.detail || "?"})`);
      return;
    }
    setAuthTokens(signIn.data);
    const storedUsers = await usersStore.loadAll();
    if (!storedUsers) {
      setAuthLoading(false);
      setAuthError("\u062D\u0635\u0644\u062A \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u060C \u062C\u0631\u0628 \u062A\u0627\u0646\u064A");
      return;
    }
    let u = storedUsers;
    let found = u.find((x) => x.authUid === signIn.data.localId) || u.find((x) => namesMatch(x.name, name));
    if (!found && name === "FaAroon") {
      found = {
        id: signIn.data.localId,
        name: "FaAroon",
        authUid: signIn.data.localId,
        authEmail: email,
        role: "developer",
        status: "approved",
        permissions: { manageProducts: true, deleteProducts: true, editPrices: true }
      };
      await usersStore.upsert(found);
      u = [...u, found];
    }
    setUsers(u);
    setAuthLoading(false);
    if (!found) {
      setAuthError("\u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u0644\u0637");
      clearSession();
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
  const handleRegister = async (name, password, confirm) => {
    setAuthError("");
    if (!name || !password) {
      setAuthError("\u0645\u0646 \u0641\u0636\u0644\u0643 \u0627\u0645\u0644\u0623 \u0643\u0644 \u0627\u0644\u062D\u0642\u0648\u0644");
      return;
    }
    if (password !== confirm) {
      setAuthError("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063A\u064A\u0631 \u0645\u062A\u0637\u0627\u0628\u0642\u0629");
      return;
    }
    if (users.some((u) => namesMatch(u.name, name))) {
      setAuthError("\u0627\u0644\u0627\u0633\u0645 \u062F\u0647 \u0645\u0633\u062A\u062E\u062F\u0645 \u0642\u0628\u0644 \u0643\u062F\u0647");
      return;
    }
    setAuthLoading(true);
    const email = authEmailForName(name);
    const signUp = await signUpWithEmailPassword(email, password);
    if (!signUp.ok) {
      setAuthLoading(false);
      if (/EMAIL_EXISTS/.test(signUp.detail || "")) {
        setAuthError("\u0627\u0644\u0627\u0633\u0645 \u062F\u0647 \u0645\u062A\u0633\u062C\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u062F\u062E\u0648\u0644 \u0628\u064A\u0647 \u0628\u0627\u0644\u0641\u0639\u0644 (\u062D\u062A\u0649 \u0644\u0648 \u0645\u0634 \u0638\u0627\u0647\u0631 \u0641\u064A \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646) \u2014 \u0644\u0627\u0632\u0645 \u064A\u062A\u0645\u0633\u062D \u0627\u0644\u062D\u0633\u0627\u0628 \u0627\u0644\u0642\u062F\u064A\u0645 \u0645\u0646 Firebase Authentication \u0627\u0644\u0623\u0648\u0644\u060C \u0645\u0634 \u0628\u0633 \u0645\u0646 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u064A\u0646");
      } else if (/WEAK_PASSWORD/.test(signUp.detail || "")) {
        setAuthError("\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0644\u0627\u0632\u0645 \u062A\u0643\u0648\u0646 6 \u0623\u062D\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644");
      } else {
        setAuthError("\u062D\u0635\u0644\u062A \u0645\u0634\u0643\u0644\u0629 \u0641\u064A \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628\u060C \u062C\u0631\u0628 \u062A\u0627\u0646\u064A");
      }
      return;
    }
    setAuthTokens(signUp.data);
    const freshUsers = await usersStore.loadAll();
    const isFreshInstall = Array.isArray(freshUsers) && freshUsers.length === 0;
    const newUser = {
      id: signUp.data.localId,
      name,
      authUid: signUp.data.localId,
      authEmail: email,
      role: isFreshInstall ? "admin" : "employee",
      status: isFreshInstall ? "approved" : "pending",
      permissions: { manageProducts: false, deleteProducts: false, editPrices: false }
    };
    setUsers([...freshUsers || users, newUser]);
    usersStore.upsert(newUser);
    setAuthLoading(false);
    if (isFreshInstall) {
      setCurrentUser(newUser);
      saveSession(newUser);
      setLastSeen({ prices: Date.now(), reports: Date.now() });
      setScreen("menu");
    } else {
      setPendingStatus("pending");
      setScreen("pending");
    }
  };
  const handleLogout = () => {
    setCurrentUser(null);
    setAuthError("");
    clearSession();
    setScreen("login");
  };
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [usingCachedProducts, setUsingCachedProducts] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const ensureSettingsLoaded = async () => {
    if (settingsLoaded) return;
    const loadedSettings = await settingsStore.loadAll();
    if (!loadedSettings) return;
    const savedTierSettings = loadedSettings.find((s) => s.id === "tier_settings");
    if (savedTierSettings) {
      let tiers = savedTierSettings.tiers;
      if (!tiers && savedTierSettings.labels) {
        tiers = Object.keys(savedTierSettings.labels).map((id) => ({
          id,
          label: savedTierSettings.labels[id],
          color: savedTierSettings.colors && savedTierSettings.colors[id] || "#94A3B8",
          archived: false
        }));
      }
      setTierSettings({
        ...DEFAULT_TIER_SETTINGS,
        ...savedTierSettings,
        tiers: (tiers && tiers.length ? tiers : DEFAULT_TIER_SETTINGS.tiers).map((t) => ({ archived: false, ...t }))
      });
    }
    const savedInvoiceNumberSettings = loadedSettings.find((s) => s.id === "invoice_number_settings");
    if (savedInvoiceNumberSettings) {
      setInvoiceNumberSettings({ ...DEFAULT_INVOICE_NUMBER_SETTINGS, ...savedInvoiceNumberSettings });
    }
    const savedBranchSettings = loadedSettings.find((s) => s.id === "branch_settings");
    if (savedBranchSettings && savedBranchSettings.branches && savedBranchSettings.branches.length) {
      setBranchSettings({ ...DEFAULT_BRANCH_SETTINGS, ...savedBranchSettings });
    }
    setSettingsLoaded(true);
  };
  const ensureProductsLoaded = async () => {
    if (productsLoaded) return;
    setProductsLoading(true);
    const cached = await idbGet("products_cache");
    const localProducts = cached?.products || [];
    const localVersions = cached?.versions || {};
    const result = await syncProducts(localProducts, localVersions);
    if (result) {
      setProducts(result.products);
      setProductsLoaded(true);
      setUsingCachedProducts(false);
      idbSet("products_cache", result);
    } else if (cached) {
      setProducts(cached.products);
      setProductsLoaded(true);
      setUsingCachedProducts(true);
    }
    setProductsLoading(false);
  };
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
    idbSet("products_cache", { products: [], versions: {} });
    resetProductVersions();
    setTransfers([]);
    setCategories([]);
    setChangedToday([]);
    setStockAlerts([]);
  };
  const performSalesReset = async () => {
    const targets = [salesStore, returnsStore, returnTrackingStore];
    for (const store of targets) {
      const items = await store.loadAll();
      if (items && items.length) {
        for (const item of items) {
          await store.remove(item.id);
        }
      }
    }
    setSales([]);
  };
  const nav = (v) => {
    if (v === "logout") {
      handleLogout();
      return;
    }
    ensureSettingsLoaded();
    if (v === "prices" || v === "reports") setLastSeen((prev) => ({ ...prev, [v]: Date.now() }));
    if (v === "prices" || v === "cashier") ensureProductsLoaded();
    if (v === "stock-alerts") stockAlertsStore.loadAll().then((data) => {
      if (data) setStockAlerts(data);
    });
    if (v === "attendance") {
      attendanceStore.loadAll().then((data) => {
        if (data) setAttendance(data);
      });
      withdrawalsStore.loadAll().then((data) => {
        if (data) setWithdrawals(data);
      });
    }
    setScreen(v);
  };
  const hasNew = {
    prices: products.some((p) => (p.updatedAt || p.createdAt || 0) > lastSeen.prices),
    reports: sales.some((s) => s.fulfillment === "delivery" && s.deliveryStatus === "done" && (s.receivedAt || s.createdAt) > lastSeen.reports),
    ordersPending: sales.some((s) => s.fulfillment === "delivery" && (s.deliveryStatus === "sent" || s.deliveryStatus === "prepared" && s.employeeName === currentUser?.name)),
    "stock-alerts": stockAlerts.some((a) => !a.resolved)
  };
  if (booting) {
    return /* @__PURE__ */ React.createElement("div", { className: "shop-root flex flex-col items-center justify-center gap-4", style: { minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("img", { src: "./icon-192.png", alt: "", className: "w-20 h-20 rounded-2xl shadow-lg splash-logo-pulse" }), /* @__PURE__ */ React.createElement("h1", { className: "text-2xl font-bold text-white tracking-wide splash-fade-in" }, "FaAroon"), /* @__PURE__ */ React.createElement("div", { className: "splash-bar-track" }, /* @__PURE__ */ React.createElement("div", { className: "splash-bar-fill" })), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#64748B] splash-fade-in" }, "...\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u0645\u064A\u0644"));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, currentUser && /* @__PURE__ */ React.createElement(NotificationBell, { notifications, onMarkRead: markNotificationRead, onMarkAllRead: markAllNotificationsRead }), pendingSyncCount > 0 && /* @__PURE__ */ React.createElement("div", { className: "fixed top-3 inset-x-3 z-[65] bg-amber-950/90 border border-amber-700 rounded-2xl p-3 modal-pop max-w-md mx-auto text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5" }, "\u{1F4F4} \u0639\u0646\u062F\u0643 ", pendingSyncCount, " ", pendingSyncCount === 1 ? "\u062A\u0639\u062F\u064A\u0644" : "\u062A\u0639\u062F\u064A\u0644\u0627\u062A", " \u0645\u062D\u0641\u0648\u0638\u0629 \u0639\u0644\u0649 \u062C\u0647\u0627\u0632\u0643\u060C \u0647\u062A\u062A\u0632\u0627\u0645\u0646 \u0623\u0648\u0644 \u0645\u0627 \u0627\u0644\u0646\u062A \u064A\u0631\u062C\u0639")), syncError && /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => {
        if (!syncError.detail || !navigator.clipboard?.writeText) return;
        navigator.clipboard.writeText(syncError.detail).then(() => {
          setSyncErrorCopied(true);
          setTimeout(() => setSyncErrorCopied(false), 1500);
        }).catch(() => {
        });
      },
      className: "fixed bottom-3 inset-x-3 z-[70] bg-rose-950/90 border border-rose-800 rounded-2xl p-3 modal-pop max-w-md mx-auto text-center"
    },
    /* @__PURE__ */ React.createElement("p", { className: "text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 14 }), " \u062A\u0639\u0630\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0628\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u2014 ", syncError.collectionName),
    syncError.code && /* @__PURE__ */ React.createElement("p", { className: "text-rose-400/80 text-[10px] mt-1 tabular-nums" }, "\u0643\u0648\u062F \u0627\u0644\u062E\u0637\u0623: ", syncError.code, syncErrorCopied ? " \u2014 \u0627\u062A\u0646\u0633\u062E\u062A \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u062A\u0642\u0646\u064A\u0629 \u2713" : "")
  ), reminder && currentUser && /* @__PURE__ */ React.createElement("div", { className: "fixed top-3 inset-x-3 z-[60] panel rounded-2xl p-4 modal-pop max-w-md mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-amber-400 text-sm flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "AlertCircle", size: 14 }), " \u0639\u0646\u062F\u0643 ", reminder.length, " ", reminder.length === 1 ? "\u0623\u0648\u0631\u062F\u0631" : "\u0623\u0648\u0631\u062F\u0631\u0627\u062A", " \u0644\u0633\u0647 \u0645\u0627 \u0627\u062A\u0642\u0641\u0644\u0634"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setReminder(null);
    nav("orders");
  }, className: "text-xs text-sky-400 font-semibold mt-2 hover:underline" }, "\u0631\u0648\u062D \u0644\u0644\u0637\u0644\u0628\u0627\u062A \u062F\u0644\u0648\u0642\u062A\u064A")), /* @__PURE__ */ React.createElement("button", { onClick: () => setReminder(null), className: "text-[#94A3B8] hover:text-white shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 16 })))), screen === "login" && /* @__PURE__ */ React.createElement(LoginScreen, { onLogin: handleLogin, goRegister: () => {
    setAuthError("");
    setScreen("register");
  }, error: authError, loading: authLoading }), screen === "register" && /* @__PURE__ */ React.createElement(RegisterScreen, { onRegister: handleRegister, goLogin: () => {
    setAuthError("");
    setScreen("login");
  }, error: authError, loading: authLoading }), screen === "pending" && /* @__PURE__ */ React.createElement(PendingScreen, { status: pendingStatus, goLogin: () => setScreen("login") }), screen === "menu" && currentUser && /* @__PURE__ */ React.createElement(MainMenu, { user: currentUser, setView: nav, onLogout: handleLogout, hasNew, onDevReset: performFullReset }), screen === "prices" && currentUser && /* @__PURE__ */ React.createElement(
    PricesScreen,
    {
      user: currentUser,
      products,
      setProducts,
      productsLoading,
      changedToday,
      setChangedToday,
      categories,
      setCategories,
      tierSettings,
      usingCachedProducts,
      setUsingCachedProducts,
      branchSettings,
      setView: nav
    }
  ), screen === "orders" && currentUser && /* @__PURE__ */ React.createElement(OrdersScreen, { user: currentUser, sales, setSales, users, branchSettings, setView: nav }), screen === "transfers" && currentUser && /* @__PURE__ */ React.createElement(TransfersScreen, { user: currentUser, transfers, setTransfers, setView: nav }), screen === "reports" && currentUser && (userIsAdmin(currentUser) || currentUser.permissions?.viewReports) && /* @__PURE__ */ React.createElement(ReportsScreen, { user: currentUser, sales, branchSettings, setView: nav }), screen === "stock-alerts" && currentUser && (userIsAdmin(currentUser) || currentUser.permissions?.manageStockAlerts) && /* @__PURE__ */ React.createElement(StockAlertsScreen, { user: currentUser, stockAlerts, setStockAlerts, setView: nav }), screen === "attendance" && currentUser && /* @__PURE__ */ React.createElement(AttendanceScreen, { user: currentUser, users, attendance, setAttendance, withdrawals, setWithdrawals, branchSettings, setView: nav }), screen === "settings" && currentUser && /* @__PURE__ */ React.createElement(SettingsScreen, { user: currentUser, users, setUsers, tierSettings, setTierSettings, invoiceNumberSettings, setInvoiceNumberSettings, branchSettings, setBranchSettings, onDevReset: performFullReset, onDevSalesReset: performSalesReset, setView: nav }), screen === "cashier" && currentUser && /* @__PURE__ */ React.createElement(CashierScreen, { user: currentUser, products, productsLoading, sales, setSales, tierSettings, invoiceNumberSettings, setInvoiceNumberSettings, usingCachedProducts, attendance, branchSettings, categories, setView: nav }), screen === "myInvoices" && currentUser && /* @__PURE__ */ React.createElement(MyInvoicesScreen, { user: currentUser, sales, setView: nav }), screen === "returns" && currentUser && /* @__PURE__ */ React.createElement(ReturnsScreen, { user: currentUser, sales, setView: nav }), screen === "admin" && currentUser && (userIsAdmin(currentUser) || currentUser.permissions?.manageUsers) && /* @__PURE__ */ React.createElement(AdminScreen, { user: currentUser, users, setUsers, setView: nav }));
}
const MY_INVOICES_PAGE_SIZE = 6;
function invoiceDayLabel(ts) {
  const day = businessDayOf(ts);
  const today = businessDayOf(Date.now());
  const yesterday = businessDayOf(Date.now() - 24 * 60 * 60 * 1e3);
  if (day === today) return "\u0627\u0644\u064A\u0648\u0645";
  if (day === yesterday) return "\u0623\u0645\u0633";
  return new Date(ts).toLocaleDateString("ar-EG", { day: "numeric", month: "long" });
}
function MyInvoicesScreen({ user, sales, setView }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("today");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState(null);
  const [printError, setPrintError] = useState("");
  const [fetchedSales, setFetchedSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const { start: rangeStart, end: rangeEnd } = rangeToTimestamps(range);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setOffline(false);
    const cacheKey = `my_invoices_range:${range}`;
    (async () => {
      const result = await fetchSalesInRange(rangeStart, rangeEnd);
      if (cancelled) return;
      if (result) {
        setFetchedSales(result);
        idbSet(cacheKey, result);
      } else {
        const cached = await idbGet(cacheKey);
        setFetchedSales(cached || []);
        setOffline(true);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [range]);
  const myInvoices = (() => {
    const byId = {};
    fetchedSales.forEach((s) => {
      byId[s.id] = s;
    });
    sales.forEach((s) => {
      if ((s.createdAt || 0) >= rangeStart && (s.createdAt || 0) <= rangeEnd) byId[s.id] = s;
    });
    return Object.values(byId).filter((s) => s.employeeName === user.name).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  })();
  const searched = query.trim() ? myInvoices.filter((s) => String(s.invoiceNumber ?? "").includes(query.trim())) : myInvoices;
  const totalPages = Math.max(1, Math.ceil(searched.length / MY_INVOICES_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages - 1);
  const pageItems = searched.slice(pageSafe * MY_INVOICES_PAGE_SIZE, pageSafe * MY_INVOICES_PAGE_SIZE + MY_INVOICES_PAGE_SIZE);
  const selectedIndex = selected ? searched.findIndex((s) => s.id === selected.id) : -1;
  const goAdjacent = (dir) => {
    const idx = selectedIndex + dir;
    if (idx >= 0 && idx < searched.length) setSelected(searched[idx]);
  };
  const RANGE_TABS = [
    { key: "today", label: "\u0627\u0644\u064A\u0648\u0645" },
    { key: "yesterday", label: "\u0623\u0645\u0633" },
    { key: "week", label: "\u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
    { key: "all", label: "\u0622\u062E\u0631 3 \u0634\u0647\u0648\u0631" }
  ];
  if (selected) {
    const pay = paymentLabel(selected);
    return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setSelected(null), title: `\u0641\u0627\u062A\u0648\u0631\u0629 #${selected.invoiceNumber ?? ""}` }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2 mb-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goAdjacent(1),
        disabled: selectedIndex >= searched.length - 1,
        className: "btn-ghost rounded-xl px-3 py-2 text-sm font-bold flex items-center gap-1 disabled:opacity-30"
      },
      /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16, style: { transform: "rotate(180deg)" } }),
      " \u0627\u0644\u0633\u0627\u0628\u0642"
    ), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#64748B]" }, new Date(selected.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }), " \xB7 ", invoiceDayLabel(selected.createdAt)), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goAdjacent(-1),
        disabled: selectedIndex <= 0,
        className: "btn-ghost rounded-xl px-3 py-2 text-sm font-bold flex items-center gap-1 disabled:opacity-30"
      },
      "\u0627\u0644\u062A\u0627\u0644\u064A ",
      /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16 })
    )), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 mb-4 flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0" }, /* @__PURE__ */ React.createElement(Icon, { name: "User", size: 18, className: "text-emerald-400" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#64748B]" }, "\u0627\u0644\u0643\u0627\u0634\u064A\u0631"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-white" }, user.name, " ", userIsAdmin(user) ? "(admin)" : ""))), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#64748B]" }, "\u0641\u0627\u062A\u0648\u0631\u0629 #", selected.invoiceNumber), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-white" }, new Date(selected.createdAt).toLocaleDateString("ar-EG")))), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl overflow-hidden mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-3 py-2 text-[11px] text-[#64748B] border-b border-white/5" }, /* @__PURE__ */ React.createElement("span", { className: "w-14 text-center" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", { className: "w-14 text-center" }, "\u0633\u0639\u0631 \u0627\u0644\u0648\u062D\u062F\u0629"), /* @__PURE__ */ React.createElement("span", { className: "w-10 text-center" }, "\u0627\u0644\u0643\u0645\u064A\u0629"), /* @__PURE__ */ React.createElement("span", { className: "flex-1 text-right" }, "\u0627\u0644\u0645\u0646\u062A\u062C")), selected.items.map((it, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-center justify-between px-3 py-2.5 text-sm border-b border-white/5 last:border-0" }, /* @__PURE__ */ React.createElement("span", { className: "w-14 text-center font-bold text-emerald-400 tabular-nums" }, it.lineTotal), /* @__PURE__ */ React.createElement("span", { className: "w-14 text-center text-[#CBD5E1] tabular-nums" }, it.unitPrice), /* @__PURE__ */ React.createElement("span", { className: "w-10 text-center text-[#CBD5E1] tabular-nums" }, it.qty), /* @__PURE__ */ React.createElement("span", { className: "flex-1 text-right font-bold text-white truncate pr-2" }, it.productName)))), /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 mb-4 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white tabular-nums" }, selected.items.length), /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 text-xl tabular-nums" }, selected.total), /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8] text-sm" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0643\u0644\u064A")), selected.fulfillment !== "delivery" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-sm pt-2 border-t border-white/5" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold", style: { color: pay.color } }, pay.label), /* @__PURE__ */ React.createElement("span", { className: "text-[#94A3B8]" }, "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639"))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => printSaleReceipt(selected, (reason) => {
          setPrintError(reason === "popup" ? "\u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0645\u0634 \u0642\u0627\u062F\u0631 \u064A\u0641\u062A\u062D \u0634\u0627\u0634\u0629 \u0627\u0644\u0637\u0628\u0627\u0639\u0629 \u2014 \u062A\u0623\u0643\u062F \u0625\u0646 \u0627\u0644\u0640pop-ups \u0645\u0633\u0645\u0648\u062D\u0629" : "\u062D\u0635\u0644\u062A \u0645\u0634\u0643\u0644\u0629 \u0623\u062B\u0646\u0627\u0621 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0644\u0644\u0637\u0627\u0628\u0639\u0629");
          setTimeout(() => setPrintError(""), 4e3);
        }),
        className: "btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2"
      },
      /* @__PURE__ */ React.createElement(Icon, { name: "Printer", size: 17 }),
      " \u0625\u0639\u0627\u062F\u0629 \u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629"
    ), printError && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in text-xs text-rose-300 font-bold text-center" }, printError))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("menu"), title: "\u0641\u0648\u0627\u062A\u064A\u0631\u064A", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "relative mb-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "Search", size: 16, className: "absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B] pointer-events-none" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: query,
      onChange: (e) => {
        setQuery(e.target.value);
        setPage(0);
      },
      placeholder: "\u0628\u062D\u062B \u0628\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629",
      className: "field-input w-full rounded-xl pr-9 pl-9 py-2.5 text-sm"
    }
  ), query && /* @__PURE__ */ React.createElement("button", { onClick: () => setQuery(""), className: "absolute top-1/2 -translate-y-1/2 left-3 text-[#64748B]" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 15 }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3 overflow-x-auto" }, RANGE_TABS.map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.key,
      onClick: () => {
        setRange(t.key);
        setPage(0);
      },
      className: `toggle-pill shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold ${range === t.key ? "active-sky" : ""}`
    },
    t.label
  ))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#64748B] mb-3" }, loading ? "\u0628\u064A\u062D\u0645\u0651\u0644 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631..." : `\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631: ${searched.length}`, offline && !loading && " (\u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u2014 \u0645\u0646 \u063A\u064A\u0631 \u0625\u0646\u062A\u0631\u0646\u062A)"), searched.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-14 text-[#64748B]" }, /* @__PURE__ */ React.createElement(Icon, { name: "Receipt", size: 32, className: "mx-auto mb-2 text-[#334155]" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, "\u0645\u0641\u064A\u0634 \u0641\u0648\u0627\u062A\u064A\u0631 \u062A\u0637\u0627\u0628\u0642 \u0627\u0644\u0628\u062D\u062B")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, pageItems.map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.id,
      onClick: () => setSelected(s),
      className: "panel rounded-xl p-3 w-full flex items-center justify-between gap-2 text-right transition-colors"
    },
    /* @__PURE__ */ React.createElement("div", { className: "shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-white tabular-nums" }, new Date(s.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#64748B]" }, invoiceDayLabel(s.createdAt))),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-white" }, "#", s.invoiceNumber), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#64748B]" }, s.items.length, " \u0645\u0646\u062A\u062C\u0627\u062A")),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 tabular-nums" }, s.total), /* @__PURE__ */ React.createElement(Icon, { name: "Receipt", size: 16, className: "text-sky-400" }))
  ))), totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-4 mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage((p) => Math.max(0, p - 1)), disabled: pageSafe === 0, className: "btn-ghost rounded-xl p-2 disabled:opacity-30" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16, style: { transform: "rotate(180deg)" } })), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#94A3B8]" }, pageSafe + 1, " \u0645\u0646 ", totalPages), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)), disabled: pageSafe >= totalPages - 1, className: "btn-ghost rounded-xl p-2 disabled:opacity-30" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16 })))));
}
function returnDayLabel(ts) {
  const day = businessDayOf(ts);
  const today = businessDayOf(Date.now());
  const yesterday = businessDayOf(Date.now() - 24 * 60 * 60 * 1e3);
  if (day === today) return "\u0627\u0644\u064A\u0648\u0645";
  if (day === yesterday) return "\u0623\u0645\u0633";
  return new Date(ts).toLocaleDateString("ar-EG", { day: "numeric", month: "long" });
}
const RETURNS_PAGE_SIZE = 6;
function ReturnsScreen({ user, sales, setView }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("today");
  const [page, setPage] = useState(0);
  const [fetchedSales, setFetchedSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const { start: rangeStart, end: rangeEnd } = rangeToTimestamps(range);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setOffline(false);
    const cacheKey = `returns_sales_range:${range}`;
    (async () => {
      const result = await fetchSalesInRange(rangeStart, rangeEnd);
      if (cancelled) return;
      if (result) {
        setFetchedSales(result);
        idbSet(cacheKey, result);
      } else {
        const cached = await idbGet(cacheKey);
        setFetchedSales(cached || []);
        setOffline(true);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [range]);
  const inRange = (() => {
    const byId = {};
    fetchedSales.forEach((s) => {
      byId[s.id] = s;
    });
    sales.forEach((s) => {
      if ((s.createdAt || 0) >= rangeStart && (s.createdAt || 0) <= rangeEnd) byId[s.id] = s;
    });
    return Object.values(byId).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  })();
  const q = query.trim();
  const searched = q ? inRange.filter((s) => String(s.invoiceNumber ?? "").includes(q) || (s.customerName || "").includes(q)) : inRange;
  const totalPages = Math.max(1, Math.ceil(searched.length / RETURNS_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages - 1);
  const pageItems = searched.slice(pageSafe * RETURNS_PAGE_SIZE, pageSafe * RETURNS_PAGE_SIZE + RETURNS_PAGE_SIZE);
  const RANGE_TABS = [
    { key: "today", label: "\u0627\u0644\u064A\u0648\u0645" },
    { key: "yesterday", label: "\u0623\u0645\u0633" },
    { key: "week", label: "\u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639" },
    { key: "all", label: "\u0622\u062E\u0631 3 \u0634\u0647\u0648\u0631" }
  ];
  const [selected, setSelected] = useState(null);
  const [returnQtys, setReturnQtys] = useState({});
  const [alreadyReturned, setAlreadyReturned] = useState({});
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successToast, setSuccessToast] = useState(false);
  const openSale = (sale) => {
    setSelected(sale);
    setReturnQtys({});
    setNote("");
    setSubmitError("");
    setLoadingExisting(true);
    fetchReturnTracking(sale.id).then((tracking) => {
      setAlreadyReturned(tracking ? tracking.items : {});
      setLoadingExisting(false);
    });
  };
  const closeSale = () => {
    setSelected(null);
    setReturnQtys({});
    setAlreadyReturned({});
  };
  const maxReturnable = (idx, item) => Math.max(0, item.qty - (alreadyReturned[idx] || 0));
  const setQtyFor = (idx, item, val) => {
    const max = maxReturnable(idx, item);
    const clamped = Math.max(0, Math.min(max, val));
    setReturnQtys((q2) => ({ ...q2, [idx]: clamped }));
  };
  const selectedItems = selected ? selected.items.map((it, idx) => ({ ...it, idx, returnQty: returnQtys[idx] || 0 })).filter((it) => it.returnQty > 0) : [];
  const returnTotal = selectedItems.reduce((s, it) => s + Math.round((it.unitPrice * it.returnQty + Number.EPSILON) * 100) / 100, 0);
  const submitReturn = async () => {
    if (submitting || selectedItems.length === 0) return;
    setSubmitting(true);
    setSubmitError("");
    const rec = {
      id: uid(),
      originalSaleId: selected.id,
      originalInvoiceNumber: selected.invoiceNumber,
      originalEmployeeName: selected.employeeName,
      employeeName: user.name,
      customerName: selected.customerName || null,
      branchName: selected.branchName || null,
      dispatchLocation: selected.dispatchLocation || null,
      fulfillment: selected.fulfillment || null,
      items: selectedItems.map((it) => ({ itemIndex: it.idx, productName: it.productName, unitPrice: it.unitPrice, qty: it.returnQty, lineTotal: Math.round((it.unitPrice * it.returnQty + Number.EPSILON) * 100) / 100 })),
      total: returnTotal,
      note: note.trim() || null,
      createdAt: Date.now()
    };
    const result = await submitReturnAtomic(selected, selectedItems, rec);
    setSubmitting(false);
    if (!result.ok) {
      if (result.reason === "overLimit") {
        setSubmitError(`\u062D\u062F \u0641\u0627\u0636\u0644 \u0628\u0633 ${result.maxLeft} \u0645\u0646 "${result.itemName}" \u2014 \u062D\u0635\u0644 \u0639\u0644\u064A\u0647\u0627 \u0625\u0631\u062C\u0627\u0639 \u0645\u0646 \u062C\u0647\u0627\u0632/\u0645\u0648\u0638\u0641 \u062A\u0627\u0646\u064A \u0641\u064A \u0646\u0641\u0633 \u0627\u0644\u0644\u062D\u0638\u0629. \u062D\u062F\u0651\u062B \u0627\u0644\u0643\u0645\u064A\u0629 \u0648\u062C\u0631\u0628 \u062A\u0627\u0646\u064A.`);
        fetchReturnTracking(selected.id).then((tracking) => {
          if (tracking) setAlreadyReturned(tracking.items);
        });
      } else if (result.reason === "offline") {
        setSubmitError("\u0645\u062D\u062A\u0627\u062C \u0627\u062A\u0635\u0627\u0644 \u0628\u0627\u0644\u0646\u062A \u0639\u0634\u0627\u0646 \u0646\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0628\u0623\u0645\u0627\u0646 \u2014 \u062C\u0631\u0628 \u062A\u0627\u0646\u064A \u0644\u0645\u0627 \u0627\u0644\u0646\u062A \u064A\u0631\u062C\u0639.");
      } else {
        setSubmitError("\u062D\u0635\u0644 \u062A\u0639\u0627\u0631\u0636 \u0648\u0642\u062A \u0627\u0644\u062D\u0641\u0638\u060C \u062C\u0631\u0628 \u062A\u0627\u0646\u064A.");
      }
      playBeep("error");
      return;
    }
    playBeep("success");
    setConfirmOpen(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
    closeSale();
    setQuery("");
  };
  if (selected) {
    return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: closeSale, title: `\u0645\u0631\u062A\u062C\u0639 \u0644\u0641\u0627\u062A\u0648\u0631\u0629 #${selected.invoiceNumber ?? ""}` }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up pb-28" }, /* @__PURE__ */ React.createElement("div", { className: "panel rounded-2xl p-4 mb-4 flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#64748B]" }, "\u0627\u0644\u0643\u0627\u0634\u064A\u0631 \u0627\u0644\u0623\u0635\u0644\u064A"), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-white" }, selected.employeeName)), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#64748B]" }, "\u0641\u0627\u062A\u0648\u0631\u0629 #", selected.invoiceNumber), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-white" }, returnDayLabel(selected.createdAt)))), loadingExisting ? /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-[#64748B] py-6" }, "\u0628\u064A\u062A\u062D\u0642\u0642 \u0645\u0646 \u0645\u0631\u062A\u062C\u0639\u0627\u062A \u0633\u0627\u0628\u0642\u0629 \u0639\u0644\u0649 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u062F\u064A...") : /* @__PURE__ */ React.createElement("div", { className: "space-y-2 mb-4" }, selected.items.map((it, idx) => {
      const max = maxReturnable(idx, it);
      const val = returnQtys[idx] || 0;
      return /* @__PURE__ */ React.createElement("div", { key: idx, className: `panel rounded-xl p-3 ${max === 0 ? "opacity-40" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2 mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-sm text-white truncate" }, it.productName), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#64748B] shrink-0 tabular-nums" }, it.unitPrice, " \u062C \xD7 ", it.qty)), max === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-rose-400" }, "\u0627\u062A\u0631\u062C\u0639 \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0642\u0628\u0644 \u0643\u062F\u0647") : /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setQtyFor(idx, it, val + 1),
          disabled: val >= max,
          className: "field-input w-9 h-9 shrink-0 rounded-lg text-lg font-bold flex items-center justify-center disabled:opacity-30"
        },
        "+"
      ), /* @__PURE__ */ React.createElement("div", { className: "field-input flex-1 rounded-lg py-1.5 text-sm text-center font-bold tabular-nums" }, val), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setQtyFor(idx, it, val - 1),
          disabled: val <= 0,
          className: "field-input w-9 h-9 shrink-0 rounded-lg text-lg font-bold flex items-center justify-center disabled:opacity-30"
        },
        "\u2212"
      ), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] text-[#64748B] shrink-0 w-16 text-left" }, "\u0645\u0646 ", max)));
    })), /* @__PURE__ */ React.createElement("label", { className: "block mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "block mb-1.5 text-xs text-[#94A3B8]" }, "\u0645\u0644\u0627\u062D\u0638\u0629 / \u0633\u0628\u0628 \u0627\u0644\u0625\u0631\u062C\u0627\u0639 (\u0627\u062E\u062A\u064A\u0627\u0631\u064A)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: note,
        onChange: (e) => setNote(e.target.value),
        rows: 2,
        className: "field-input w-full rounded-xl px-3 py-2 text-sm",
        placeholder: "\u0645\u062B\u0644\u0627\u064B: \u0627\u0644\u0645\u0646\u062A\u062C \u0641\u064A\u0647 \u0639\u064A\u0628"
      }
    ))), selectedItems.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-0 inset-x-0 z-[80] p-4 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/95 to-transparent" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto panel rounded-2xl p-3 flex items-center justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#64748B]" }, selectedItems.length, " \u0635\u0646\u0641 \u0644\u0644\u0625\u0631\u062C\u0627\u0639"), /* @__PURE__ */ React.createElement("p", { className: "font-bold text-rose-400 text-lg tabular-nums" }, returnTotal, " \u062C")), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmOpen(true), className: "btn-rose rounded-xl px-5 py-2.5 font-bold flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Icon, { name: "RotateCcw", size: 16 }), " \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639"))), confirmOpen && /* @__PURE__ */ React.createElement(Modal, { title: "\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0645\u0631\u062A\u062C\u0639", accent: "#EF4444", onClose: () => !submitting && setConfirmOpen(false) }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 mb-4" }, selectedItems.map((it) => /* @__PURE__ */ React.createElement("div", { key: it.idx, className: "flex items-center justify-between text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "text-white" }, it.productName, " \xD7 ", it.returnQty), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-rose-400 tabular-nums" }, it.unitPrice * it.returnQty, " \u062C"))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-white/10 my-2" }), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-white" }, "\u0627\u0644\u0625\u062C\u0645\u0627\u0644\u064A"), /* @__PURE__ */ React.createElement("span", { className: "font-bold text-rose-400 text-lg tabular-nums" }, returnTotal, " \u062C"))), submitError && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-rose-400 mb-3" }, submitError), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: submitReturn, disabled: submitting, className: "btn-rose flex-1 rounded-xl py-2 text-sm font-bold disabled:opacity-50" }, submitting ? "\u0628\u064A\u0633\u062C\u0644..." : "\u0623\u064A\u0648\u0647\u060C \u0633\u062C\u0651\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639"), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmOpen(false), disabled: submitting, className: "btn-ghost flex-1 rounded-xl py-2 text-sm font-bold" }, "\u0644\u0623\u060C \u0631\u062C\u0651\u0639\u0646\u064A"))));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "shop-root" }, /* @__PURE__ */ React.createElement(Header, { user, onLogout: () => setView("logout"), onBack: () => setView("cashier"), title: "\u0645\u0631\u062A\u062C\u0639\u0627\u062A", onNav: setView }), /* @__PURE__ */ React.createElement("div", { className: "max-w-lg mx-auto px-4 py-2 fade-up pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "relative mb-3" }, /* @__PURE__ */ React.createElement(Icon, { name: "Search", size: 16, className: "absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B] pointer-events-none" }), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: query,
      onChange: (e) => {
        setQuery(e.target.value);
        setPage(0);
      },
      placeholder: "\u0628\u062D\u062B \u0628\u0631\u0642\u0645 \u0627\u0644\u0641\u0627\u062A\u0648\u0631\u0629 \u0623\u0648 \u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u064A\u0644",
      className: "field-input w-full rounded-xl pr-9 pl-9 py-2.5 text-sm"
    }
  ), query && /* @__PURE__ */ React.createElement("button", { onClick: () => setQuery(""), className: "absolute top-1/2 -translate-y-1/2 left-3 text-[#64748B]" }, /* @__PURE__ */ React.createElement(Icon, { name: "X", size: 15 }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-3 overflow-x-auto" }, RANGE_TABS.map((t) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t.key,
      onClick: () => {
        setRange(t.key);
        setPage(0);
      },
      className: `toggle-pill shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold ${range === t.key ? "active-sky" : ""}`
    },
    t.label
  ))), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#64748B] mb-3" }, loading ? "\u0628\u064A\u062D\u0645\u0651\u0644 \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631..." : `\u0625\u062C\u0645\u0627\u0644\u064A \u0627\u0644\u0641\u0648\u0627\u062A\u064A\u0631: ${searched.length}`, offline && !loading && " (\u0622\u062E\u0631 \u0646\u0633\u062E\u0629 \u0645\u062D\u0641\u0648\u0638\u0629 \u2014 \u0645\u0646 \u063A\u064A\u0631 \u0625\u0646\u062A\u0631\u0646\u062A)"), successToast && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-4 inset-x-4 z-[95] flex justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "bg-emerald-950/90 border border-emerald-800 rounded-xl px-4 py-2 toast-in text-xs text-emerald-300 font-bold text-center flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(Icon, { name: "CheckCircle2", size: 14 }), " \u0627\u062A\u0633\u062C\u0644 \u0627\u0644\u0645\u0631\u062A\u062C\u0639 \u0628\u0646\u062C\u0627\u062D")), searched.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-14 text-[#64748B]" }, /* @__PURE__ */ React.createElement(Icon, { name: "RotateCcw", size: 32, className: "mx-auto mb-2 text-[#334155]" }), /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, "\u0645\u0641\u064A\u0634 \u0641\u0648\u0627\u062A\u064A\u0631 \u062A\u0637\u0627\u0628\u0642 \u0627\u0644\u0628\u062D\u062B")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, pageItems.map((s) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: s.id,
      onClick: () => openSale(s),
      className: "panel rounded-xl p-3 w-full flex items-center justify-between gap-2 text-right transition-colors"
    },
    /* @__PURE__ */ React.createElement("div", { className: "shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-white tabular-nums" }, new Date(s.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#64748B]" }, returnDayLabel(s.createdAt))),
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold text-white" }, "#", s.invoiceNumber), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#64748B]" }, s.employeeName, " \xB7 ", s.items.length, " \u0645\u0646\u062A\u062C\u0627\u062A")),
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 shrink-0" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-emerald-400 tabular-nums" }, s.total), /* @__PURE__ */ React.createElement(Icon, { name: "RotateCcw", size: 16, className: "text-rose-400" }))
  ))), totalPages > 1 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-4 mt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage((p) => Math.max(0, p - 1)), disabled: pageSafe === 0, className: "btn-ghost rounded-xl p-2 disabled:opacity-30" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16, style: { transform: "rotate(180deg)" } })), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#94A3B8]" }, pageSafe + 1, " \u0645\u0646 ", totalPages), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage((p) => Math.min(totalPages - 1, p + 1)), disabled: pageSafe >= totalPages - 1, className: "btn-ghost rounded-xl p-2 disabled:opacity-30" }, /* @__PURE__ */ React.createElement(Icon, { name: "ChevronLeft", size: 16 })))));
}
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(/* @__PURE__ */ React.createElement(App, null));
