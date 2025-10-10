import https from 'https'

export default function ({ $axios }) {
  $axios.defaults.timeout = 30 * 1000
  $axios.defaults.httpsAgent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false,
  })
  $axios.onError((error) => {
    console.log({ error })
  })
}
