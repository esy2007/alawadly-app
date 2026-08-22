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
  "ChevronDown": `<path d="M6 9l6 6 6-6"/>`
};

function Icon({ name, size = 18, className = "", style = {} }) {
  const inner = ICON_SVGS[name] || '<circle cx="12" cy="12" r="9"/>';
  return (
    <svg
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

// ---------- Firebase (Firestore + Auth via REST — no SDK needed, just fetch, so
// this works in any environment: the artifact preview, a browser, or later
// inside the Capacitor/APK webview) ----------
const FIREBASE_PROJECT_ID = "alawadly-53e7d";

const FIREBASE_API_KEY = "AIzaSyAp8Hbi1AmSovP3lxZ6PkMI2C2KgYdSEEo";

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

// ---------- Real per-employee sign-in (replaces the old blanket Anonymous
// Auth). Each employee gets an actual Firebase Auth account behind the
// scenes — the login screen still only asks for name + password like
// before, nothing changes for them. The "email" Firebase needs is
// generated automatically from their name (deterministic hash, ASCII-safe,
// works with Arabic names) — they never see or type it. ----------
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
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!res.ok) return { ok: false, status: res.status, detail: await readErrorDetail(res) };
  const data = await res.json();
  return { ok: true, data };
}

async function signUpWithEmailPassword(email, password) {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  if (!res.ok) return { ok: false, status: res.status, detail: await readErrorDetail(res) };
  const data = await res.json();
  return { ok: true, data };
}

// Updates the real Firebase password for the currently signed-in user.
async function updateOwnPassword(newPassword) {
  const token = await ensureAuth();
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: token, password: newPassword, returnSecureToken: true }),
  });
  if (!res.ok) return { ok: false, detail: await readErrorDetail(res) };
  const data = await res.json();
  setAuthTokens(data);
  return { ok: true };
}

// Applies a fresh sign-in/sign-up response to the live session: updates the
// in-memory token used by every Firestore call, and persists the refresh
// token so re-opening the app later doesn't ask to log in again.
function setAuthTokens(data) {
  authState = {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + Number(data.expiresIn) * 1000,
  };
  try {
    localStorage.setItem(SESSION_REFRESH_KEY, authState.refreshToken);
  } catch {}
}

function clearAuthTokens() {
  authState = { idToken: null, refreshToken: null, expiresAt: 0 };
  try { localStorage.removeItem(SESSION_REFRESH_KEY); } catch {}
}

// Called once at boot if a refresh token was saved from a previous login —
// primes authState so the very first ensureAuth() call silently exchanges
// it for a fresh idToken instead of requiring the person to log in again.
function restoreRefreshToken(token) {
  authState = { idToken: null, refreshToken: token, expiresAt: 0 };
}

