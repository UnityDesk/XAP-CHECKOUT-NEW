// middleware/geo-locale.js
// This middleware is now disabled - Cloudflare Worker handles all language routing
export default function ({ req }) {
  // No-op: Cloudflare Worker is the source of truth for language routing
  // This file is kept for compatibility but does nothing
  return;
}
