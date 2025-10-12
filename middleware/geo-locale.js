// middleware/geo-locale.js
export default function ({ req }) {
  // Keep as SSR guard to ensure i18n initializes early.
  // All redirect logic is in server-middleware to avoid client-side loops.
  if (!req) return;
}
