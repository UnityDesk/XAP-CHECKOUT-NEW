import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const fromSqlDB = async (query, data) => {
  // MYSQL INFO
  const {
    mysqlHost: host,
    mysqlUser: user,
    mysqlPassword: password,
    mysqlDatabase: database,
  } = process.env

  try {
    const conn = await mysql.createConnection({
      host,
      user,
      password,
      database,
    })
    const [rows] = await conn.execute(query, data)
    conn.end()
    return rows
  } catch (err) {
    if (conn) conn.end()
    console.log({ err, function: 'fromSQLDB' })
    return { error: true }
  }
}
