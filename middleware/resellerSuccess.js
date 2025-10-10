export default async function ({ store, app, query, $auth, redirect, req }) {
  if (!query.serviceid || !$auth.loggedIn)
    redirect(app.localePath('/resellers'))
  const response = await store.dispatch(
    'productDetails/getResellerProduct',
    query.serviceid
  )
  if (response.error || response.status !== 'Active')
    redirect(app.localePath('/resellers'))
  //   console.log({ response })
}
