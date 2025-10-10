import express from 'express'
import cors from 'cors'
import { fromSqlDB } from './utils/mysql'

const app = express()
app.use(cors())
app.use(express.json({ type: ['application/json', 'application/csp-report'] }))

const check_referer = async (aff_id, referer = 'Undefined') => {
  try {
    const query =
      'SELECT id FROM tblaffiliates_referrers WHERE affiliate_id = ? and referrer LIKE ? '
    const data = [aff_id, referer]

    const is_registred = !!(await fromSqlDB(query, data)).length
    return is_registred
  } catch (err) {
    console.log({ err, function: 'check_referer' })
    return { error: true }
  }
}

const add_referer = async (aff_id, referer = 'Undefined') => {
  try {
    const query =
      'INSERT INTO tblaffiliates_referrers (id, affiliate_id, referrer, created_at, updated_at) VALUES (NULL, ?, ?, CURRENT_TIME(), CURRENT_TIME())'
    const data = [aff_id, referer]

    return await fromSqlDB(query, data)
  } catch (err) {
    console.log({ err, function: 'add_referer' })
    return { error: true }
  }
}

const register_click = async (aff_id, referer = 'Undefined') => {
  try {
    let query =
      'INSERT INTO tblaffiliates_hits (affiliate_id, referrer_id, created_at) VALUES(?, (SELECT id FROM tblaffiliates_referrers WHERE affiliate_id = ? and referrer LIKE ? LIMIT 1), (CURRENT_TIME()))'
    let data = [aff_id, aff_id, referer]

    return await fromSqlDB(query, data)
  } catch (err) {
    console.log({ err, function: 'add_click' })
    return { error: true }
  }
}

const increment_click = async (aff_id) => {
  try {
    const query =
      'UPDATE tblaffiliates SET visitors = visitors + 1 WHERE id = ?'
    const data = [aff_id]

    return await fromSqlDB(query, data)
  } catch (err) {
    console.log({ err, function: 'increment_click' })
    return { error: true }
  }
}

app.post('/new_click', async (req, res) => {
  res.send({})
  try {
    const { aff_id, referer } = req.body
    const is_registred = await check_referer(aff_id, referer)
    if (!is_registred) await add_referer(aff_id, referer)
    return await Promise.all([
      register_click(aff_id, referer),
      increment_click(aff_id),
    ])
  } catch (err) {
    return console.log({ err, api: '/new_click' })
  }
})

module.exports = {
  path: '/aff/',
  handler: app,
}
