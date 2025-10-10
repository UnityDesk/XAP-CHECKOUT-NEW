export default function ({ redirect, req, app }) {
  // Handle wildcard domains for xaptv.com
  if (process.server) {
    let host = req.headers.host
    const ssl = req.connection.encrypted ? 'https://' : 'http://'
    const path = req.originalUrl

    // Check if domain is xaptv.com (without subdomain)
    if (host === 'xaptv.com') {
      return redirect(301, ssl + 'web.xaptv.com' + path)
    }

    // Check if domain is a subdomain of xaptv.com
    if (host.endsWith('.xaptv.com')) {
      // Allow wildcard subdomains - no redirect needed
      return
    }

    // For any other domain, redirect to web.xaptv.com
    if (!host.includes('xaptv.com')) {
      return redirect(301, ssl + 'web.xaptv.com' + path)
    }
  }
}
