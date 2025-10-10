export default function ({ redirect, req, app }) {
  // Add wwv subdomain
  if (process.server) {
    let host = req.headers.host
    const ssl = req.connection.encrypted ? 'https://' : 'http://'
    const path = req.originalUrl

    host = host.split('.')
    host.unshift('wwv')
    host = host.join('.')

    if (!host.includes('wwv') && host == 'xaptv.com')
      return redirect(301, ssl + host + path)
  }
}
