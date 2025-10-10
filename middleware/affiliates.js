export default async function ({ app, req, query, $axios }) {
  if (!process.server) return

  let [cookie_aff_id, query_aff_id, referer] = [
    Number(app.$cookiz.get('aff_id')),
    query.aff_id,
    req.headers.referer,
  ]

  // No update needed.
  if (!query_aff_id || query_aff_id == cookie_aff_id) return

  query_aff_id = Number(query_aff_id)

  await $axios.$post('/checkout/aff/new_click', {
    aff_id: query_aff_id,
    referer,
  })
  return app.$cookiz.set('aff_id', query_aff_id, {
    maxAge: 60 * 60 * 24 * 30 * 3,
  })
}
