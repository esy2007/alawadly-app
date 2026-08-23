const CACHE_NAME = "alawadly-v202608232143";
const CORE_ASSETS = ["./index.html", "./style.css?v=202608190923", "./app.js?v=202608232143", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Network-first for everything (Firestore calls, CDN scripts, app files) so data
// always stays live; falls back to the cached shell only if totally offline.
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ---------- Periodic background check (best-effort, no server) ----------
// Chrome decides when this actually runs — could be every few hours or much
// less often, depending on the device and how much the site is used. This is
// NOT the same as a real push notification service; it's the closest thing
// achievable without a paid backend.
const FIREBASE_PROJECT_ID = "alawadly-53e7d";
const FIREBASE_API_KEY = "AIzaSyAp8Hbi1AmSovP3lxZ6PkMI2C2KgYdSEEo";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

async function getAnonAuthToken() {
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ returnSecureToken: true }),
  });
  if (!res.ok) throw new Error("auth failed");
  const data = await res.json();
  return data.idToken;
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

async function fetchAllDocs(collectionName, token) {
  let documents = [];
  let pageToken = null;
  do {
    const url = new URL(`${FIRESTORE_BASE}/${collectionName}`);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return documents;
    const data = await res.json();
    documents = documents.concat((data.documents || []).map((d) => fromFirestoreFields(d.fields)));
    pageToken = data.nextPageToken || null;
  } while (pageToken);
  return documents;
}

async function checkAndNotify() {
  try {
    const token = await getAnonAuthToken();
    const [orders, alerts] = await Promise.all([
      fetchAllDocs("orders_col", token),
      fetchAllDocs("stock_alerts_col", token),
    ]);
    const unpaidCount = orders.filter((o) => !o.paid).length;
    const unresolvedCount = alerts.filter((a) => !a.resolved).length;
    if (unpaidCount > 0 || unresolvedCount > 0) {
      const parts = [];
      if (unpaidCount > 0) parts.push(`${unpaidCount} أوردر غير مدفوع`);
      if (unresolvedCount > 0) parts.push(`${unresolvedCount} تنبيه مخزون`);
      await self.registration.showNotification("العوادلي", {
        body: `عندك ${parts.join(" و ")}`,
        icon: "icon-192.png",
        badge: "icon-192.png",
        tag: "alawadly-periodic-check",
      });
    }
  } catch (e) {
    console.error("periodic background check failed", e);
  }
}

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-alawadly-alerts") {
    event.waitUntil(checkAndNotify());
  }
});
