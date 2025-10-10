import cookie from 'cookie'

const updateCookie = ({ req, app, userid, email }) => {
  const parsedCookies = JSON.parse(
    cookie.parse(req.headers.cookie || '')['checkout'] || '{}'
  )
  Object.assign(parsedCookies, {
    auth: {
      loggedIn: true,
      user: {
        userid,
      },
    },
    user: {
      email,
    },
  })
  const newCookie = JSON.stringify(parsedCookies)
  app.$cookiz.set('checkout', newCookie, {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export default async function ({ store, app, query, req }) {
  const { email } = query
  // Email Auto Login
  if (email && (!app.$auth.loggedIn || email !== store.state.user.email)) {
    const data = await store.dispatch('user/authMiddleware', { email })
    if (typeof data === 'object') {
      const { userid } = data
      if (userid) {
        app.$auth.setUser(data)
        updateCookie({ req, app, email, userid })
      }
    }
  }
}
