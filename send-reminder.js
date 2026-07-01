/* Sends the daily reminder push to every stored subscription.
   Run by .github/workflows/daily-reminder.yml on a cron. Needs env:
   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT, PUSH_SUBSCRIPTIONS.

   PUSH_SUBSCRIPTIONS is a JSON array whose items are EITHER a base64 "reminder
   code" (what the app shows) OR a raw subscription object. Both are accepted. */
const webpush = require("web-push");

const pub = process.env.VAPID_PUBLIC_KEY, priv = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || "mailto:example@example.com";
if (!pub || !priv) { console.error("Missing VAPID keys"); process.exit(1); }
webpush.setVapidDetails(subject, pub, priv);

let subs = [];
try { subs = JSON.parse(process.env.PUSH_SUBSCRIPTIONS || "[]"); }
catch (e) { console.error("PUSH_SUBSCRIPTIONS is not valid JSON"); process.exit(0); }
if (!Array.isArray(subs)) subs = [subs];

function decode(item) {
  if (item && typeof item === "object") return item;         // already a subscription
  if (typeof item === "string") {
    try { return JSON.parse(Buffer.from(item, "base64").toString("utf8")); } // base64 code
    catch (_) { try { return JSON.parse(item); } catch (__) { return null; } }
  }
  return null;
}

// rotating Czech messages (no live streak number — that's in-app only)
const messages = [
  { title: "Čeština 🇨🇿", body: "Čas na dnešní lekci! Nezapomeň na svůj streak. 🔥" },
  { title: "Ahoj Natasho! 👋", body: "Pár minut češtiny dnes? Tvůj streak na tebe čeká. 🔥" },
  { title: "Natasha's Czech Quest", body: "Otevři appku a nauč se pár nových slovíček. 📖" },
  { title: "Ježek ti mává 🦔", body: "Pojď si dnes procvičit slovíčka — udrž si streak! 🔥" }
];
const msg = messages[new Date().getUTCDate() % messages.length];
const payload = JSON.stringify({ ...msg, url: "./index.html" });

(async () => {
  let ok = 0, fail = 0;
  for (const raw of subs) {
    const s = decode(raw);
    if (!s || !s.endpoint) { fail++; continue; }
    try { await webpush.sendNotification(s, payload); ok++; }
    catch (e) { fail++; console.error("send failed:", e.statusCode || e.message); }
  }
  console.log(`Reminder sent — ok=${ok} fail=${fail} total=${subs.length}`);
})();