async function doAuth() {
  if (!authState.refreshToken) {
    throw new Error("not signed in");
  }
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=refresh_token&refresh_token=${authState.refreshToken}`,
  });
  if (!res.ok) {
    clearAuthTokens();
    const detail = await readErrorDetail(res);
    notifyStoreError("تسجيل الدخول (Auth)", detail);
    throw new Error(`auth failed: ${detail}`);
  }
  const data = await res.json();
  authState = {
    idToken: data.id_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + Number(data.expires_in) * 1000,
  };
  try { localStorage.setItem(SESSION_REFRESH_KEY, authState.refreshToken); } catch {}
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

const salesStore = makeCollectionStore("sales_col");

const notificationsStore = makeCollectionStore("notifications_col");

// Sends a persisted notification to a specific employee (by name) — shows up
// as a red-dot bell alert next time they have the app open, and stays in
// their list until they mark it read. No real push infrastructure here (no
// backend), so this only surfaces while the app is open, same as the
// existing unpaid-order browser reminder.
function sendNotification(forUser, message) {
  const notif = { id: uid(), forUser, message, read: false, createdAt: Date.now() };
  notificationsStore.upsert(notif);
  return notif;
}

const settingsStore = makeCollectionStore("settings_col");

const DEFAULT_TIER_SETTINGS = {
  id: "tier_settings",
  tiers: [
    { id: "retail", label: "قطاعي", color: "#34D399", archived: false },
    { id: "half", label: "نص جملة", color: "#FBBF24", archived: false },
    { id: "wholesale", label: "جملة", color: "#FB7185", archived: false },
  ],
  hideFromCustomer: true,
};

function activeTiers(tierSettings) {
  return tierSettings.tiers.filter((t) => !t.archived);
}

const DEFAULT_INVOICE_NUMBER_SETTINGS = {
  id: "invoice_number_settings",
  nextNumber: 1,
  resetFrequency: "never", // "never" | "daily" | "monthly"
  lastResetKey: null,
};

const DEFAULT_BRANCH_SETTINGS = {
  id: "branch_settings",
  branches: [
    { id: "sanania", name: "السنانية" },
    { id: "matary", name: "المطري" },
  ],
};

// Looks at a user's last 10 attendance records (most recent first) and
// returns the branch they picked most often, so the check-in screen can
// pre-select it for them instead of starting blank every day.
function suggestUsualBranch(attendance, employeeName) {
  const recent = attendance
    .filter((a) => a.employeeName === employeeName && a.branchId)
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, 10);
  if (!recent.length) return null;
  const counts = {};
  recent.forEach((a) => { counts[a.branchId] = (counts[a.branchId] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function currentResetKey(freq) {
  const now = new Date();
  if (freq === "daily") return now.toISOString().slice(0, 10);
  if (freq === "monthly") return now.toISOString().slice(0, 7);
  return null;
}

// Returns { number, updatedSettings } — call this to assign the next invoice
// number and get back the settings object to persist (handles the periodic
// reset automatically based on resetFrequency).
function takeNextInvoiceNumber(settings) {
  const key = currentResetKey(settings.resetFrequency);
  const needsReset = settings.resetFrequency !== "never" && key !== settings.lastResetKey;
  const number = needsReset ? 1 : settings.nextNumber;
  const updatedSettings = { ...settings, nextNumber: number + 1, lastResetKey: key };
  return { number, updatedSettings };
}

// Two devices tapping "فاتورة جديدة" at the exact same moment must never get the
// same number. A plain read-then-write (like the rest of the app uses) can't
// guarantee that — so this uses Firestore's built-in optimistic-concurrency
// precondition instead: the write only succeeds if nobody else changed the
// document since we read it, and we retry with fresh data if it was beaten.
async function claimNextInvoiceNumber(fallbackSettings) {
  const docUrl = `${FIRESTORE_BASE}/settings_col/invoice_number_settings`;

  for (let attempt = 0; attempt < 6; attempt++) {
    let token;
    try {
      token = await ensureAuth();
    } catch (e) {
      break; // no network/auth — fall through to the offline fallback below
    }

    let settings = fallbackSettings;
    let precondition = "currentDocument.exists=false"; // assume the doc doesn't exist yet
    try {
      const getRes = await fetch(docUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (getRes.ok) {
        const doc = await getRes.json();
        settings = { ...DEFAULT_INVOICE_NUMBER_SETTINGS, ...fromFirestoreFields(doc.fields) };
        precondition = `currentDocument.updateTime=${encodeURIComponent(doc.updateTime)}`;
      } else if (getRes.status !== 404) {
        break; // real error (not just "doesn't exist yet") — fall back below
      }
    } catch (e) {
      break; // offline — fall back below
    }

    const { number, updatedSettings } = takeNextInvoiceNumber(settings);

    try {
      const patchRes = await fetch(`${docUrl}?${precondition}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fields: toFirestoreFields(updatedSettings) }),
      });
      if (patchRes.ok) {
        return { number, updatedSettings };
      }
      // Someone else claimed a number in between — wait a random beat and retry with fresh data.
      await new Promise((r) => setTimeout(r, 80 + Math.random() * 160));
    } catch (e) {
      break; // offline — fall back below
    }
  }

  // Couldn't confirm a safe number online (offline, or lost every race) — hand out
  // a local-only number so the sale is never blocked. It may collide with another
  // device's number in the rare case both were offline at once.
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
  notifications_col: notificationsStore,
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTodayBranchName(attendance, employeeName, branches) {
  const today = todayStr();
  const rec = attendance.find((a) => a.employeeName === employeeName && a.date === today && a.branchId);
  if (!rec) return null;
  const branch = branches.find((b) => b.id === rec.branchId);
  return branch ? branch.name : null;
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

const SESSION_REFRESH_KEY = "alawadly_auth_refresh";

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

// Reads a previously-saved refresh token (if any) so the app can silently
// re-authenticate the same employee on next open, without asking them to
// type their password again.
function loadSavedRefreshToken() {
  try { return localStorage.getItem(SESSION_REFRESH_KEY); } catch { return null; }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
  clearAuthTokens();
}

// Keeps open cashier invoices (tabs/carts) on the device so they survive
// navigating away from the Cashier screen or closing the app mid-sale.
const CASHIER_INVOICES_KEY = "faaroon_cashier_invoices";

function saveCashierInvoices(invoices) {
  try { localStorage.setItem(CASHIER_INVOICES_KEY, JSON.stringify({ invoices })); } catch {}
}

function loadCashierInvoices() {
  try {
    const raw = localStorage.getItem(CASHIER_INVOICES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Keeps a local copy of products/categories/sales on the device, so the shop
// can keep working (browse prices, ring up sales) even with no connection.
// Writes still go through the existing offline queue and sync once back online;
// this only covers the "read" side that the offline queue doesn't handle.
// Short generated tone (no audio file needed) for a quick confidence cue on
// success, or a lower warning tone on error.
// One shared AudioContext, reused for every sound instead of creating (and
// destroying) a new one per beep. Creating a fresh context on every single
// tap is what caused sounds to randomly stop working — mobile browsers
// throttle/suspend rapidly-created audio contexts, especially outside a
// direct user gesture, so sounds would silently fail with no error.
let sharedAudioCtx = null;
function getAudioCtx() {
  if (!sharedAudioCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    sharedAudioCtx = new Ctor();
  }
  if (sharedAudioCtx.state === "suspended") {
    // Must be called from inside a user-gesture handler (tap/click) to work —
    // every call site here already is one, so this reliably wakes it back up.
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
    // Tiny linear attack before the exponential decay, instead of jumping
    // straight to full volume — softens the harsh "click" at the start of
    // every tone so it sounds rounder rather than a sharp digital beep.
    const attack = 0.012;
    if (type === "success") {
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.13, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else if (type === "error") {
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.13, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.29);
    } else if (type === "add") {
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(990, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "remove") {
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "scan") {
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === "switch") {
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.07);
    } else {
      // "tap" — a very light neutral click for frequent taps (numpad, etc.)
      osc.frequency.setValueAtTime(700, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      osc.start(now);
      osc.stop(now + 0.05);
    }
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  } catch (e) {
    // Web Audio unsupported/blocked — silently skip, never block the action over a sound.
  }
}

const DATA_CACHE_PREFIX = "faaroon_cache_";

function saveDataCache(key, data) {
  try { localStorage.setItem(DATA_CACHE_PREFIX + key, JSON.stringify(data)); } catch {}
}

function loadDataCache(key) {
  try {
    const raw = localStorage.getItem(DATA_CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
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

// Converts Arabic-Indic (٠١٢٣...) and Persian digits to plain ASCII digits,
// so phone numbers typed in either keyboard layout validate the same way.
function toEnglishDigits(str) {
  const map = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
  return String(str || "").replace(/[٠-٩۰-۹]/g, (d) => map[d]);
}

// Egyptian mobile numbers: 11 digits, starting with 010/011/012/015.
function validateEgyptPhone(raw) {
  const digits = toEnglishDigits(raw).replace(/[^\d]/g, "");
  if (digits.length !== 11) return "رقم التليفون لازم يكون ١١ رقم";
  if (!/^(010|011|012|015)/.test(digits)) return "رقم التليفون لازم يبدأ بـ 010 أو 011 أو 012 أو 015";
  return null;
}

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

function validateTierPrices(prices) {
  if (prices.some((v) => v === null)) {
    return "من فضلك اكتب أرقام صحيحة في كل الأسعار";
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
    return new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  } catch {
    return new Date().toDateString();
  }
}

function buildWhatsAppMessage(changedToday, products, tiers) {
  const tierList = tiers || DEFAULT_TIER_SETTINGS.tiers;
  const entries = changedToday.map((c) => products.find((p) => p.id === c.id)).filter(Boolean);
  let msg = `📊 *تقرير تعديلات الأسعار - FaAroon*\n📅 ${formatArabicDate()}\n\n`;
  entries.forEach((p, i) => {
    const tierText = tierList.map((t) => `${t.label}: ${tierBase(p[t.id])}`).join(" | ");
    msg += `${i + 1}. *${p.name}*\n   ${tierText}\n\n`;
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
  return { label: "-", color: "#94A3B8" };
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
  <h1>FaAroon</h1>
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

// Same 80mm-thermal-roll approach as printOrderReceipt, but itemized for a cashier sale.
function printSaleReceipt(sale) {
  const pay = paymentLabel(sale);
  const win = window.open("", "_blank");
  if (!win) return;
  const dateStr = new Date(sale.createdAt).toLocaleString("ar-EG");
  const itemsHtml = sale.items
    .map((it) => `<div class="row"><span>${escapeHtml(it.productName)} × ${it.qty}</span><span>${it.lineTotal}</span></div>`)
    .join("");
  win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>فاتورة بيع</title>
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
  <p class="center muted">فاتورة كاشير رقم ${sale.invoiceNumber ?? ""}</p>
  ${sale.customerName ? `<p class="center muted">الزبون: ${escapeHtml(sale.customerName)}</p>` : ""}
  <div class="line"></div>
  ${itemsHtml}
  <div class="line"></div>
  <div class="row total"><span>الإجمالي</span><span>${sale.total}</span></div>
  ${sale.fulfillment === "delivery" ? `
  <div class="line"></div>
  <p class="center muted" style="font-weight:bold;">بيانات الدليفري</p>
  <div class="row"><span>المنطقة</span><span>${escapeHtml(sale.deliveryArea || "")}</span></div>
  <div class="row"><span>تليفون الزبون</span><span>${escapeHtml(sale.customerPhone || "")}</span></div>
  ${sale.dispatchLocation ? `<div class="row"><span>مكان الخروج</span><span>${escapeHtml(sale.dispatchLocation)}</span></div>` : ""}
  ` : `
  <div class="row"><span>طريقة الدفع</span><span>${escapeHtml(pay.label)}</span></div>
  `}
  <div class="line"></div>
  <p class="center muted">${dateStr}</p>
  <p class="center muted">بواسطة: ${escapeHtml(sale.employeeName)}</p>
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

// "developer" is a role on top of "admin" — same full admin access, plus
// access to the sensitive maintenance tools (full data reset, the
// legacy-accounts migration tool). Replaces the old fixed developer
// password, which was sitting in plain text in the shipped app.js and
// anyone could read it. Only an existing admin can promote someone (incl.
// themselves) to developer, from Admin screen → المستخدمون المعتمدون.
const userIsAdmin = (u) => !!u && (u.role === "admin" || u.role === "developer");
const userIsDeveloper = (u) => !!u && u.role === "developer";

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

// ---------- Small UI atoms ----------
function TextField({ label, icon: Icon, ...props }) {
  return (
    <label className="block mb-4 text-right">
      <span className="block mb-1.5 text-sm font-medium text-[#94A3B8]">{label}</span>
      <div className="relative">
        <input {...props} className="field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px] transition-colors" />
        {Icon && <Icon size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B]" />}
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

function SkeletonRows({ count = 4, height = 56 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}

function AutocompleteInput({ value, onChange, options, placeholder, className, inputClassName, minChars = 2, maxSuggestions = 5, autoFocus }) {
  const [focused, setFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const normalizedValue = normalizeArabic(value || "");
  const matches = normalizedValue.length >= minChars
    ? options.filter((o) => normalizeArabic(o).includes(normalizedValue) && o !== value).slice(0, maxSuggestions)
    : [];

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

  return (
    <div className={`relative ${className || ""}`}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setHighlightIndex(0); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={inputClassName || "field-input w-full rounded-xl px-3 py-2 text-sm"}
      />
      {focused && matches.length > 0 && (
        <div className="absolute z-20 top-full inset-x-0 mt-1 panel rounded-xl overflow-hidden shadow-xl">
          {matches.map((opt, i) => (
            <button
              key={opt}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(opt)}
              className={`w-full text-right px-3 py-2 text-sm ${i === highlightIndex ? "bg-white/10 text-white" : "text-[#CBD5E1]"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ title, accent = "#38BDF8", onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 modal-backdrop" onClick={onClose}>
      <div className="panel rounded-2xl w-full max-w-sm p-5 modal-pop max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base" style={{ color: accent }}>{title}</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-white"><Icon name="X" size={18} /></button>
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
          <h1 className="font-extrabold text-2xl text-sky-400 tracking-wide">FaAroon</h1>
          <p className="text-sm text-[#94A3B8] mt-1">نظام إدارة أسعار ومبيعات المحل</p>
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
        <button onClick={goLogin} className="flex items-center gap-1 text-sm text-[#94A3B8] mb-4 hover:text-white">
          <Icon name="ChevronLeft" size={16} /> رجوع لتسجيل الدخول
        </button>
        <h1 className="font-extrabold text-xl text-sky-400 mb-1">إنشاء حساب جديد</h1>
        <p className="text-sm text-[#94A3B8] mb-5">هيتبعت طلبك للأدمن عشان يوافق عليه</p>

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
          <p className="text-sm text-[#94A3B8] mb-6">
            {isRejected ? "الأدمن رفض طلب انضمامك للمحل. تقدر تتواصل معاه لمعرفة السبب." : "لسه الأدمن ما وافقش على طلبك، حاول تسجيل الدخول تاني بعد شوية."}
          </p>
          <button onClick={goLogin} className="btn-sky rounded-xl px-6 py-2.5 font-bold">رجوع لتسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Shared header (vivid gradient "notch") ----------
function SideDrawer({ user, onNav, onClose }) {
  const items = [
    { key: "menu", label: "الرئيسية", icon: "Store" },
    { key: "cashier", label: "الكاشير", icon: "Wallet" },
    { key: "prices", label: "أسعار المحل", icon: "Store", adminOnly: true },
    { key: "orders", label: "الطلبات", icon: "Package" },
    { key: "transfers", label: "تحويلات", icon: "Send" },
    { key: "attendance", label: "الحضور والسحب", icon: "Clock" },
    { key: "admin", label: "إدارة المستخدمين", icon: "Users", adminOnly: true },
    { key: "reports", label: "التقارير", icon: "BarChart3", adminOnly: true },
    { key: "stock-alerts", label: "تنبيهات المخزون", icon: "AlertCircle", adminOnly: true },
    { key: "settings", label: "الإعدادات", icon: "Settings" },
  ].filter((i) => !i.adminOnly || userIsAdmin(user));

  const [cashierExpanded, setCashierExpanded] = useState(false);
  const pendingInvoices = (loadCashierInvoices()?.invoices) || [];

  return (
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-72 max-w-[80vw] bg-[#171A20] shadow-2xl p-4 overflow-y-auto" dir="rtl" style={{ animation: "slideInRight 0.18s ease" }}>
        <h2 className="text-white font-bold text-lg mb-4">الأقسام</h2>
        <div className="space-y-1">
          {items.map((it) => (
            <div key={it.key}>
              <div className="flex items-center">
                <button onClick={() => onNav(it.key)} className="flex-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-[#CBD5E1] hover:bg-white/5 text-right transition-colors">
                  <Icon name={it.icon} size={17} />
                  {it.label}
                </button>
                {it.key === "cashier" && pendingInvoices.length > 0 && (
                  <button onClick={() => setCashierExpanded((v) => !v)} className="p-2 text-[#94A3B8]">
                    <Icon name="ChevronDown" size={14} style={{ transform: cashierExpanded ? "rotate(180deg)" : "none", display: "inline-block", transition: "transform 0.15s" }} />
                  </button>
                )}
              </div>
              {it.key === "cashier" && cashierExpanded && pendingInvoices.length > 0 && (
                <div className="pr-8 space-y-1 mb-1">
                  {pendingInvoices.map((inv) => (
                    <button key={inv.id} onClick={() => onNav("cashier")} className="block w-full text-right text-xs text-[#94A3B8] py-1.5 hover:text-white">
                      {inv.customerName || inv.label} — {inv.items.length} صنف لسه ما اتأكدش
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Header({ user, onLogout, title, onBack, onNav, hideMenu }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
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
              {user.name} · <span className="font-semibold">{userIsAdmin(user) ? "أدمن" : "موظف"}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onNav && (
            <button onClick={() => onNav("settings")} className="bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all">
              <Icon name="Settings" size={17} />
            </button>
          )}
          {onNav && !hideMenu && (
            <button onClick={() => setDrawerOpen(true)} className="bg-black/20 hover:bg-black/30 text-white p-2 rounded-xl transition-all">
              <Icon name="Menu" size={18} />
            </button>
          )}
        </div>
      </div>
      {drawerOpen && onNav && (
        <SideDrawer user={user} onNav={(key) => { onNav(key); setDrawerOpen(false); }} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}

// ---------- Notification bell (order updates for now — see handoff doc) ----------
function NotificationBell({ notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <div className="fixed bottom-5 right-5 z-[110]">
      <button onClick={() => setOpen((v) => !v)} className="relative bg-sky-600 text-white p-3 rounded-full shadow-lg">
        <Icon name="Bell" size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -left-0.5 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[#0F172A]" />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[109]" onClick={() => setOpen(false)} />
          <div className="absolute bottom-14 right-0 w-72 max-h-80 overflow-y-auto panel rounded-2xl p-3 shadow-xl z-[111]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white">الإشعارات</span>
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className="text-[11px] text-sky-400 font-semibold">تحديد الكل كمقروء</button>
              )}
            </div>
            {notifications.length === 0 && <p className="text-xs text-[#64748B] text-center py-4">مفيش إشعارات</p>}
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`text-xs rounded-xl p-2.5 mb-1.5 cursor-pointer leading-5 ${n.read ? "text-[#64748B]" : "text-white bg-sky-500/10 font-semibold"}`}
              >
                {n.message}
                <div className="text-[10px] text-[#64748B] mt-1 font-normal">{new Date(n.createdAt).toLocaleString("ar-EG")}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Main menu ----------
function MainMenu({ user, setView, onLogout, hasNew, onDevReset }) {
  const items = [
    { key: "cashier", label: "الكاشير", desc: "بيع منتجات وطباعة فاتورة", icon: "Wallet", enabled: true, accent: "#10B981" },
    { key: "prices", label: "أسعار المحل", desc: "جملة · نص جملة · قطاعي", icon: "Store", enabled: userIsAdmin(user), accent: "#14B8A6" },
    { key: "orders", label: "الطلبات", desc: "متابعة حالة أوردرات الدليفري", icon: "Package", enabled: true, accent: "#F97316" },
    { key: "transfers", label: "تحويلات", desc: "تسجيل تحويلات فلوس", icon: "Send", enabled: true, accent: "#A855F7" },
    { key: "attendance", label: "الحضور والسحب", desc: "سجل حضورك وسحوباتك", icon: "Clock", enabled: true, accent: "#06B6D4" },
    { key: "admin", label: "إدارة المستخدمين", desc: "الموافقة على الطلبات والصلاحيات", icon: "Users", enabled: userIsAdmin(user), accent: "#0EA5E9" },
    { key: "reports", label: "التقارير", desc: "الأوردرات المؤكدة والمبيعات", icon: "BarChart3", enabled: userIsAdmin(user), accent: "#6366F1" },
    { key: "stock-alerts", label: "تنبيهات المخزون", desc: "منتجات خلصت أو مطلوبة", icon: "AlertCircle", enabled: userIsAdmin(user), accent: "#F43F5E" },
  ].filter((i) => (i.key !== "admin" && i.key !== "reports" && i.key !== "stock-alerts" && i.key !== "prices") || userIsAdmin(user));

  const FAB_OPTIONS = [
    { key: "prices", label: "منتج", icon: "Package", color: "#14B8A6", enabled: userIsAdmin(user) },
    { key: "orders", label: "الطلبات", icon: "Truck", color: "#F97316", enabled: true },
    { key: "cashier", label: "عميل", icon: "User", color: "#10B981", enabled: true },
    { key: "transfers", label: "تحويل", icon: "Send", color: "#A855F7", enabled: true },
  ].filter((o) => o.enabled);
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div className="shop-root">
      <Header user={user} onLogout={onLogout} title="محلات FaAroon" onNav={setView} hideMenu />

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
                  <span className="absolute w-3 h-3 rounded-full" style={{ top: -3, left: -3, background: dotRed ? "#F43F5E" : "#34D399", boxShadow: "0 0 0 2px #1E293B" }} />
                )}
              </div>
              <div className="font-bold text-sm text-white">{it.label}</div>
              <div className="text-xs text-[#94A3B8]">{it.desc}</div>
            </button>
          );
        })}
      </div>



      <div className="fixed bottom-5 left-5 z-[90] flex flex-col items-start gap-2">
        {fabOpen && FAB_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => { setView(opt.key); setFabOpen(false); }}
            className="flex items-center gap-2 rounded-full pl-4 pr-3 py-2 shadow-lg text-white text-xs font-bold fade-up"
            style={{ background: opt.color }}
          >
            {opt.label}
            <Icon name={opt.icon} size={16} />
          </button>
        ))}
        <button
          onClick={() => setFabOpen((v) => !v)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white text-2xl font-bold"
          style={{ background: "linear-gradient(135deg, #0EA5E9, #6366F1)", transform: fabOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease" }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function DevResetModal({ onClose, onConfirmed }) {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

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
    <Modal title={done ? "تم" : "تأكيد التصفير"} accent="#F43F5E" onClose={onClose}>
      {done ? (
        <>
          <p className="text-sm text-emerald-300 mb-4 leading-6">تم مسح كل البيانات بنجاح. حسابات المستخدمين فضلت زي ما هي.</p>
          <button onClick={onClose} className="btn-sky w-full rounded-xl py-2.5 font-bold">تمام</button>
        </>
      ) : (
        <>
          <p className="text-sm text-rose-300 mb-3 leading-6">
            الخطوة دي هتمسح كل المنتجات والأوردرات والتحويلات والتصنيفات نهائيًا ومفيش رجوع فيها. حسابات المستخدمين (الأدمن والموظفين) هتفضل زي ما هي.
          </p>
          <p className="text-xs text-[#94A3B8] mb-1.5">اكتب "تصفير" للتأكيد</p>
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
              <span className="block text-[10px] text-[#94A3B8] mb-0.5">عدد القطع (اختياري)</span>
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
          setTimeout(() => setFailed(false), 3000);
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

  return (
    <>
      {(pullDist > 2 || refreshing) && (
        <div
          className="fixed top-0 inset-x-0 z-[100] flex items-start justify-center pointer-events-none"
          style={{ height: refreshing ? 50 : pullDist, transition: refreshing ? "height 0.15s ease" : "none" }}
        >
          <div className="bg-[#1E293B] border border-white/10 rounded-full p-2.5 shadow-lg mt-2">
            <Icon name="Loader2" size={18} className={refreshing ? "text-sky-400 animate-spin" : "text-sky-400"} />
          </div>
        </div>
      )}
      {failed && (
        <div className="fixed top-3 inset-x-3 z-[100] flex justify-center pointer-events-none">
          <div className="bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in flex items-center gap-1.5">
            <Icon name="AlertCircle" size={14} className="text-rose-400 shrink-0" />
            <span className="text-xs text-rose-300 font-bold">فشل التحديث — تأكد من اتصال الإنترنت</span>
          </div>
        </div>
      )}
    </>
  );
}

function BarcodeListEditor({ barcodes, setBarcodes, onScan }) {
  const updateAt = (i, val) => setBarcodes(barcodes.map((b, idx) => (idx === i ? val : b)));
  const removeAt = (i) => setBarcodes(barcodes.length > 1 ? barcodes.filter((_, idx) => idx !== i) : [""]);
  const addBlank = () => setBarcodes([...barcodes, ""]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#94A3B8]">الباركود (اختياري، ممكن أكتر من واحد لنفس المنتج)</span>
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
          <button onClick={onClose}><Icon name="X" size={20} className="text-[#94A3B8]" /></button>
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
        {product?.image ? <img src={product.image} alt="" className="w-full h-full object-cover" /> : <Icon name="Store" size={32} className="text-[#475569]" />}
      </div>
      {editable && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current && fileRef.current.click()}
            className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full bg-sky-600 flex items-center justify-center border-2 border-[#1E293B] cursor-pointer"
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
          {filtered.length === 0 && !query.trim() && <p className="text-xs text-[#64748B] text-center py-3">لا يوجد تصنيفات بعد</p>}
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

const PAYMENT_METHODS = [
  { key: "cash", label: "كاش", icon: "Banknote" },
  { key: "vodafone_cash", label: "فودافون كاش", icon: "Smartphone" },
  { key: "instapay", label: "انستاباي", icon: "Smartphone" },
  { key: "split", label: "جزء كاش وجزء تحويل", icon: "Banknote" },
];

function PaymentMethodPicker({ value, onChange }) {
  return (
    <>
      <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">طريقة الدفع</span>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {PAYMENT_METHODS.map((m) => (
          <button key={m.key} onClick={() => onChange({ ...value, paymentMethod: m.key })} className={`toggle-pill rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-1 ${value.paymentMethod === m.key ? "active-sky" : ""}`}>
            <Icon name={m.icon} size={13} /> {m.label}
          </button>
        ))}
      </div>
      {value.paymentMethod === "split" && (
        <>
          <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">التحويل عن طريق</span>
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

// ---------- Cashier ----------
// Pulls the first number out of a price-row label (e.g. "من 10 قطع" -> 10) so the
// right quantity-based price can be picked automatically. No number = base price.
function parseQtyThreshold(label) {
  if (!label) return 0;
  const m = String(label).match(/\d+/);
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
  return (
    <button
      onClick={onClick}
      className="rounded-xl h-11 border-2 transition-all flex items-center justify-center text-xs font-bold px-2 flex-1 min-w-[64px]"
      style={{ background: active ? color : `${color}22`, borderColor: color, color: active ? "#0B0D10" : color }}
    >
      {label || ""}
    </button>
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

  return (
    <Modal title="فاتورة جديدة" accent="#10B981" onClose={onClose}>
      <p className="text-xs text-[#94A3B8] mb-1.5">اسم الزبون (اختياري)</p>
      <AutocompleteInput
        value={customerName}
        onChange={handleNameChange}
        options={customerNameOptions}
        placeholder="اكتب اسم الزبون"
        className="mb-1.5"
      />
      {tierAutoPicked && <p className="text-[11px] text-sky-400 mb-2.5">اخترنا تصنيف السعر تلقائي بناءً على آخر مرة اشترى فيها</p>}

      <div className="flex flex-wrap gap-2 mb-4">
        {activeTiers(tierSettings).map((tier) => (
          <TierColorButton
            key={tier.id}
            color={tier.color}
            active={tierKey === tier.id}
            onClick={() => { setTierKey(tier.id); setTierAutoPicked(false); }}
            label={tierSettings.hideFromCustomer ? "" : tier.label}
          />
        ))}
      </div>
      <button
        disabled={!tierKey || busy}
        onClick={() => onCreate(tierKey, customerName.trim())}
        className="btn-emerald w-full rounded-xl py-2.5 font-bold disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {busy && <Icon name="Loader2" size={16} className="animate-spin" />}
        {busy ? "بيحجز رقم الفاتورة..." : "بدء الفاتورة"}
      </button>
    </Modal>
  );
}

// Handles both adding a new cart line and editing an existing one (pass existingItem).
function NumPad({ title, initialValue, onConfirm, onClose }) {
  const [value, setValue] = useState(initialValue || "");
  const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"];

  const press = (k) => {
    playBeep("tap");
    if (k === "⌫") {
      setValue((v) => v.slice(0, -1));
      return;
    }
    if (k === "." && value.includes(".")) return;
    setValue((v) => v + k);
  };

  return ReactDOM.createPortal(
    <Modal title={title} accent="#0EA5E9" onClose={onClose}>
      <div className="text-center text-3xl font-bold text-white mb-4 tabular-nums py-3 border-b border-white/10 min-h-[3rem]">{value || "0"}</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {KEYS.map((k) => (
          <button key={k} onClick={() => press(k)} className="btn-ghost rounded-xl py-4 text-xl font-bold">
            {k}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onConfirm(value)} className="btn-emerald flex-1 rounded-xl py-2.5 font-bold">تم</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2.5 font-bold">إلغاء</button>
      </div>
    </Modal>,
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
  const activeTierObj = activeTiers(tierSettings).find((t) => t.id === tierKey);

  const rows = tierRows(product[tierKey]);
  const qtyNum = parseNum(qty) || 1;
  const autoRow = pickBestRowForQty(rows, qtyNum);
  const displayPrice = priceOverridden ? manualPrice : String(autoRow?.price ?? "");

  const proceedAdd = (finalPrice, finalQty) => {
    const payload = { productId: product.id, productName: product.name, tierKey, priceNote: autoRow?.label, unitPrice: finalPrice, qty: finalQty, lineTotal: finalPrice * finalQty };
    if (existingItem) {
      onUpdate(existingItem.id, payload);
    } else {
      onAdd(payload);
    }
  };

  const confirm = () => {
    const q = parseNum(qty);
    if (q === null || q <= 0) {
      setError("اكتب عدد صحيح");
      return;
    }
    const price = parseNum(displayPrice);
    if (price === null || price < 0) {
      setError("اكتب سعر صحيح");
      return;
    }
    setError("");

    const invoiceTierPrice = tierBase(product[invoice.tierKey]);
    const cheapestTierPrice = Math.min(...activeTiers(tierSettings).map((t) => tierBase(product[t.id])));

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
    return (
      <Modal title={isRed ? "⚠️ أقل من أرخص سعر متاح للمنتج ده!" : "⚠️ أقل من السعر المحدد للفاتورة"} accent={isRed ? "#EF4444" : "#FBBF24"} onClose={() => setWarning(null)}>
        <p className="text-sm text-[#CBD5E1] mb-4">
          السعر اللي كتبته (<span className="font-bold tabular-nums">{warning.price}</span>) أقل من {isRed ? "أرخص سعر متاح للمنتج ده" : "السعر المحدد لنوع الفاتورة دي"}. تحب تكمل بيه؟
        </p>
        <div className="flex gap-2 mb-3">
          <button onClick={() => proceedAdd(warning.price, warning.q)} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">أكمل البيع</button>
          <button onClick={() => setWarning(null)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">رجوع</button>
        </div>
        <button
          onClick={() => { onSuppressWarning(isRed ? "red" : "yellow"); proceedAdd(warning.price, warning.q); }}
          className="w-full text-xs text-[#94A3B8] hover:underline"
        >
          عدم التحذير تاني في الفاتورة دي
        </button>
      </Modal>
    );
  }

  return (
    <Modal title={product.name} accent="#10B981" onClose={onClose}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#94A3B8]">التصنيف</span>
        {!tierPickerOpen && userIsAdmin(user) && (
          <button onClick={() => setTierPickerOpen(true)} className="text-[11px] text-sky-400 font-semibold">تغيير</button>
        )}
      </div>
      {tierPickerOpen ? (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeTiers(tierSettings).map((tier) => (
            <TierColorButton
              key={tier.id}
              color={tier.color}
              active={tierKey === tier.id}
              onClick={() => { setTierKey(tier.id); setPriceOverridden(false); setTierPickerOpen(false); }}
              label={tierSettings.hideFromCustomer ? "" : tier.label}
            />
          ))}
        </div>
      ) : (
        <div
          className="flex gap-2 mb-4"
          onTouchStart={() => { if (!userIsAdmin(user)) tierLongPressRef.current = setTimeout(() => setTierPickerOpen(true), 2000); }}
          onTouchEnd={() => { if (tierLongPressRef.current) clearTimeout(tierLongPressRef.current); }}
          onMouseDown={() => { if (!userIsAdmin(user)) tierLongPressRef.current = setTimeout(() => setTierPickerOpen(true), 2000); }}
          onMouseUp={() => { if (tierLongPressRef.current) clearTimeout(tierLongPressRef.current); }}
        >
          <TierColorButton
            color={activeTierObj?.color}
            active
            onClick={() => {}}
            label={tierSettings.hideFromCustomer ? "" : activeTierObj?.label}
          />
        </div>
      )}

      <p className="text-xs text-[#94A3B8] mb-1.5">الكمية</p>
      <button onClick={() => setNumPadTarget("qty")} className="field-input w-full rounded-xl px-3 py-2 text-sm mb-4 text-center block font-bold tabular-nums">
        {qty || "0"}
      </button>

      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[#94A3B8]">السعر</span>
        {!priceOverridden && userIsAdmin(user) && (
          <button onClick={() => { setManualPrice(displayPrice); setPriceOverridden(true); }} className="text-[11px] text-sky-400 font-semibold">تغيير</button>
        )}
      </div>
      {priceOverridden ? (
        <button onClick={() => setNumPadTarget("price")} className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3 text-center block font-bold tabular-nums">
          {manualPrice || "0"}
        </button>
      ) : (
        <p
          className="text-center text-lg font-bold mb-3 tabular-nums"
          style={{ color: activeTiers(tierSettings).find((t) => t.id === tierKey)?.color || "#fff" }}
          onTouchStart={() => { if (user?.role !== "admin") priceLongPressRef.current = setTimeout(() => { setManualPrice(displayPrice); setPriceOverridden(true); }, 2000); }}
          onTouchEnd={() => { if (priceLongPressRef.current) clearTimeout(priceLongPressRef.current); }}
          onMouseDown={() => { if (user?.role !== "admin") priceLongPressRef.current = setTimeout(() => { setManualPrice(displayPrice); setPriceOverridden(true); }, 2000); }}
          onMouseUp={() => { if (priceLongPressRef.current) clearTimeout(priceLongPressRef.current); }}
        >
          {displayPrice}
        </p>
      )}

      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <button onClick={confirm} className="btn-emerald w-full rounded-xl py-2.5 font-bold">{existingItem ? "حفظ التعديل" : "إضافة للسلة"}</button>

      {numPadTarget && (
        <NumPad
          title={numPadTarget === "qty" ? "الكمية" : "السعر"}
          initialValue={numPadTarget === "qty" ? qty : manualPrice}
          onConfirm={(v) => {
            if (numPadTarget === "qty") setQty(v);
            else setManualPrice(v);
            setNumPadTarget(null);
          }}
          onClose={() => setNumPadTarget(null)}
        />
      )}
    </Modal>
  );
}

function SaleReceiptPreview({ sale, onClose }) {
  const pay = paymentLabel(sale);
  const isDelivery = sale.fulfillment === "delivery";
  return (
    <Modal title="معاينة الفاتورة" accent="#0EA5E9" onClose={onClose}>
      <div className="bg-white text-black rounded-lg p-4 mb-4 text-sm" dir="rtl" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
        <h3 className="text-center font-bold text-base mb-1">FaAroon</h3>
        <p className="text-center text-xs text-gray-500 mb-1">فاتورة كاشير رقم {sale.invoiceNumber ?? ""}</p>
        {sale.customerName && <p className="text-center text-xs text-gray-500 mb-1">الزبون: {sale.customerName}</p>}
        <div className="border-t border-dashed border-gray-300 my-2" />
        {sale.items.map((it, i) => (
          <div key={i} className="flex justify-between text-xs py-0.5">
            <span>{it.productName} × {it.qty}</span>
            <span>{it.lineTotal}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-gray-300 my-2" />
        <div className="flex justify-between font-bold text-sm mb-1"><span>الإجمالي</span><span>{sale.total}</span></div>
        {!isDelivery && (
          <div className="flex justify-between text-xs text-gray-600"><span>طريقة الدفع</span><span>{pay.label}</span></div>
        )}
        {isDelivery && (
          <>
            <div className="border-t border-dashed border-gray-300 my-2" />
            <p className="text-xs font-bold text-gray-700 mb-1">بيانات الدليفري</p>
            <div className="flex justify-between text-xs text-gray-600"><span>المنطقة</span><span>{sale.deliveryArea}</span></div>
            <div className="flex justify-between text-xs text-gray-600"><span>تليفون الزبون</span><span dir="ltr">{sale.customerPhone}</span></div>
            {sale.dispatchLocation && (
              <div className="flex justify-between text-xs text-gray-600"><span>مكان الخروج</span><span>{sale.dispatchLocation}</span></div>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2">
        <button onClick={() => printSaleReceipt(sale)} className="btn-emerald flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2">
          <Icon name="Printer" size={16} /> طباعة
        </button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2.5 font-bold">إغلاق</button>
      </div>
    </Modal>
  );
}

function RenameCustomerModal({ initialName, customerNameOptions, onSave, onClose }) {
  const [name, setName] = useState(initialName || "");
  return (
    <Modal title="اسم الزبون" accent="#0EA5E9" onClose={onClose}>
      <AutocompleteInput
        value={name}
        onChange={setName}
        options={customerNameOptions}
        placeholder="اكتب اسم الزبون"
        className="mb-4"
        autoFocus
      />
      <div className="flex gap-2">
        <button onClick={() => onSave(name.trim())} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
      </div>
    </Modal>
  );
}

function makeEmptyInvoice(tierKey, label, customerName, invoiceNumber) {
  return { id: uid(), label, invoiceNumber, tierKey, customerName: customerName || "", items: [], suppressYellow: false, suppressRed: false };
}

function CashierScreen({ user, products, productsLoading, sales, setSales, tierSettings, invoiceNumberSettings, setInvoiceNumberSettings, usingCachedProducts, attendance, branchSettings, setView }) {
  const [invoices, setInvoices] = useState(() => (loadCashierInvoices()?.invoices) || []);
  const [activeId, setActiveId] = useState(() => {
    const saved = loadCashierInvoices();
    return saved && saved.invoices.length ? saved.invoices[0].id : null;
  });
  const [showNewInvoicePicker, setShowNewInvoicePicker] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    saveCashierInvoices(invoices);
  }, [invoices]);

  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [pickerViaScan, setPickerViaScan] = useState(false);
  const [pickerProduct, setPickerProduct] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [cartNumPad, setCartNumPad] = useState(null); // { id, field: "qty"|"unitPrice", value }
  const cartLongPressRef = React.useRef(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [fulfillment, setFulfillment] = useState("pickup"); // pickup | delivery
  const [deliveryForm, setDeliveryForm] = useState({ area: "", phone: "", dispatchLocation: "" });
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
  const [cancelPrompt, setCancelPrompt] = useState(null);
  const [undoItem, setUndoItem] = useState(null);
  const undoTimerRef = React.useRef(null);

  const activeInvoice = invoices.find((inv) => inv.id === activeId) || null;
  const customerNameOptions = [...new Set(sales.map((s) => s.customerName).filter(Boolean))];
  const customerTierMap = {};
  sales.forEach((s) => {
    if (s.customerName && s.tierKey) customerTierMap[s.customerName] = s.tierKey;
  });

  const salesCountByName = {};
  sales.forEach((s) => {
    s.items.forEach((it) => {
      salesCountByName[it.productName] = (salesCountByName[it.productName] || 0) + it.qty;
    });
  });
  const topProducts = Object.entries(salesCountByName)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => products.find((p) => p.name === name))
    .filter(Boolean);

  const normalizedQuery = normalizeArabic(query);
  const results = normalizedQuery ? products.filter((p) => normalizeArabic(p.name).includes(normalizedQuery)).slice(0, 12) : [];
  const total = activeInvoice ? activeInvoice.items.reduce((s, it) => s + it.lineTotal, 0) : 0;

  useEffect(() => {
    const visibleIds = [...results.map((p) => p.id), ...topProducts.map((p) => p.id)];
    const missing = [...new Set(visibleIds)].filter((id) => !(id in imageCache));
    if (missing.length === 0) return;
    batchGetImages(missing).then((map) => {
      setImageCache((c) => ({ ...c, ...Object.fromEntries(missing.map((id) => [id, map[id] || null])) }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results.map((p) => p.id).join(","), topProducts.map((p) => p.id).join(",")]);

  const createInvoice = async (tierKey, customerName) => {
    setCreatingInvoice(true);
    const { number, updatedSettings } = await claimNextInvoiceNumber(invoiceNumberSettings);
    setInvoiceNumberSettings(updatedSettings);
    const inv = makeEmptyInvoice(tierKey, `فاتورة ${number}`, customerName, number);
    setInvoices((list) => [...list, inv]);
    setActiveId(inv.id);
    setShowNewInvoicePicker(false);
    setCreatingInvoice(false);
    playBeep("switch");
  };

  const updateActiveInvoice = (patch) => {
    setInvoices((list) => list.map((inv) => (inv.id === activeId ? { ...inv, ...patch } : inv)));
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
    setAddedToast(`✓ اتضاف ${payload.productName}`);
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
      setPriceDiffToast(`تنبيه: "${payload.productName}" متسجل قبل كده بسعر مختلف، اتسجل كمنتج منفصل`);
      setTimeout(() => setPriceDiffToast(""), 3000);
      commitNewItem(payload);
    }
  };

  const confirmMerge = () => {
    const { existingItem: ex, payload } = mergePrompt;
    const newQty = ex.qty + payload.qty;
    updateActiveInvoice({
      items: activeInvoice.items.map((it) => (it.id === ex.id ? { ...it, qty: newQty, lineTotal: it.unitPrice * newQty } : it)),
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
      items: activeInvoice.items.map((it) => (it.id === itemId ? { ...it, ...payload } : it)),
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
      undoTimerRef.current = setTimeout(() => setUndoItem(null), 4000);
    }
  };

  const undoRemove = () => {
    if (!undoItem) return;
    setInvoices((list) => list.map((inv) => (inv.id === undoItem.invoiceId ? { ...inv, items: [...inv.items, undoItem.item] } : inv)));
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoItem(null);
    playBeep("tap");
  };

  const setCartItemField = (id, field, rawValue) => {
    const num = parseNum(rawValue);
    if (num === null || num <= 0) return;
    updateActiveInvoice({
      items: activeInvoice.items.map((it) => {
        if (it.id !== id) return it;
        const qty = field === "qty" ? num : it.qty;
        const unitPrice = field === "unitPrice" ? num : it.unitPrice;
        return { ...it, qty, unitPrice, lineTotal: qty * unitPrice };
      }),
    });
    playBeep("tap");
  };

  const closeInvoice = (id) => {
    const remaining = invoices.filter((inv) => inv.id !== id);
    setInvoices(remaining);
    if (activeId === id) setActiveId(remaining.length ? remaining[0].id : null);
    setCancelPrompt(null);
  };

  const handleScanResult = (code) => {
    setScanning(false);
    const match = products.find((p) => (p.barcodes && p.barcodes.includes(code)) || p.barcode === code);
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
    const err = validatePaymentMethod(confirmForm, total);
    if (err) {
      setConfirmError(err);
      playBeep("error");
      return;
    }
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
      createdAt: Date.now(),
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

  const completeDeliveryOrder = () => {
    if (!deliveryForm.area.trim()) {
      setDeliveryError("اكتب المنطقة أو اسم المحل");
      return;
    }
    const phoneErr = validateEgyptPhone(deliveryForm.phone);
    if (phoneErr) {
      setDeliveryError(phoneErr);
      return;
    }
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
      createdAt: Date.now(),
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

  return (
    <div className="shop-root">
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="الكاشير" onNav={setView} />
      <div className="max-w-lg lg:max-w-6xl mx-auto px-4 py-2 fade-up pb-6 lg:grid lg:grid-cols-[14rem_28rem_14rem] lg:justify-center lg:gap-6 lg:items-start">
        <div className="hidden lg:block" />
        <div className="lg:w-full">
        {usingCachedProducts && (
          <div className="bg-amber-950/40 border border-amber-800 rounded-xl px-3 py-2 mb-3 text-xs text-amber-300 font-bold text-center">
            📴 مفيش اتصال بالنت — الأسعار دي آخر نسخة محفوظة على الفون
          </div>
        )}
        {productsLoading && products.length === 0 && (
          <div className="mb-4">
            <SkeletonRows count={5} height={60} />
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto mb-4 pb-1">
          {invoices.map((inv) => (
            <div key={inv.id} className={`shrink-0 rounded-xl flex items-center ${activeId === inv.id ? "btn-sky" : "btn-ghost"}`}>
              <button
                onClick={() => { setActiveId(inv.id); playBeep("switch"); }}
                onTouchStart={() => handleTabPressStart(inv.id)}
                onTouchEnd={handleTabPressEnd}
                onMouseDown={() => handleTabPressStart(inv.id)}
                onMouseUp={handleTabPressEnd}
                onMouseLeave={handleTabPressEnd}
                className="pr-3 pl-1.5 py-2 text-xs font-bold"
              >
                {inv.customerName || inv.label}
              </button>
              <button onClick={() => setCancelPrompt(inv.id)} className="pl-2 pr-1.5 py-2 opacity-70">
                <Icon name="X" size={13} />
              </button>
            </div>
          ))}
          <button onClick={() => setShowNewInvoicePicker(true)} className="shrink-0 icon-btn rounded-xl px-3 py-2 flex items-center gap-1">
            <Icon name="Plus" size={15} /> فاتورة جديدة
          </button>
        </div>

        {!activeInvoice && (
          <p className="text-center text-[#64748B] py-10 text-sm">افتح فاتورة جديدة عشان تبدأ البيع</p>
        )}

        {activeInvoice && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Icon name="Search" size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B] pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ابحث عن منتج تضيفه..."
                  className="field-input w-full rounded-xl pr-9 pl-9 py-2.5 text-sm"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute top-1/2 -translate-y-1/2 left-3 text-[#64748B]">
                    <Icon name="X" size={15} />
                  </button>
                )}
              </div>
              <span className="text-xs font-bold text-sky-400 shrink-0">#{activeInvoice.invoiceNumber ?? "?"}</span>
              <button onClick={() => { setPickerViaScan(true); setScanning(true); }} className="icon-btn rounded-xl px-3"><Icon name="ScanLine" size={18} /></button>
            </div>

            {results.length > 0 && (
              <div className="space-y-2 mb-4">
                {results.map((p) => (
                  <button key={p.id} onClick={() => { setPickerViaScan(false); setPickerProduct(p); }} className="panel rounded-xl p-3 w-full text-right flex items-center justify-between">
                    <span className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg overflow-hidden bg-black/25 flex items-center justify-center shrink-0">
                        {imageCache[p.id] ? <img src={imageCache[p.id]} alt="" className="w-full h-full object-cover" /> : <Icon name="Store" size={16} className="text-[#475569]" />}
                      </span>
                      <span className="font-bold text-sm text-white">{p.name}</span>
                    </span>
                    <Icon name="Plus" size={16} className="text-emerald-400" />
                  </button>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <div className="text-center py-6 mb-4">
                <Icon name="Search" size={22} className="text-[#475569] mx-auto mb-2" />
                <p className="text-sm text-[#64748B]">مفيش منتج بالاسم ده</p>
              </div>
            )}

            <h3 className="font-bold text-sm text-white mb-2">السلة</h3>
            {activeInvoice.items.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">السلة فاضية، دوّر على منتج فوق</p>}
            <div className="space-y-2 mb-4">
              {activeInvoice.items.map((it) => (
                <div key={it.id} className="panel rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <button onClick={() => setEditingItem(it)} className="text-right flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">{it.productName}</p>
                    </button>
                    <button onClick={() => removeFromCart(it.id)} className="text-rose-400 shrink-0 p-1"><Icon name="X" size={16} /></button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] pt-2 border-t border-white/5">
                    <button
                      onTouchStart={() => { cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "qty", value: String(it.qty) }), 2000); }}
                      onTouchEnd={() => clearTimeout(cartLongPressRef.current)}
                      onMouseDown={() => { cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "qty", value: String(it.qty) }), 2000); }}
                      onMouseUp={() => clearTimeout(cartLongPressRef.current)}
                      onMouseLeave={() => clearTimeout(cartLongPressRef.current)}
                      className="text-center"
                    >
                      <span className="block text-[10px] text-[#64748B]">الكمية</span>
                      <span className="font-bold text-white tabular-nums">{it.qty}</span>
                    </button>
                    <button
                      onTouchStart={() => { cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "unitPrice", value: String(it.unitPrice) }), 2000); }}
                      onTouchEnd={() => clearTimeout(cartLongPressRef.current)}
                      onMouseDown={() => { cartLongPressRef.current = setTimeout(() => setCartNumPad({ id: it.id, field: "unitPrice", value: String(it.unitPrice) }), 2000); }}
                      onMouseUp={() => clearTimeout(cartLongPressRef.current)}
                      onMouseLeave={() => clearTimeout(cartLongPressRef.current)}
                      className="text-center"
                    >
                      <span className="block text-[10px] text-[#64748B]">سعر القطعة</span>
                      <span className="font-bold text-white tabular-nums">{it.unitPrice}</span>
                    </button>
                    <div className="text-left">
                      <span className="block text-[10px] text-[#64748B]">الإجمالي</span>
                      <span className="font-bold text-emerald-400 tabular-nums">{it.lineTotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky bottom-3 z-10 mt-2">
              {activeInvoice.items.length > 0 && (
                <div className="panel rounded-2xl p-4 flex items-center justify-between mb-2 shadow-2xl">
                  <span className="text-sm text-[#94A3B8]">الإجمالي</span>
                  <span className="font-bold text-xl text-sky-400 tabular-nums">{total}</span>
                </div>
              )}

              <button
                disabled={activeInvoice.items.length === 0}
                onClick={() => setShowCheckout(true)}
                className="btn-emerald w-full rounded-xl py-3 font-bold flex items-center justify-center gap-2 disabled:opacity-40 shadow-xl"
              >
                <Icon name="CheckCircle2" size={18} /> إتمام البيع
              </button>
            </div>
          </>
        )}
        </div>

        {activeInvoice && !query && topProducts.length > 0 && (
          <div className="hidden lg:block">
            <p className="text-xs text-[#94A3B8] mb-2">الأكتر مبيعًا</p>
            <div className="space-y-2">
              {topProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPickerViaScan(false); setPickerProduct(p); }}
                  className="panel rounded-xl p-2.5 text-right flex items-center gap-2.5 w-full"
                >
                  <span className="w-10 h-10 rounded-lg overflow-hidden bg-black/25 flex items-center justify-center shrink-0">
                    {imageCache[p.id] ? <img src={imageCache[p.id]} alt="" className="w-full h-full object-cover" /> : <Icon name="Store" size={18} className="text-[#475569]" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-xs text-white truncate">{p.name}</span>
                    <span className="block font-bold text-sm text-emerald-400 tabular-nums mt-0.5">{tierBase(p[activeInvoice.tierKey])}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showNewInvoicePicker && (
          <NewInvoiceTierModal customerNameOptions={customerNameOptions} customerTierMap={customerTierMap} tierSettings={tierSettings} busy={creatingInvoice} onCreate={createInvoice} onClose={() => setShowNewInvoicePicker(false)} />
        )}

        {pickerProduct && activeInvoice && !mergePrompt && (
          <ProductPickerModal
            product={pickerProduct}
            invoice={activeInvoice}
            tierSettings={tierSettings}
            user={user}
            onAdd={addToCart}
            onSuppressWarning={handleSuppressWarning}
            onClose={() => { setPickerProduct(null); setPickerViaScan(false); }}
          />
        )}

        {editingItem && activeInvoice && (
          <ProductPickerModal
            product={products.find((p) => p.id === editingItem.productId) || { name: editingItem.productName, ...Object.fromEntries(activeTiers(tierSettings).map((t) => [t.id, []])) }}
            invoice={activeInvoice}
            existingItem={editingItem}
            tierSettings={tierSettings}
            user={user}
            onUpdate={updateCartItem}
            onSuppressWarning={handleSuppressWarning}
            onClose={() => setEditingItem(null)}
          />
        )}

        {cartNumPad && (
          <NumPad
            title={cartNumPad.field === "qty" ? "الكمية" : "سعر القطعة"}
            initialValue={cartNumPad.value}
            onConfirm={(val) => { setCartItemField(cartNumPad.id, cartNumPad.field, val); setCartNumPad(null); }}
            onClose={() => setCartNumPad(null)}
          />
        )}

        {scanning && <BarcodeScannerModal onDetected={handleScanResult} onClose={() => { setScanning(false); setPickerViaScan(false); }} />}

        {renamingCustomer && activeInvoice && (
          <RenameCustomerModal
            initialName={activeInvoice.customerName}
            customerNameOptions={customerNameOptions}
            onSave={(name) => {
              const patch = { customerName: name };
              const knownTier = customerTierMap[name.trim()];
              if (knownTier && activeTiers(tierSettings).some((t) => t.id === knownTier)) {
                patch.tierKey = knownTier;
              }
              updateActiveInvoice(patch);
              setRenamingCustomer(false);
            }}
            onClose={() => setRenamingCustomer(false)}
          />
        )}

        {mergePrompt && (
          <Modal title="المنتج ده متسجل بالفعل" accent="#0EA5E9" onClose={cancelMerge}>
            <p className="text-sm text-[#CBD5E1] mb-4">
              "{mergePrompt.payload.productName}" موجود بالفعل في الفاتورة دي بنفس السعر (الكمية الحالية: {mergePrompt.existingItem.qty}). عايز تزوّد الكمية عليه؟
            </p>
            <div className="flex gap-2">
              <button onClick={confirmMerge} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">أيوه، زوّد الكمية</button>
              <button onClick={cancelMerge} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">لأ</button>
            </div>
          </Modal>
        )}

        {notFoundToast && (
          <div className="fixed bottom-4 inset-x-4 z-[95] flex justify-center">
            <div className="bg-rose-950/90 border border-rose-800 rounded-xl px-4 py-2 toast-in text-xs text-rose-300 font-bold">
              مفيش منتج بالباركود ده
            </div>
          </div>
        )}
        {priceDiffToast && (
          <div className="fixed bottom-4 inset-x-4 z-[95] flex justify-center">
            <div className="bg-amber-950/90 border border-amber-700 rounded-xl px-4 py-2 toast-in text-xs text-amber-300 font-bold text-center">
              {priceDiffToast}
            </div>
          </div>
        )}
        {addedToast && (
          <div className="fixed bottom-4 inset-x-4 z-[95] flex justify-center">
            <div className="bg-emerald-950/90 border border-emerald-700 rounded-xl px-4 py-2 toast-in text-xs text-emerald-300 font-bold">
              {addedToast}
            </div>
          </div>
        )}
        {undoItem && (
          <div className="fixed bottom-4 inset-x-4 z-[95] flex justify-center">
            <div className="bg-[#22252C] border border-white/10 rounded-xl px-4 py-2 toast-in text-xs text-white font-bold flex items-center gap-3">
              <span>اتشال "{undoItem.item.productName}"</span>
              <button onClick={undoRemove} className="text-sky-400 font-bold">تراجع</button>
            </div>
          </div>
        )}

        {cancelPrompt && (
          <Modal title="إلغاء الفاتورة" accent="#EF4444" onClose={() => setCancelPrompt(null)}>
            <p className="text-sm text-[#CBD5E1] mb-4">هتتمسح الفاتورة دي بكل اللي فيها ومش هتقدر ترجعها. متأكد؟</p>
            <div className="flex gap-2">
              <button onClick={() => closeInvoice(cancelPrompt)} className="flex-1 rounded-xl py-2 text-sm font-bold bg-rose-600 text-white">أيوه، امسحها</button>
              <button onClick={() => setCancelPrompt(null)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">رجوع</button>
            </div>
          </Modal>
        )}

        {showCheckout && (
          <Modal title="إتمام البيع" accent="#10B981" onClose={() => setShowCheckout(false)}>
            <p className="text-center text-2xl font-bold text-white mb-4 tabular-nums">{total}</p>

            <div className="flex gap-2 mb-4">
              <button onClick={() => setFulfillment("pickup")} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${fulfillment === "pickup" ? "btn-emerald" : "btn-ghost"}`}>استلام</button>
              <button onClick={() => setFulfillment("delivery")} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${fulfillment === "delivery" ? "btn-sky" : "btn-ghost"}`}>دليفري</button>
            </div>

            {fulfillment === "pickup" ? (
              <>
                <PaymentMethodPicker value={confirmForm} onChange={setConfirmForm} />
                {confirmError && <p className="text-rose-400 text-xs mb-3">{confirmError}</p>}
                <button onClick={completeSale} className="btn-emerald w-full rounded-xl py-2.5 font-bold">تأكيد البيع</button>
              </>
            ) : (
              <>
                <TextField label="المنطقة أو اسم المحل" icon="MapPin" value={deliveryForm.area} onChange={(e) => setDeliveryForm({ ...deliveryForm, area: e.target.value })} placeholder="مثال: المهندسين" />
                <TextField label="رقم تليفون الزبون" icon="Smartphone" value={deliveryForm.phone} onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })} placeholder="01xxxxxxxxx" />
                <div className="mb-4">
                  <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">مكان الخروج (اختياري دلوقتي)</span>
                  <div className="flex gap-2">
                    {branchSettings.branches.map((b) => (
                      <button key={b.id} onClick={() => setDeliveryForm({ ...deliveryForm, dispatchLocation: deliveryForm.dispatchLocation === b.name ? "" : b.name })} className={`toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${deliveryForm.dispatchLocation === b.name ? "active-sky" : ""}`}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
                {deliveryError && <p className="text-rose-400 text-xs mb-3">{deliveryError}</p>}
                <button onClick={completeDeliveryOrder} className="btn-sky w-full rounded-xl py-2.5 font-bold">تأكيد الأوردر</button>
              </>
            )}
          </Modal>
        )}

        {lastSale && (
          <Modal title={lastSale.fulfillment === "delivery" ? "تم تسجيل الأوردر" : "تم البيع بنجاح"} accent="#34D399" onClose={() => setLastSale(null)}>
            <p className="text-sm text-[#CBD5E1] mb-4">الإجمالي: <span className="font-bold text-emerald-400 tabular-nums">{lastSale.total}</span></p>
            {lastSale.fulfillment === "delivery" && (
              <p className="text-xs text-[#94A3B8] mb-4">الأوردر بحالة "تم التجهيز" — تلاقيه في قسم الطلبات لتسجيل الإرسال.</p>
            )}
            <button onClick={() => setShowReceiptPreview(true)} className="btn-sky w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-2">
              <Icon name="Printer" size={16} /> معاينة وطباعة الفاتورة
            </button>
            <button onClick={() => setLastSale(null)} className="btn-ghost w-full rounded-xl py-2.5 font-bold">إغلاق</button>
          </Modal>
        )}
        {showReceiptPreview && lastSale && (
          <SaleReceiptPreview sale={lastSale} onClose={() => setShowReceiptPreview(false)} />
        )}
      </div>
    </div>
  );
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
    priceRows: Object.fromEntries(tiers.map((t) => [t.id, [makeEmptyRow()]])),
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
      const match = products.find((p) => (p.barcodes && p.barcodes.includes(code)) || p.barcode === code);
      if (match) {
        setQuery(match.name);
        showToast(`لقينا: ${match.name}`);
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
    const fresh = await productsStore.loadAll();
    if (fresh) {
      setProducts(fresh);
      saveDataCache("products", fresh);
      setUsingCachedProducts(false);
    }
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
    const priceRows = Object.fromEntries(activeTiers(tierSettings).map((t) => [t.id, toEditRows(p[t.id])]));
    setDraft({ priceRows, costPrice: p.costPrice ?? "", barcodes: existingBarcodes });
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
      const updated = { ...existing, name: newProd.name.trim(), ...tierFields, image, barcodes: cleanBarcodes(newProd.barcodes), categoryId: newProd.categoryId, updatedAt: Date.now(), ...(isAdmin ? { costPrice } : {}) };
      setProducts(products.map((p) => (p.id === overwriteId ? updated : p)));
      productsStore.upsert(stripImage(updated));
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
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="أسعار المحل" onNav={setView} />

      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        {usingCachedProducts && (
          <div className="bg-amber-950/40 border border-amber-800 rounded-xl px-3 py-2 mb-3 text-xs text-amber-300 font-bold text-center">
            📴 مفيش اتصال بالنت — البيانات دي آخر نسخة محفوظة على الفون
          </div>
        )}
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
        {toast && <div className="toast-in text-xs text-center text-[#CBD5E1] bg-black/30 border border-white/10 rounded-xl px-3 py-2 mb-3">{toast}</div>}

        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن منتج... (عربي أو English)" className="field-input w-full rounded-xl px-4 py-2.5 pr-10 text-[15px]" />
            <Icon name="Search" size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#64748B]" />
          </div>
          <button onClick={() => setScannerTarget({ mode: "lookup" })} title="امسح الباركود" className="icon-btn rounded-xl px-3">
            <Icon name="ScanLine" size={18} />
          </button>
        </div>

        {isAdmin && legacyImageProducts.length > 0 && (
          <div className="panel rounded-xl p-3 mb-3 border border-amber-500/30 bg-amber-500/5">
            <p className="text-xs text-amber-300 font-bold mb-1.5">تحسين الأداء متاح</p>
            <p className="text-xs text-[#CBD5E1] mb-2">
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
            <Icon name="Tag" size={16} className="text-[#64748B] shrink-0" />
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
            <SkeletonRows count={6} height={110} />
          )}
          {!productsLoading && products.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">لا يوجد منتجات مضافة بعد</p>}
          {products.length > 0 && filteredProducts.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">مفيش نتائج تطابق بحثك</p>}

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
                      {activeTiers(tierSettings).map((tier) => (
                        <TierPriceEditor
                          key={tier.id}
                          label={tier.label}
                          color={tier.color}
                          rows={draft.priceRows[tier.id]}
                          setRows={(rows) => setDraft({ ...draft, priceRows: { ...draft.priceRows, [tier.id]: rows } })}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-1.5 text-center text-[11px]" style={{ gridTemplateColumns: `repeat(${activeTiers(tierSettings).length}, 1fr)` }}>
                      {activeTiers(tierSettings).map((tier) => (
                        <div key={tier.id} className="price-chip">
                          <span className="block text-[#94A3B8] mb-1">{tier.label}</span>
                          <div className="space-y-1">
                            {tierRows(p[tier.id]).map((r, i) => (
                              <div key={i}>
                                <span className="font-bold tabular-nums" style={{ color: tier.color }}>{r.price}</span>
                                {(r.label || i > 0) && <div className="text-xs font-bold text-[#CBD5E1] leading-tight mt-0.5">{r.label || "سعر تاني"}</div>}
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
                  <p className="text-[10px] text-[#64748B] mt-1.5 flex items-center gap-1"><Icon name="Wallet" size={10} /> سعر الشراء: {p.costPrice}</p>
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
              <span className="text-xs text-[#94A3B8]">اضغط على الأيقونة لإضافة صورة المنتج (اختياري)</span>
            </div>
            <input placeholder="اسم المنتج" value={newProd.name} onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3" />

            <BarcodeListEditor barcodes={newProd.barcodes} setBarcodes={(barcodes) => setNewProd({ ...newProd, barcodes })} onScan={(i) => setScannerTarget({ mode: "new", index: i })} />

            <div className="space-y-2 mb-3">
              {activeTiers(tierSettings).map((tier) => (
                <TierPriceEditor
                  key={tier.id}
                  label={tier.label}
                  color={tier.color}
                  rows={newProd.priceRows[tier.id]}
                  setRows={(rows) => setNewProd({ ...newProd, priceRows: { ...newProd.priceRows, [tier.id]: rows } })}
                />
              ))}
            </div>

            <div className="mb-3">
              <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">تصنيف المنتج (اختياري)</span>
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
                <span className="block mb-1.5 text-xs font-medium text-[#94A3B8] flex items-center gap-1"><Icon name="Wallet" size={12} /> سعر الشراء (يظهر لك بس، اختياري)</span>
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
            <p className="text-sm text-[#CBD5E1] mb-4">
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
            <p className="text-sm text-[#CBD5E1] mb-4">
              <span className="font-bold text-white">{outOfStockProduct.name}</span> — اختار الفرع اللي المنتج خلص فيه، هيتبعت للأدمن على طول.
            </p>
            <div className="flex gap-2">
              {branchSettings.branches.map((b) => (
                <button key={b.id} onClick={() => reportOutOfStock(outOfStockProduct, b.name)} className="btn-sky flex-1 rounded-xl py-2.5 text-sm font-bold">
                  {b.name}
                </button>
              ))}
            </div>
          </Modal>
        )}

        {showMissingProduct && (
          <Modal title="منتج مش موجود في القايمة" accent="#A855F7" onClose={() => { setShowMissingProduct(false); setMissingProductName(""); }}>
            <p className="text-sm text-[#CBD5E1] mb-3">اكتب اسم أو وصف المنتج اللي الزبون سأل عنه، هيتبعت للأدمن.</p>
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

        {notFoundBarcode && (
          <Modal title="مفيش منتج بالباركود ده" accent="#FBBF24" onClose={() => setNotFoundBarcode(null)}>
            <p className="text-sm text-[#CBD5E1] mb-4">
              الباركود <span className="font-bold text-white">{notFoundBarcode}</span> مش متسجل لأي منتج. تحب تضيفه كمنتج جديد بالباركود ده؟
            </p>
            <div className="flex gap-2">
              <button onClick={addProductFromNotFoundBarcode} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">إضافة منتج</button>
              <button onClick={() => setNotFoundBarcode(null)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
            </div>
          </Modal>
        )}

        {showClearConfirm && (
          <Modal title="📋 تم فتح واتساب" accent="#25D366" onClose={() => setShowClearConfirm(false)}>
            <p className="text-sm text-[#CBD5E1] mb-4">اختار جروب الموظفين من واتساب وابعت الرسالة اللي اتفتحت. تحب تصفّر عداد التعديلات دلوقتي؟</p>
            <div className="flex gap-2">
              <button onClick={() => { clearChangeLog(); setShowClearConfirm(false); }} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">تصفير العداد</button>
              <button onClick={() => setShowClearConfirm(false)} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">سيبه زي ما هو</button>
            </div>
          </Modal>
        )}

        {showManualReset && (
          <Modal title="⚠️ تصفير عداد التعديلات" accent="#FB7185" onClose={() => setShowManualReset(false)}>
            <p className="text-sm text-[#CBD5E1] mb-4">هيتصفّر عدد التعديلات المسجلة دلوقتي ({changedToday.length}) من غير ما تتبعت أي رسالة. متأكد؟</p>
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

// ---------- Orders screen (delivery-tracking view over sales_col) ----------
// Delivery orders are now created from the cashier at checkout time ("دليفري"
// choice) — this screen is purely for tracking them through their two
// remaining stages: تم التجهيز -> تسجيل الإرسال -> (لو مش مدفوع مقدمًا)
// تأكيد الاستلام. See the handoff doc for the full agreed design.

function OrdersScreen({ user, sales, setSales, users, branchSettings, setView }) {
  const [tab, setTab] = useState("pending"); // pending (needs receipt) | mine
  const [sendingOrder, setSendingOrder] = useState(null);
  const [receivingOrder, setReceivingOrder] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  const deliveries = sales.filter((s) => s.fulfillment === "delivery");
  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const pendingReceipt = deliveries
    .filter((s) => s.deliveryStatus === "sent")
    .sort((a, b) => (a.sentAt || 0) - (b.sentAt || 0));

  const mine = deliveries
    .filter((s) => userIsAdmin(user) || s.employeeName === user.name)
    .filter((s) => s.deliveryStatus !== "done" || (s.receivedAt && now - s.receivedAt < DAY_MS))
    .sort((a, b) => b.createdAt - a.createdAt);

  const statusLabel = (s) => {
    if (s.deliveryStatus === "prepared") return { label: "تم التجهيز", color: "#FBBF24" };
    if (s.deliveryStatus === "sent") return { label: "تم الإرسال", color: "#38BDF8" };
    return { label: "تم الاستلام", color: "#34D399" };
  };

  const registerSend = (form) => {
    const err = form.paidUpfront ? validatePaymentMethod(form, sendingOrder.total) : null;
    if (!form.repName.trim()) return "اكتب اسم المندوب";
    if (!sendingOrder.dispatchLocation && !form.dispatchLocation) return "اختار مكان خروج الأوردر";
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
      receivedAt: form.paidUpfront ? now2 : null,
    };
    setSales(sales.map((s) => (s.id === updated.id ? updated : s)));
    salesStore.upsert(updated);
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
      receivedAt: now2,
    };
    setSales(sales.map((s) => (s.id === updated.id ? updated : s)));
    salesStore.upsert(updated);
    if (updated.employeeName) {
      sendNotification(updated.employeeName, `أوردر (فاتورة #${updated.invoiceNumber ?? "?"}) / (${updated.deliveryArea}) تم استلامه`);
    }
    setReceivingOrder(null);
    return null;
  };

  const renderCard = (s) => {
    const st = statusLabel(s);
    const canSend = s.deliveryStatus === "prepared" && s.employeeName === user.name;
    const canReceive = s.deliveryStatus === "sent";
    return (
      <div key={s.id} className="panel p-4 rounded-2xl">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-1.5"><Icon name="Truck" size={15} className="text-[#94A3B8]" /> {s.deliveryArea}</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">فاتورة #{s.invoiceNumber ?? "?"} · {s.items.length} صنف</p>
          </div>
          <span className="font-bold text-lg text-sky-400 tabular-nums">{s.total}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${st.color}22`, color: st.color }}>{st.label}</span>
          <span className="text-xs font-bold text-amber-300">{s.employeeName} <span className="text-[#64748B] font-normal">· {new Date(s.createdAt).toLocaleDateString("ar-EG")}</span></span>
        </div>
        {s.repName && <p className="text-xs text-[#CBD5E1] mt-2">المندوب: {s.repName}</p>}

        <div className="flex items-center justify-between mt-2">
          <button onClick={() => setDetailOrder(s)} className="text-xs text-sky-400 font-semibold hover:underline">عرض التفاصيل</button>
          {canSend && (
            <button onClick={() => setSendingOrder(s)} className="btn-sky text-xs px-3 py-1.5 rounded-lg font-bold">تسجيل الإرسال</button>
          )}
          {canReceive && (
            <button onClick={() => setReceivingOrder(s)} className="btn-emerald text-xs px-3 py-1.5 rounded-lg font-bold">تأكيد الاستلام</button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={async () => { const fresh = await salesStore.loadAll(); if (fresh) setSales(fresh); }} />
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="الطلبات" onNav={setView} />

      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab("pending")} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${tab === "pending" ? "btn-sky" : "btn-ghost"}`}>
            محتاجة إجراء{pendingReceipt.length > 0 ? ` (${pendingReceipt.length})` : ""}
          </button>
          <button onClick={() => setTab("mine")} className={`flex-1 rounded-xl py-2.5 text-sm font-bold ${tab === "mine" ? "btn-sky" : "btn-ghost"}`}>أوردراتي</button>
        </div>

        <div className="space-y-3 pb-6">
          {tab === "pending" && (
            <>
              {pendingReceipt.length === 0 && <p className="text-center text-[#64748B] py-10 text-sm">مفيش أوردرات محتاجة استلام دلوقتي</p>}
              {pendingReceipt.map(renderCard)}
            </>
          )}
          {tab === "mine" && (
            <>
              {mine.length === 0 && <p className="text-center text-[#64748B] py-10 text-sm">مفيش أوردرات لسه</p>}
              {mine.map(renderCard)}
            </>
          )}
        </div>
      </div>

      {sendingOrder && (
        <SendOrderModal
          order={sendingOrder}
          branchSettings={branchSettings}
          onSubmit={submitSend}
          onClose={() => setSendingOrder(null)}
        />
      )}
      {receivingOrder && (
        <ReceiveOrderModal
          order={receivingOrder}
          onSubmit={submitReceive}
          onClose={() => setReceivingOrder(null)}
        />
      )}
      {detailOrder && (
        <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />
      )}
    </div>
  );
}

function SendOrderModal({ order, branchSettings, onSubmit, onClose }) {
  const [repName, setRepName] = useState("");
  const [dispatchLocation, setDispatchLocation] = useState("");
  const [paidUpfront, setPaidUpfront] = useState(null);
  const [pm, setPm] = useState(EMPTY_CONFIRM_FORM);
  const [error, setError] = useState("");

  const submit = () => {
    if (!repName.trim()) { setError("اكتب اسم المندوب"); return; }
    if (!order.dispatchLocation && !dispatchLocation) { setError("اختار مكان خروج الأوردر"); return; }
    if (paidUpfront === null) { setError("حدد الأوردر مدفوع مقدمًا ولا لأ"); return; }
    const form = { repName, dispatchLocation, paidUpfront, ...pm };
    const err = onSubmit(form);
    if (err) setError(err);
  };

  return (
    <Modal title="تسجيل الإرسال" accent="#38BDF8" onClose={onClose}>
      <TextField label="اسم المندوب" icon="User" value={repName} onChange={(e) => setRepName(e.target.value)} placeholder="اكتب اسم المندوب" />

      {!order.dispatchLocation && (
        <div className="mb-4">
          <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">مكان الخروج</span>
          <div className="flex gap-2">
            {branchSettings.branches.map((b) => (
              <button key={b.id} onClick={() => setDispatchLocation(b.name)} className={`toggle-pill flex-1 rounded-xl py-2 text-sm font-bold ${dispatchLocation === b.name ? "active-sky" : ""}`}>
                {b.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">مدفوع مقدمًا؟</span>
        <div className="flex gap-2">
          <button onClick={() => setPaidUpfront(true)} className={`flex-1 rounded-xl py-2 text-sm font-bold ${paidUpfront === true ? "btn-emerald" : "btn-ghost"}`}>أيوه، اتدفع</button>
          <button onClick={() => setPaidUpfront(false)} className={`flex-1 rounded-xl py-2 text-sm font-bold ${paidUpfront === false ? "btn-sky" : "btn-ghost"}`}>لأ، هيتدفع عند التسليم</button>
        </div>
      </div>

      {paidUpfront === true && <PaymentMethodPicker value={pm} onChange={setPm} />}

      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <button onClick={submit} className="btn-sky w-full rounded-xl py-2.5 font-bold">تم</button>
    </Modal>
  );
}

function ReceiveOrderModal({ order, onSubmit, onClose }) {
  const [pm, setPm] = useState(EMPTY_CONFIRM_FORM);
  const [error, setError] = useState("");

  const submit = () => {
    const err = onSubmit(pm);
    if (err) setError(err);
  };

  return (
    <Modal title="تأكيد الاستلام" accent="#10B981" onClose={onClose}>
      <p className="text-sm text-[#CBD5E1] mb-4">الإجمالي: <span className="font-bold text-emerald-400 tabular-nums">{order.total}</span></p>
      <PaymentMethodPicker value={pm} onChange={setPm} />
      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <button onClick={submit} className="btn-emerald w-full rounded-xl py-2.5 font-bold">تأكيد الاستلام</button>
    </Modal>
  );
}

function OrderDetailModal({ order, onClose }) {
  const pay = paymentLabel(order);
  return (
    <Modal title={`فاتورة #${order.invoiceNumber ?? "?"}`} accent="#0EA5E9" onClose={onClose}>
      <div className="space-y-1.5 text-xs text-[#CBD5E1] mb-4">
        <p><span className="text-[#94A3B8]">المنطقة: </span>{order.deliveryArea}</p>
        <p><span className="text-[#94A3B8]">تليفون الزبون: </span><span dir="ltr">{order.customerPhone}</span></p>
        {order.dispatchLocation && <p><span className="text-[#94A3B8]">مكان الخروج: </span>{order.dispatchLocation}</p>}
        {order.repName && <p><span className="text-[#94A3B8]">المندوب: </span>{order.repName}</p>}
        <p><span className="text-[#94A3B8]">أنشأها: </span>{order.employeeName} · {new Date(order.createdAt).toLocaleString("ar-EG")}</p>
        {order.sentBy && <p><span className="text-[#94A3B8]">سجّل الإرسال: </span>{order.sentBy} · {new Date(order.sentAt).toLocaleString("ar-EG")}</p>}
        {order.receivedBy && <p><span className="text-[#94A3B8]">أكّد الاستلام: </span>{order.receivedBy} · {new Date(order.receivedAt).toLocaleString("ar-EG")}</p>}
        {order.deliveryStatus === "done" && <p><span className="text-[#94A3B8]">طريقة الدفع: </span>{pay.label}</p>}
        <div className="border-t border-white/5 pt-1.5 mt-1.5">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between">
              <span>{it.productName} × {it.qty}</span>
              <span className="tabular-nums">{it.lineTotal}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1.5 border-t border-white/5 font-bold text-white">
          <span>الإجمالي</span>
          <span className="tabular-nums">{order.total}</span>
        </div>
      </div>
      <button onClick={onClose} className="btn-ghost w-full rounded-xl py-2.5 font-bold">إغلاق</button>
    </Modal>
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
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="تحويلات" onNav={setView} />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <button onClick={() => { setShowAdd(true); setError(""); }} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mb-4">
          <Icon name="Plus" size={18} /> تسجيل تحويل جديد
        </button>

        <div className="space-y-3 pb-6">
          {transfers.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">لا يوجد تحويلات مسجلة بعد</p>}
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
                  <span className="text-xs font-bold text-amber-300">{t.createdBy} <span className="text-[#64748B] font-normal">· {new Date(t.createdAt).toLocaleString("ar-EG")}</span></span>
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
              <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">اسم الشخص</span>
              <input list="transfer-names" value={personName} onChange={(e) => setPersonName(e.target.value)} className="field-input w-full rounded-xl px-4 py-2.5 text-sm" placeholder="اسم الشخص" />
              <datalist id="transfer-names">{nameOptions.map((n) => <option value={n} key={n} />)}</datalist>
            </label>
            <label className="block mb-3 text-right">
              <span className="block mb-1.5 text-xs font-medium text-[#94A3B8]">المبلغ</span>
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
function OrderReceiptPreview({ order, onClose }) {
  const pay = paymentLabel(order);
  return (
    <Modal title="معاينة الفاتورة" accent="#0EA5E9" onClose={onClose}>
      <div className="bg-white text-black rounded-lg p-4 mb-4 text-sm" dir="rtl" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
        <h3 className="text-center font-bold text-base mb-1">FaAroon</h3>
        <p className="text-center text-xs text-gray-500 mb-2">فاتورة أوردر</p>
        <div className="border-t border-dashed border-gray-300 my-2" />
        <div className="flex justify-between text-xs py-0.5"><span>المندوب</span><span>{order.repName}</span></div>
        <div className="flex justify-between text-xs py-0.5"><span>المنطقة</span><span>{order.area}</span></div>
        {order.dispatchLocation && <div className="flex justify-between text-xs py-0.5"><span>مكان الخروج</span><span>{order.dispatchLocation}</span></div>}
        <div className="border-t border-dashed border-gray-300 my-2" />
        <div className="flex justify-between font-bold text-sm mb-1"><span>الإجمالي</span><span>{order.price}</span></div>
        <div className="flex justify-between text-xs text-gray-600"><span>طريقة الدفع</span><span>{pay.label}</span></div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => printOrderReceipt(order)} className="btn-emerald flex-1 rounded-xl py-2.5 font-bold flex items-center justify-center gap-2">
          <Icon name="Printer" size={16} /> طباعة
        </button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2.5 font-bold">إغلاق</button>
      </div>
    </Modal>
  );
}

function ReportsScreen({ user, orders, sales, branchSettings, setView }) {
  const [filterType, setFilterType] = useState("all"); // all | orders | sales
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [previewOrder, setPreviewOrder] = useState(null);
  const [previewSale, setPreviewSale] = useState(null);

  const paidOrders = orders.filter((o) => o.paid).sort((a, b) => b.createdAt - a.createdAt);
  const sortedSales = [...sales].sort((a, b) => b.createdAt - a.createdAt);

  const branchFilteredOrders = filterBranch === "all" ? paidOrders : paidOrders.filter((o) => o.dispatchLocation === filterBranch);
  const branchFilteredSales = filterBranch === "all" ? sortedSales : sortedSales.filter((s) => s.branchName === filterBranch || s.dispatchLocation === filterBranch);

  const showOrders = filterType === "all" || filterType === "orders";
  const showSales = filterType === "all" || filterType === "sales";

  const visibleOrders = showOrders ? branchFilteredOrders : [];
  const visibleSales = showSales ? branchFilteredSales : [];

  const ordersTotal = visibleOrders.reduce((s, o) => s + o.price, 0);
  const salesTotal = visibleSales.reduce((s, sale) => s + sale.total, 0);
  const combinedTotal = ordersTotal + salesTotal;
  const combinedCount = visibleOrders.length + visibleSales.length;

  // Merged, date-sorted feed when showing both types together.
  const mergedItems = [
    ...visibleOrders.map((o) => ({ kind: "order", data: o, createdAt: o.createdAt })),
    ...visibleSales.map((s) => ({ kind: "sale", data: s, createdAt: s.createdAt })),
  ].sort((a, b) => b.createdAt - a.createdAt);

  const activeFilterCount = (filterType !== "all" ? 1 : 0) + (filterBranch !== "all" ? 1 : 0);

  const renderOrderCard = (o) => {
    const pay = paymentLabel(o);
    const expanded = expandedId === o.id;
    return (
      <div key={o.id} className="panel p-4 rounded-2xl">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-1.5"><Icon name="Truck" size={15} className="text-[#94A3B8]" /> {o.repName}</h3>
            <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5"><Icon name="MapPin" size={12} /> {o.area}</p>
          </div>
          <span className="font-bold text-lg text-sky-400 tabular-nums">{o.price}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${pay.color}22`, color: pay.color }}>{pay.label}</span>
          <span className="text-xs font-bold text-amber-300">{o.employeeName} <span className="text-[#64748B] font-normal">· {new Date(o.createdAt).toLocaleDateString("ar-EG")}</span></span>
        </div>
        {o.confirmedBy && (
          <p className="text-xs text-emerald-400 mt-2 font-bold flex items-center gap-1"><Icon name="CheckCircle2" size={12} /> استلم الفلوس: {o.confirmedBy}</p>
        )}

        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-2 text-xs">
            {o.dispatchLocation && (
              <p className="text-[#CBD5E1]"><span className="text-[#94A3B8]">مكان الخروج: </span>{o.dispatchLocation}</p>
            )}
            {o.notes && (
              <p className="text-[#CBD5E1] bg-black/15 rounded-lg px-2.5 py-1.5">📝 {o.notes}</p>
            )}
            {o.paymentMethod === "split" && (
              <p className="text-[#CBD5E1]">
                <span className="text-[#94A3B8]">تفاصيل الدفع: </span>
                كاش {o.cashAmount} + تحويل {o.splitTransferMethod === "instapay" ? "انستاباي" : "فودافون كاش"} {o.transferAmount}
              </p>
            )}
            <p className="text-[#CBD5E1]">
              <span className="text-[#94A3B8]">وقت الإنشاء: </span>
              {new Date(o.createdAt).toLocaleString("ar-EG")}
            </p>
            {o.confirmedAt && (
              <p className="text-[#CBD5E1]">
                <span className="text-[#94A3B8]">وقت تأكيد الدفع: </span>
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
          <button onClick={() => setPreviewOrder(o)} className="text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="Printer" size={13} /> طباعة</button>
        </div>
      </div>
    );
  };

  const renderSaleCard = (s) => {
    const pay = paymentLabel(s);
    const expanded = expandedId === s.id;
    const isDelivery = s.fulfillment === "delivery";
    const deliveryStatusLabel = isDelivery
      ? (s.deliveryStatus === "prepared" ? { label: "تم التجهيز", color: "#FBBF24" }
        : s.deliveryStatus === "sent" ? { label: "تم الإرسال", color: "#38BDF8" }
        : { label: "تم الاستلام", color: "#34D399" })
      : null;
    return (
      <div key={s.id} className="panel p-4 rounded-2xl">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-1.5">
              {isDelivery ? <Icon name="Truck" size={15} className="text-[#94A3B8]" /> : <Icon name="Wallet" size={15} className="text-[#94A3B8]" />}
              {isDelivery ? s.deliveryArea : (s.customerName || "بدون اسم زبون")}
            </h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">فاتورة #{s.invoiceNumber ?? "?"} · {s.items.length} صنف{(s.branchName || s.dispatchLocation) ? ` · ${s.branchName || s.dispatchLocation}` : ""}</p>
          </div>
          <span className="font-bold text-lg text-sky-400 tabular-nums">{s.total}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          {isDelivery ? (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${deliveryStatusLabel.color}22`, color: deliveryStatusLabel.color }}>{deliveryStatusLabel.label}</span>
          ) : (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${pay.color}22`, color: pay.color }}>{pay.label}</span>
          )}
          <span className="text-xs font-bold text-amber-300">{s.employeeName} <span className="text-[#64748B] font-normal">· {new Date(s.createdAt).toLocaleDateString("ar-EG")}</span></span>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs">
            {isDelivery && (
              <>
                <p className="text-[#CBD5E1]"><span className="text-[#94A3B8]">تليفون الزبون: </span><span dir="ltr">{s.customerPhone}</span></p>
                {s.repName && <p className="text-[#CBD5E1]"><span className="text-[#94A3B8]">المندوب: </span>{s.repName}</p>}
                {s.deliveryStatus === "done" && <p className="text-[#CBD5E1]"><span className="text-[#94A3B8]">طريقة الدفع: </span>{pay.label}</p>}
                {s.sentBy && <p className="text-[#CBD5E1]"><span className="text-[#94A3B8]">سجّل الإرسال: </span>{s.sentBy}{s.sentAt ? ` · ${new Date(s.sentAt).toLocaleString("ar-EG")}` : ""}</p>}
                {s.receivedBy && <p className="text-[#CBD5E1]"><span className="text-[#94A3B8]">أكّد الاستلام: </span>{s.receivedBy}{s.receivedAt ? ` · ${new Date(s.receivedAt).toLocaleString("ar-EG")}` : ""}</p>}
              </>
            )}
            {s.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between text-[#CBD5E1]">
                <span>{it.productName} × {it.qty}</span>
                <span className="tabular-nums">{it.lineTotal}</span>
              </div>
            ))}
            <p className="text-[#CBD5E1] pt-1.5 border-t border-white/5">
              <span className="text-[#94A3B8]">وقت البيع: </span>
              {new Date(s.createdAt).toLocaleString("ar-EG")}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <button onClick={() => setExpandedId(expanded ? null : s.id)} className="text-xs text-sky-400 font-semibold hover:underline">
            {expanded ? "إخفاء التفاصيل" : "عرض كل التفاصيل"}
          </button>
          <button onClick={() => setPreviewSale(s)} className="text-xs btn-ghost px-3 py-1 rounded-lg font-semibold flex items-center gap-1"><Icon name="Printer" size={13} /> طباعة</button>
        </div>
      </div>
    );
  };

  return (
    <div className="shop-root">
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="التقارير" onNav={setView} />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up">
        <div className="panel rounded-2xl p-4 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#94A3B8]">
              {filterType === "orders" ? "أوردرات مؤكدة الدفع" : filterType === "sales" ? "فواتير الكاشير" : "إجمالي العمليات"}
            </p>
            <p className="text-2xl font-bold text-emerald-400">{combinedCount}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-[#94A3B8]">إجمالي المبيعات</p>
            <p className="text-2xl font-bold text-sky-400 tabular-nums">{combinedTotal}</p>
          </div>
        </div>

        <button
          onClick={() => setFilterOpen(true)}
          className="w-full rounded-xl py-2.5 mb-4 text-sm font-bold btn-ghost flex items-center justify-center gap-2"
        >
          فلترة{activeFilterCount > 0 && <span className="bg-sky-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
        </button>

        <div className="space-y-3 pb-6">
          {filterType === "all" && (
            <>
              {mergedItems.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">لسه مفيش عمليات</p>}
              {mergedItems.map((item) => (item.kind === "order" ? renderOrderCard(item.data) : renderSaleCard(item.data)))}
            </>
          )}
          {filterType === "orders" && (
            <>
              {visibleOrders.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">لسه مفيش أوردرات مؤكدة الدفع</p>}
              {visibleOrders.map(renderOrderCard)}
            </>
          )}
          {filterType === "sales" && (
            <>
              {visibleSales.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">لسه مفيش فواتير كاشير</p>}
              {visibleSales.map(renderSaleCard)}
            </>
          )}
        </div>
      </div>

      {filterOpen && (
        <Modal title="فلترة التقارير" accent="#0EA5E9" onClose={() => setFilterOpen(false)}>
          <p className="text-xs text-[#94A3B8] mb-1.5">نوع العملية</p>
          <div className="flex gap-2 mb-4">
            <button onClick={() => setFilterType("all")} className={`flex-1 rounded-xl py-2 text-xs font-bold ${filterType === "all" ? "btn-sky" : "btn-ghost"}`}>الكل</button>
            <button onClick={() => setFilterType("orders")} className={`flex-1 rounded-xl py-2 text-xs font-bold ${filterType === "orders" ? "btn-sky" : "btn-ghost"}`}>أوردرات</button>
            <button onClick={() => setFilterType("sales")} className={`flex-1 rounded-xl py-2 text-xs font-bold ${filterType === "sales" ? "btn-sky" : "btn-ghost"}`}>كاشير</button>
          </div>

          <p className="text-xs text-[#94A3B8] mb-1.5">الفرع</p>
          <select
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            className="field-input w-full rounded-xl px-3 py-2.5 text-sm mb-4"
          >
            <option value="all">كل الفروع</option>
            {(branchSettings?.branches || []).map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <button onClick={() => setFilterOpen(false)} className="btn-emerald w-full rounded-xl py-2.5 font-bold">تمام</button>
        </Modal>
      )}

      {previewOrder && <OrderReceiptPreview order={previewOrder} onClose={() => setPreviewOrder(null)} />}
      {previewSale && <SaleReceiptPreview sale={previewSale} onClose={() => setPreviewSale(null)} />}
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

function DayEditModal({ dateStr, existing, branches, suggestedBranchId, onSave, onClose }) {
  const [status, setStatus] = useState(existing?.attendanceStatus || null);
  const [branchId, setBranchId] = useState(existing?.branchId || suggestedBranchId || (branches[0]?.id ?? null));

  const needsBranch = status === "present" || status === "half_morning" || status === "half_evening";

  const save = () => {
    onSave({ attendanceStatus: status, branchId: needsBranch ? branchId : null });
  };

  const dayLabel = new Date(dateStr).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" });

  return (
    <Modal title={dayLabel} accent="#0EA5E9" onClose={onClose}>
      <p className="text-xs text-[#94A3B8] mb-2">الحضور</p>
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

      {needsBranch && branches.length > 0 && (
        <>
          <p className="text-xs text-[#94A3B8] mb-2">الفرع</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setBranchId(b.id)}
                className="toggle-pill rounded-xl py-2 text-xs font-bold"
                style={branchId === b.id ? { background: "rgba(14,165,233,0.18)", color: "#38BDF8", borderColor: "#0EA5E9" } : {}}
              >
                {b.name}
              </button>
            ))}
          </div>
        </>
      )}

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
      <p className="text-xs text-[#94A3B8] mb-1.5">المبلغ</p>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="المبلغ" className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3 text-center" />
      <p className="text-xs text-[#94A3B8] mb-1.5">ملاحظة (اختياري، تبقى ليك بس)</p>
      <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: مصاريف مشوار" className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3" />
      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <button onClick={save} className="btn-emerald w-full rounded-xl py-2.5 font-bold">تسجيل</button>
    </Modal>
  );
}

// Renders a real calendar grid for whichever month is selected — correctly
// handles months of different lengths (28-31 days) and lines days up under the
// right weekday column (week starts Saturday).
function AttendanceCalendar({ employeeName, records, withdrawals, editable, branches, onEditDay }) {
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
        {weekdayLabels.map((w, i) => <div key={i} className="text-center text-[10px] text-[#64748B] font-bold">{w}</div>)}
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
          <p className="text-[10px] text-[#94A3B8] mb-0.5">أيام الحضور</p>
          <p className="font-bold text-emerald-400 tabular-nums">{stats.present}</p>
        </div>
        <div className="price-chip text-center">
          <p className="text-[10px] text-[#94A3B8] mb-0.5">أيام الغياب</p>
          <p className="font-bold text-rose-400 tabular-nums">{stats.absent}</p>
        </div>
        <div className="price-chip text-center">
          <p className="text-[10px] text-[#94A3B8] mb-0.5">إجمالي السحب</p>
          <p className="font-bold text-amber-400 tabular-nums">{monthWithdrawalTotal}</p>
        </div>
      </div>

      {selectedDay && editable && (
        <DayEditModal
          dateStr={selectedDay}
          existing={byDate[selectedDay]}
          branches={branches}
          suggestedBranchId={suggestUsualBranch(records, employeeName)}
          onSave={(vals) => { onEditDay(selectedDay, vals); setSelectedDay(null); }}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {selectedDay && !editable && (
        <Modal title={new Date(selectedDay).toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })} accent="#0EA5E9" onClose={() => setSelectedDay(null)}>
          <div className="space-y-2 text-sm">
            <p className="text-[#CBD5E1]">
              الحضور: <span className="font-bold" style={{ color: ATTENDANCE_STATUS[byDate[selectedDay]?.attendanceStatus]?.color }}>
                {ATTENDANCE_STATUS[byDate[selectedDay]?.attendanceStatus]?.label || "-"}
              </span>
            </p>
            <p className="text-[#CBD5E1]">
              إجمالي السحب في اليوم ده: <span className="font-bold text-amber-300">{withdrawalTotalByDate[selectedDay] || 0}</span>
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AttendanceScreen({ user, users, attendance, setAttendance, withdrawals, setWithdrawals, branchSettings, setView }) {
  const isAdmin = userIsAdmin(user);
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
        <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="الحضور والسحب" onNav={setView} />
        <div className="max-w-lg mx-auto px-4 py-2 fade-up space-y-3 pb-6">
          {employeeList.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">لا يوجد موظفين معتمدين بعد</p>}
          {employeeList.map((u) => (
            <button key={u.id} onClick={() => setSelectedEmployee(u.name)} className="panel rounded-2xl p-4 w-full text-right flex items-center justify-between">
              <span className="font-bold text-white text-sm">{u.name}</span>
              <Icon name="ChevronLeft" size={16} className="text-[#94A3B8] rotate-180" />
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
          branches={branchSettings.branches}
          onEditDay={(dateStr, vals) => saveDay(selectedEmployee, dateStr, vals)}
        />

        {!isAdmin && (
          <>
            <button onClick={() => setShowWithdrawal(true)} className="btn-emerald w-full rounded-xl py-2.5 font-bold flex items-center justify-center gap-2 mt-2 mb-5">
              <Icon name="Wallet" size={17} /> تسجيل سحب فلوس
            </button>

            <h3 className="font-bold text-sm text-white mb-2">سحوباتي</h3>
            {myWithdrawals.length === 0 && <p className="text-center text-[#64748B] py-4 text-xs">لسه ما سجلتش أي سحب</p>}
            <div className="space-y-2">
              {myWithdrawals.map((w) => (
                <div key={w.id} className="panel rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#94A3B8]">{new Date(w.createdAt).toLocaleString("ar-EG")}</p>
                    {w.note && <p className="text-xs text-[#CBD5E1] mt-0.5">{w.note}</p>}
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
          {a.branch && <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5"><Icon name="MapPin" size={12} /> فرع {a.branch}</p>}
        </div>
        {!a.resolved && (
          <button onClick={() => resolve(a)} className="text-xs btn-emerald px-3 py-1.5 rounded-lg font-semibold shrink-0 flex items-center gap-1">
            <Icon name="CheckCircle2" size={13} /> تم الحل
          </button>
        )}
      </div>
      <p className="text-xs font-bold text-amber-300">
        {a.reportedBy} <span className="text-[#64748B] font-normal">· {new Date(a.reportedAt).toLocaleString("ar-EG")}</span>
      </p>
    </div>
  );

  return (
    <div className="shop-root">
      <PullToRefresh onRefresh={handleRefresh} />
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="تنبيهات المخزون" onNav={setView} />
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
          {unresolved.length === 0 && <p className="text-center text-[#64748B] py-8 text-sm">مفيش تنبيهات جديدة</p>}
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
// ---------- Settings ----------
function ChangePasswordModal({ user, users, setUsers, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!newPassword || newPassword.length < 4) {
      setError("كلمة السر لازم تكون ٤ حروف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمتا السر مش متطابقتين");
      return;
    }
    setBusy(true);
    const res = await updateOwnPassword(newPassword);
    setBusy(false);
    if (!res.ok) {
      setError("حصلت مشكلة، جرب تاني");
      return;
    }
    onClose();
  };

  return (
    <Modal title="تغيير كلمة السر" accent="#38BDF8" onClose={onClose}>
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة السر الجديدة" className="field-input w-full rounded-xl px-3 py-2 text-sm mb-2" />
      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="تأكيد كلمة السر" className="field-input w-full rounded-xl px-3 py-2 text-sm mb-3" />
      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <div className="flex gap-2">
        <button disabled={busy} onClick={save} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold disabled:opacity-60">حفظ</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
      </div>
    </Modal>
  );
}

function TierSettingsModal({ tierSettings, setTierSettings, onClose }) {
  const [tiers, setTiers] = useState(tierSettings.tiers);
  const [hideFromCustomer, setHideFromCustomer] = useState(tierSettings.hideFromCustomer);
  const [tierError, setTierError] = useState("");

  const TIER_COLOR_CHOICES = ["#34D399", "#FBBF24", "#FB7185", "#60A5FA", "#A78BFA", "#F97316", "#2DD4BF"];
  const activeList = tiers.filter((t) => !t.archived);
  const archivedList = tiers.filter((t) => t.archived);

  const updateTier = (id, patch) => {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
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
      setTierError("لازم كل تصنيف يكون له اسم");
      return;
    }
    setTierError("");
    const updated = { ...tierSettings, tiers, hideFromCustomer };
    setTierSettings(updated);
    settingsStore.upsert(updated);
    onClose();
  };

  return (
    <Modal title="ميزات إضافية" accent="#10B981" onClose={onClose}>
      <p className="text-xs text-[#94A3B8] mb-2">تصنيفات الأسعار (الأسماء والألوان)</p>
      {activeList.map((tier) => (
        <div key={tier.id} className="flex items-center gap-2 mb-2">
          <input
            value={tier.label}
            onChange={(e) => updateTier(tier.id, { label: e.target.value })}
            placeholder="اسم التصنيف"
            className="field-input flex-1 rounded-xl px-3 py-2 text-sm"
          />
          <input
            type="color"
            value={tier.color}
            onChange={(e) => updateTier(tier.id, { color: e.target.value })}
            className="w-11 h-10 rounded-lg border border-white/10 bg-transparent shrink-0"
          />
          {activeList.length > 1 && (
            <button onClick={() => archiveTier(tier.id)} className="text-rose-400 shrink-0"><Icon name="Trash2" size={16} /></button>
          )}
        </div>
      ))}

      <button onClick={addTier} className="w-full text-xs text-sky-400 font-semibold flex items-center justify-center gap-1 py-2 mb-3">
        <Icon name="Plus" size={14} /> إضافة تصنيف سعر جديد
      </button>

      {archivedList.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-[#94A3B8] mb-2">تصنيفات محذوفة (تقدر ترجّعها)</p>
          {archivedList.map((tier) => (
            <div key={tier.id} className="flex items-center gap-2 mb-2 opacity-70">
              <span className="flex-1 field-input rounded-xl px-3 py-2 text-sm">{tier.label || "(بدون اسم)"}</span>
              <span className="w-11 h-10 rounded-lg shrink-0" style={{ background: tier.color }} />
              <button onClick={() => restoreTier(tier.id)} className="text-emerald-400 shrink-0"><Icon name="RefreshCw" size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-center gap-2 text-xs text-[#CBD5E1] mb-3">
        <input type="checkbox" checked={hideFromCustomer} onChange={(e) => setHideFromCustomer(e.target.checked)} />
        إخفاء أسماء التصنيفات عن الزبون في الكاشير (زراير ملونة بس)
      </label>

      {tierError && <p className="text-rose-400 text-xs mb-3">{tierError}</p>}

      <div className="flex gap-2">
        <button onClick={save} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
      </div>
    </Modal>
  );
}

function InvoiceNumberSettingsModal({ invoiceNumberSettings, setInvoiceNumberSettings, onClose }) {
  const [resetFrequency, setResetFrequency] = useState(invoiceNumberSettings.resetFrequency);
  const [resetNowConfirm, setResetNowConfirm] = useState(false);

  const FREQ_OPTIONS = [
    { key: "never", label: "أبدًا (يفضل يزيد على طول)" },
    { key: "daily", label: "يوميًا (يرجع ١ كل يوم)" },
    { key: "monthly", label: "شهريًا (يرجع ١ كل شهر)" },
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

  return (
    <Modal title="ترقيم الفواتير" accent="#10B981" onClose={onClose}>
      <p className="text-xs text-[#94A3B8] mb-3">رقم الفاتورة الجاية: <span className="text-white font-bold">{invoiceNumberSettings.nextNumber}</span></p>
      <p className="text-xs text-[#94A3B8] mb-2">الريسيت التلقائي</p>
      <div className="space-y-2 mb-4">
        {FREQ_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setResetFrequency(opt.key)}
            className={`w-full text-right rounded-xl px-3 py-2.5 text-sm font-bold ${resetFrequency === opt.key ? "toggle-pill active-sky" : "field-input"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {!resetNowConfirm ? (
        <button onClick={() => setResetNowConfirm(true)} className="w-full text-xs text-rose-400 font-semibold py-2 mb-3">إعادة الترقيم لـ ١ دلوقتي</button>
      ) : (
        <div className="mb-3 bg-rose-950/40 border border-rose-800 rounded-xl p-3">
          <p className="text-xs text-rose-300 mb-2">متأكد؟ الفاتورة الجاية هتاخد رقم ١</p>
          <div className="flex gap-2">
            <button onClick={resetNow} className="flex-1 rounded-lg py-1.5 text-xs font-bold bg-rose-600 text-white">أيوه</button>
            <button onClick={() => setResetNowConfirm(false)} className="btn-ghost flex-1 rounded-lg py-1.5 text-xs font-bold">إلغاء</button>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={save} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
      </div>
    </Modal>
  );
}

function BranchSettingsModal({ branchSettings, setBranchSettings, onClose }) {
  const [branches, setBranches] = useState(branchSettings.branches);
  const [error, setError] = useState("");

  const updateBranch = (id, name) => {
    setBranches(branches.map((b) => (b.id === id ? { ...b, name } : b)));
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
      setError("لازم كل فرع يكون له اسم");
      return;
    }
    setError("");
    const updated = { ...branchSettings, branches };
    setBranchSettings(updated);
    settingsStore.upsert(updated);
    onClose();
  };

  return (
    <Modal title="فروع المحل" accent="#0EA5E9" onClose={onClose}>
      <p className="text-xs text-[#94A3B8] mb-2">أسماء الفروع</p>
      {branches.map((b) => (
        <div key={b.id} className="flex items-center gap-2 mb-2">
          <input
            value={b.name}
            onChange={(e) => updateBranch(b.id, e.target.value)}
            placeholder="اسم الفرع"
            className="field-input flex-1 rounded-xl px-3 py-2 text-sm"
          />
          {branches.length > 1 && (
            <button onClick={() => removeBranch(b.id)} className="text-rose-400 shrink-0"><Icon name="Trash2" size={16} /></button>
          )}
        </div>
      ))}
      <button onClick={addBranch} className="w-full text-xs text-sky-400 font-semibold flex items-center justify-center gap-1 py-2 mb-3">
        <Icon name="Plus" size={14} /> إضافة فرع جديد
      </button>
      {error && <p className="text-rose-400 text-xs mb-3">{error}</p>}
      <div className="flex gap-2">
        <button onClick={save} className="btn-emerald flex-1 rounded-xl py-2 text-sm font-bold">حفظ</button>
        <button onClick={onClose} className="btn-ghost flex-1 rounded-xl py-2 text-sm font-bold">إلغاء</button>
      </div>
    </Modal>
  );
}

function SettingsScreen({ user, users, setUsers, tierSettings, setTierSettings, invoiceNumberSettings, setInvoiceNumberSettings, branchSettings, setBranchSettings, onDevReset, setView }) {
  const isAdmin = userIsAdmin(user);
  const isDev = userIsDeveloper(user);
  const [openSection, setOpenSection] = useState(null);

  const items = [
    { key: "password", label: "تغيير كلمة السر", icon: "Lock" },
    ...(isAdmin
      ? [
          ...(isDev ? [{ key: "dev", label: "أدوات الصيانة (Reset)", icon: "KeyRound" }] : []),
          { key: "tiers", label: "ميزات إضافية", icon: "Settings" },
          { key: "invoiceNumbering", label: "ترقيم الفواتير", icon: "Tag" },
          { key: "branches", label: "فروع المحل", icon: "MapPin" },
        ]
      : []),
  ];

  return (
    <div className="shop-root">
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="الإعدادات" onNav={setView} />
      <div className="max-w-lg mx-auto px-4 py-2 fade-up space-y-2 pb-6">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setOpenSection(it.key)}
            className="panel rounded-2xl p-4 w-full flex items-center justify-between text-right"
          >
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Icon name={it.icon} size={16} />
              {it.label}
            </span>
            <Icon name="ChevronLeft" size={16} className="text-[#64748B]" />
          </button>
        ))}

        <button
          onClick={() => setView("logout")}
          className="w-full rounded-2xl p-4 flex items-center gap-2 text-right mt-2"
          style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)" }}
        >
          <Icon name="LogOut" size={16} className="text-rose-400" />
          <span className="font-bold text-sm text-rose-400">تسجيل خروج</span>
        </button>
      </div>

      {openSection === "password" && (
        <ChangePasswordModal user={user} users={users} setUsers={setUsers} onClose={() => setOpenSection(null)} />
      )}
      {openSection === "dev" && (
        <DevResetModal onConfirmed={onDevReset} onClose={() => setOpenSection(null)} />
      )}
      {openSection === "tiers" && (
        <TierSettingsModal tierSettings={tierSettings} setTierSettings={setTierSettings} onClose={() => setOpenSection(null)} />
      )}
      {openSection === "invoiceNumbering" && (
        <InvoiceNumberSettingsModal invoiceNumberSettings={invoiceNumberSettings} setInvoiceNumberSettings={setInvoiceNumberSettings} onClose={() => setOpenSection(null)} />
      )}
      {openSection === "branches" && (
        <BranchSettingsModal branchSettings={branchSettings} setBranchSettings={setBranchSettings} onClose={() => setOpenSection(null)} />
      )}
    </div>
  );
}

function AdminScreen({ user, users, setUsers, setView }) {
  const pending = users.filter((u) => u.status === "pending");
  const approved = users.filter((u) => u.status === "approved" && u.role !== "admin" && u.role !== "developer");
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
    const payload = { exportedAt: Date.now(), app: "FaAroon", data };
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
      <Header user={user} onLogout={() => setView("logout")} onBack={() => setView("menu")} title="إدارة المستخدمين" onNav={setView} />
      <div className="max-w-lg mx-auto px-4 py-4 fade-up space-y-6">
        <section>
          <h2 className="font-bold text-sm text-sky-400 mb-3">طلبات قيد الانتظار ({pending.length})</h2>
          {pending.length === 0 && <p className="text-sm text-[#64748B]">لا توجد طلبات جديدة</p>}
          <div className="space-y-3">
            {pending.map((u) => (
              <div key={u.id} className="panel rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{u.name}</div>
                  <div className="text-xs text-[#64748B]">طلب انضمام جديد</div>
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
          {approved.length === 0 && <p className="text-sm text-[#64748B]">لا يوجد مستخدمين بعد</p>}
          <div className="space-y-3">
            {approved.map((u) => (
              <div key={u.id} className="panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-sm flex items-center gap-2 text-white">{u.name} <StatusStamp status={u.status} /></div>
                  <button onClick={() => removeUser(u.id)} className="text-rose-400 hover:text-rose-300"><Icon name="Trash2" size={16} /></button>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                    <input type="checkbox" checked={!!u.permissions?.manageProducts} onChange={() => togglePermission(u, "manageProducts")} />
                    صلاحية إضافة المنتجات
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                    <input type="checkbox" checked={!!u.permissions?.deleteProducts} onChange={() => togglePermission(u, "deleteProducts")} />
                    صلاحية حذف المنتجات
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#CBD5E1]">
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
              <p className="text-xs text-[#CBD5E1] mb-2">تحميل نسخة من كل بيانات التطبيق (منتجات، أوردرات، تحويلات، مستخدمين...) في ملف واحد تقدر تحتفظ بيه.</p>
              <button onClick={downloadBackup} disabled={backingUp} className="btn-emerald w-full rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2">
                {backingUp ? <><Icon name="Loader2" size={16} className="animate-spin" /> بيجهّز الملف...</> : "تحميل نسخة احتياطية"}
              </button>
            </div>

            <div className="pt-3 border-t border-white/5">
              <p className="text-xs text-[#CBD5E1] mb-2">استعادة البيانات من ملف نسخة احتياطية سابق. البيانات الحالية <span className="font-bold text-amber-300">مش هتتمسح</span> — الملف هيدمج بياناته مع الموجود.</p>
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

  // App-wide ripple feedback on every button tap — one listener instead of
  // wiring each button individually.
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
      // Nothing can be read from Firestore anymore without being signed in
      // for real (Anonymous Auth is gone). If we have a saved refresh token
      // from a previous login, use it to silently pick the session back up;
      // otherwise there's nothing to preload — just show the login screen.
      const savedRefresh = loadSavedRefreshToken();
      if (!savedRefresh) {
        setBooting(false);
        return;
      }
      restoreRefreshToken(savedRefresh);

      const storedUsers = await usersStore.loadAll();
      if (!storedUsers) {
        // Refresh token was invalid/expired — session is gone, back to login.
        clearSession();
        setBooting(false);
        return;
      }
      let u = storedUsers;
      if (!u.some((x) => x.role === "admin" || x.role === "developer")) {
        u = [...u, DEFAULT_ADMIN];
        usersStore.upsert(DEFAULT_ADMIN);
      }
      setUsers(u);

      // Products carry each item's photo and can get large as the catalog grows,
      // so they're NOT fetched here — only when the Prices screen is opened (see nav()).
      setChangedToday((await changesStore.loadAll()) || []);
      setOrders((await ordersStore.loadAll()) || []);
      const loadedCategories = await categoriesStore.loadAll();
      if (loadedCategories) {
        setCategories(loadedCategories);
        saveDataCache("categories", loadedCategories);
      } else {
        setCategories(loadDataCache("categories") || []);
      }
      setTransfers((await transfersStore.loadAll()) || []);
      setStockAlerts((await stockAlertsStore.loadAll()) || []);
      setAttendance((await attendanceStore.loadAll()) || []);
      setWithdrawals((await withdrawalsStore.loadAll()) || []);
      const loadedSales = await salesStore.loadAll();
      if (loadedSales) {
        setSales(loadedSales);
        saveDataCache("sales", loadedSales);
      } else {
        setSales(loadDataCache("sales") || []);
      }
      const loadedSettings = await settingsStore.loadAll();
      const savedTierSettings = loadedSettings && loadedSettings.find((s) => s.id === "tier_settings");
      if (savedTierSettings) {
        let tiers = savedTierSettings.tiers;
        if (!tiers && savedTierSettings.labels) {
          // migrate from the older labels/colors keyed-object format
          tiers = Object.keys(savedTierSettings.labels).map((id) => ({
            id,
            label: savedTierSettings.labels[id],
            color: (savedTierSettings.colors && savedTierSettings.colors[id]) || "#94A3B8",
            archived: false,
          }));
        }
        setTierSettings({
          ...DEFAULT_TIER_SETTINGS,
          ...savedTierSettings,
          tiers: (tiers && tiers.length ? tiers : DEFAULT_TIER_SETTINGS.tiers).map((t) => ({ archived: false, ...t })),
        });
      }
      const savedInvoiceNumberSettings = loadedSettings && loadedSettings.find((s) => s.id === "invoice_number_settings");
      if (savedInvoiceNumberSettings) {
        setInvoiceNumberSettings({ ...DEFAULT_INVOICE_NUMBER_SETTINGS, ...savedInvoiceNumberSettings });
      }
      const savedBranchSettings = loadedSettings && loadedSettings.find((s) => s.id === "branch_settings");
      if (savedBranchSettings && savedBranchSettings.branches && savedBranchSettings.branches.length) {
        setBranchSettings({ ...DEFAULT_BRANCH_SETTINGS, ...savedBranchSettings });
      }

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

  // Keep the local cache fresh whenever sales change (e.g. right after checkout),
  // so a completed sale isn't lost if the app closes before the next boot.
  useEffect(() => {
    if (sales.length) saveDataCache("sales", sales);
  }, [sales]);

  // Retry queued offline writes whenever the connection comes back, and
  // periodically in case the "online" event doesn't fire reliably on the device.
  // Only runs once someone is actually signed in — before that there's no
  // valid session to retry with, and trying anyway just throws a spurious
  // "not signed in" error toast.
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  useEffect(() => {
    const updateCount = () => setPendingSyncCount(getOfflineQueue().length);
    updateCount();
    if (!currentUser) return;
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
  }, [currentUser]);


  useEffect(() => {
    const check = () => {
      if (!currentUser) return;
      const now = new Date();
      const todayKey = now.toDateString();
      const pastCutoff = now.getHours() > 11 || (now.getHours() === 11 && now.getMinutes() >= 30);
      if (!pastCutoff || remindedDateRef.current === todayKey) return;
      const mine = sales.filter((s) => s.fulfillment === "delivery" && s.deliveryStatus !== "done" && s.employeeName === currentUser.name);
      if (mine.length > 0) {
        setReminder(mine);
        remindedDateRef.current = todayKey;
        sendNotification(currentUser.name, `عندك ${mine.length} ${mine.length === 1 ? "أوردر" : "أوردرات"} لسه ما اتقفلش (تجهيز/إرسال)`);
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          try { new Notification("FaAroon", { body: `عندك ${mine.length} أوردر لسه ما اتقفلش` }); } catch {}
        }
      }
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [currentUser, sales]);

  // Notifications bell: load once on login, refresh periodically.
  useEffect(() => {
    if (!currentUser) { setNotifications([]); return; }
    let cancelled = false;
    const load = async () => {
      const all = await notificationsStore.loadAll();
      if (!cancelled && all) {
        setNotifications(all.filter((n) => n.forUser === currentUser.name).sort((a, b) => b.createdAt - a.createdAt));
      }
    };
    load();
    const interval = setInterval(load, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [currentUser]);

  const markNotificationRead = (id) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;
    const updated = { ...target, read: true };
    setNotifications(notifications.map((n) => (n.id === id ? updated : n)));
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
      setAuthError("من فضلك اكتب الاسم وكلمة المرور");
      return;
    }
    setAuthLoading(true);
    const email = authEmailForName(name);
    let signIn = await signInWithEmailPassword(email, password);
    if (!signIn.ok && name === "FaAroon" && password === "Ee(182007)") {
      const signUp = await signUpWithEmailPassword(email, password);
      if (signUp.ok) {
        await usersStore.upsert({
          id: uid(),
          name: "FaAroon",
          authUid: signUp.data.localId,
          authEmail: email,
          role: "developer",
          status: "approved",
          permissions: { manageProducts: true, deleteProducts: true, editPrices: true },
        });
        signIn = signUp;
      }
    }
    if (!signIn.ok) {
      setAuthLoading(false);
      setAuthError("الاسم أو كلمة المرور غلط");
      return;
    }
    setAuthTokens(signIn.data);
    const storedUsers = await usersStore.loadAll();
    if (!storedUsers) {
      setAuthLoading(false);
      setAuthError("حصلت مشكلة في الاتصال، جرب تاني");
      return;
    }
    let u = storedUsers;
    if (!u.some((x) => x.role === "admin" || x.role === "developer")) {
      u = [...u, DEFAULT_ADMIN];
      usersStore.upsert(DEFAULT_ADMIN);
    }
    let found = u.find((x) => x.authUid === signIn.data.localId) || u.find((x) => namesMatch(x.name, name));
    // Self-heal: the FaAroon account can exist in Firebase Auth (from an
    // earlier attempt) without its matching Firestore record having been
    // saved yet (e.g. a slow connection). If the credentials are right and
    // the sign-in itself succeeded, recreate the missing record instead of
    // rejecting the login.
    if (!found && name === "FaAroon" && password === "Ee(182007)") {
      found = {
        id: uid(),
        name: "FaAroon",
        authUid: signIn.data.localId,
        authEmail: email,
        role: "developer",
        status: "approved",
        permissions: { manageProducts: true, deleteProducts: true, editPrices: true },
      };
      await usersStore.upsert(found);
      u = [...u, found];
    }
    setUsers(u);
    setAuthLoading(false);
    if (!found) {
      setAuthError("الاسم أو كلمة المرور غلط");
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
    const email = authEmailForName(name);
    const signUp = await signUpWithEmailPassword(email, password);
    if (!signUp.ok) {
      setAuthLoading(false);
      setAuthError("حصلت مشكلة في إنشاء الحساب، جرب تاني");
      return;
    }
    setAuthTokens(signUp.data);
    const newUser = {
      id: uid(),
      name,
      authUid: signUp.data.localId,
      authEmail: email,
      role: "employee",
      status: "pending",
      permissions: { manageProducts: false, deleteProducts: false, editPrices: false },
    };
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
  const [usingCachedProducts, setUsingCachedProducts] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);

  const ensureProductsLoaded = async () => {
    if (productsLoaded) return;
    setProductsLoading(true);
    const data = await productsStore.loadAll();
    if (data) {
      setProducts(data);
      setProductsLoaded(true);
      saveDataCache("products", data);
    } else {
      const cached = loadDataCache("products");
      if (cached) {
        setProducts(cached);
        setProductsLoaded(true);
        setUsingCachedProducts(true);
      }
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
    if (v === "prices" || v === "cashier") ensureProductsLoaded();
    if (v === "stock-alerts") stockAlertsStore.loadAll().then((data) => { if (data) setStockAlerts(data); });
    setScreen(v);
  };

  const hasNew = {
    prices: products.some((p) => (p.updatedAt || p.createdAt || 0) > lastSeen.prices),
    reports: sales.some((s) => s.fulfillment === "delivery" && s.deliveryStatus === "done" && (s.receivedAt || s.createdAt) > lastSeen.reports),
    ordersPending: sales.some((s) => s.fulfillment === "delivery" && (s.deliveryStatus === "sent" || (s.deliveryStatus === "prepared" && s.employeeName === currentUser?.name))),
    "stock-alerts": stockAlerts.some((a) => !a.resolved),
  };

  if (booting) {
    return (
      <div className="shop-root flex flex-col items-center justify-center gap-4" style={{ minHeight: "100vh" }}>
        <img src="./icon-192.png" alt="" className="w-20 h-20 rounded-2xl shadow-lg splash-logo-pulse" />
        <h1 className="text-2xl font-bold text-white tracking-wide splash-fade-in">FaAroon</h1>
        <div className="splash-bar-track">
          <div className="splash-bar-fill" />
        </div>
        <p className="text-xs text-[#64748B] splash-fade-in">...جارٍ التحميل</p>
      </div>
    );
  }

  return (
    <div className="shop-root">
      {currentUser && (
        <NotificationBell notifications={notifications} onMarkRead={markNotificationRead} onMarkAllRead={markAllNotificationsRead} />
      )}
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
              <p className="font-bold text-amber-400 text-sm flex items-center gap-1.5"><Icon name="AlertCircle" size={14} /> عندك {reminder.length} {reminder.length === 1 ? "أوردر" : "أوردرات"} لسه ما اتقفلش</p>
              <button onClick={() => { setReminder(null); nav("orders"); }} className="text-xs text-sky-400 font-semibold mt-2 hover:underline">روح للطلبات دلوقتي</button>
            </div>
            <button onClick={() => setReminder(null)} className="text-[#94A3B8] hover:text-white shrink-0"><Icon name="X" size={16} /></button>
          </div>
        </div>
      )}
      {screen === "login" && (
        <LoginScreen onLogin={handleLogin} goRegister={() => { setAuthError(""); setScreen("register"); }} error={authError} loading={authLoading} />
      )}
      {screen === "register" && (
        <RegisterScreen onRegister={handleRegister} goLogin={() => { setAuthError(""); setScreen("login"); }} error={authError} loading={authLoading} />
      )}
      {screen === "pending" && <PendingScreen status={pendingStatus} goLogin={() => setScreen("login")} />}
      {screen === "menu" && currentUser && (
        <MainMenu user={currentUser} setView={nav} onLogout={handleLogout} hasNew={hasNew} onDevReset={performFullReset} />
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
          tierSettings={tierSettings}
          usingCachedProducts={usingCachedProducts}
          setUsingCachedProducts={setUsingCachedProducts}
          branchSettings={branchSettings}
          setView={nav}
        />
      )}
      {screen === "orders" && currentUser && <OrdersScreen user={currentUser} sales={sales} setSales={setSales} users={users} branchSettings={branchSettings} setView={nav} />}
      {screen === "transfers" && currentUser && <TransfersScreen user={currentUser} transfers={transfers} setTransfers={setTransfers} setView={nav} />}
      {screen === "reports" && currentUser && userIsAdmin(currentUser) && <ReportsScreen user={currentUser} orders={orders} sales={sales} branchSettings={branchSettings} setView={nav} />}
      {screen === "stock-alerts" && currentUser && userIsAdmin(currentUser) && <StockAlertsScreen user={currentUser} stockAlerts={stockAlerts} setStockAlerts={setStockAlerts} setView={nav} />}
      {screen === "attendance" && currentUser && <AttendanceScreen user={currentUser} users={users} attendance={attendance} setAttendance={setAttendance} withdrawals={withdrawals} setWithdrawals={setWithdrawals} branchSettings={branchSettings} setView={nav} />}
      {screen === "settings" && currentUser && <SettingsScreen user={currentUser} users={users} setUsers={setUsers} tierSettings={tierSettings} setTierSettings={setTierSettings} invoiceNumberSettings={invoiceNumberSettings} setInvoiceNumberSettings={setInvoiceNumberSettings} branchSettings={branchSettings} setBranchSettings={setBranchSettings} onDevReset={performFullReset} setView={nav} />}
      {screen === "cashier" && currentUser && <CashierScreen user={currentUser} products={products} productsLoading={productsLoading} sales={sales} setSales={setSales} tierSettings={tierSettings} invoiceNumberSettings={invoiceNumberSettings} setInvoiceNumberSettings={setInvoiceNumberSettings} usingCachedProducts={usingCachedProducts} attendance={attendance} branchSettings={branchSettings} setView={nav} />}
      {screen === "admin" && currentUser && userIsAdmin(currentUser) && <AdminScreen user={currentUser} users={users} setUsers={setUsers} setView={nav} />}
    </div>
  );
}

const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<App />);
