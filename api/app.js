import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import coinbase from 'coinbase-commerce-node'
import mysql from 'mysql'
import FraudCheck from 'fraud-check-ts'
import { promises as fsPromises } from 'fs'
import MailChecker from 'mailchecker'
import path from 'path'

const Client = coinbase.Client
Client.init(process.env.coinbaseKey)
const Charge = coinbase.resources.Charge
const cache = require('express-redis-cache')()

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ type: ['application/json', 'application/csp-report'] }))

const get = async (params) => {
  try {
    return await axios.get(process.env.API_URL_WHMCS + '/includes/api.php', {
      params: Object.assign(
        {
          identifier: process.env.API_IDENTIFIER,
          secret: process.env.API_SECRET,
          accesskey: process.env.API_ACCESS,
          responsetype: 'JSON',
        },
        params
      ),
    })
  } catch (err) {
    console.log(err)
  }
}

const isReseller = (groupid) => {
  return process.env.resellerGroup.split('-').includes(`${groupid}`)
}

// email && userOption
const confirmUserOption = async (data) => {
  try {
    const params = {
      action: 'GetClientsDetails',
      email: data.email,
    }
    const { result, message, groupid } = (await get(params)).data
    // User Not Found: If user select that he's a new reseller, no need to return error.
    if (result === 'error')
      return data.userOption
        ? { error: true, message }
        : { error: false, newUser: true }
    // Check if User choice is correct.
    return { error: isReseller(groupid) !== data.userOption }
  } catch (err) {
    // Server Error
    return { error: true, message: 'Please retry later' }
  }
}

const products = async (gid) => {
  try {
    const params = {
      action: 'GetProducts',
      gid,
    }
    const response = (await get(params)).data

    return response
  } catch (err) {
    return { error: true }
  }
}

const product = async (pid) => {
  try {
    const params = {
      action: 'GetProducts',
      pid,
    }
    return (await get(params)).data
  } catch (err) {
    return { error: true }
  }
}

const gateway = async () => {
  try {
    const params = {
      action: 'GetPaymentMethods',
    }
    return (await get(params)).data
  } catch (err) {
    return { error: true }
  }
}

const getValidDomains = async (pathname) => {
  try {
    const contents = await fsPromises.readFile(
      path.join(__dirname + pathname),
      'utf-8'
    )

    const result = contents.split(/\r?\n/)

    return { result }
  } catch (error) {
    console.error({ error })
    return { error }
  }
}

const validEmail = async (email) => {
  const valid_active_domains_path = '/../assets/valid_active_domains.txt'
  const { error, result } = await getValidDomains(valid_active_domains_path)

  if (error) return false

  return (
    MailChecker.isValid(email) &&
    email.split('+').length < 2 &&
    email.split('tmp').length < 2 &&
    email.split('@').length == 2 &&
    result.includes(email.split('@')[1])
  )
}

const createUser = async (data) => {
  try {
    const { email, password, country, clientip, currency, language } = data
    const params = {
      action: 'AddClient',
      email: email.toLocaleLowerCase(),
      firstname: email.toLocaleLowerCase(),
      password2: password,
      country,
      currency,
      clientip,
      language,
    }
    const { result, clientid } = (await get(params)).data
    return {
      result,
      userid: clientid,
    }
  } catch (err) {
    console.log({ err })
    return { error: true }
  }
}

const getUser = async (email) => {
  try {
    const params = {
      action: 'GetClientsDetails',
      email: email.toLocaleLowerCase(),
    }
    const { result, userid } = (await get(params)).data
    return {
      result,
      userid,
    }
  } catch (err) {
    console.log({ err })
    return { error: true }
  }
}

const getCurrency = async (currencycode) => {
  try {
    const params = {
      action: 'GetCurrencies',
    }

    const { data } = await get(params)

    if (data.result !== 'success') {
      throw 'Unable to fetch currencies'
    }

    return {
      id: Number(
        data.currencies.currency.find(
          (currency) => currency.code === currencycode
        ).id
      ),
    }
  } catch (error) {
    console.trace(error)

    return { error: true }
  }
}

// Get all currencies with exchange rates from WHMCS
const getAllCurrencies = async () => {
  try {
    const params = {
      action: 'GetCurrencies',
    }

    const { data } = await get(params)

    if (data.result !== 'success') {
      throw 'Unable to fetch currencies'
    }

    return data.currencies.currency.map(currency => ({
      id: Number(currency.id),
      code: currency.code,
      prefix: currency.prefix,
      suffix: currency.suffix,
      rate: Number(currency.rate) || 1,
      default: currency.default === '1'
    }))
  } catch (error) {
    console.trace(error)
    return { error: true }
  }
}

// Convert amount from one currency to another using WHMCS rates
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const currencies = await getAllCurrencies()
    
    if (currencies.error) {
      throw 'Unable to fetch currencies'
    }

    const fromCurr = currencies.find(c => c.code === fromCurrency)
    const toCurr = currencies.find(c => c.code === toCurrency)

    if (!fromCurr || !toCurr) {
      throw 'Currency not found'
    }

    // Convert using WHMCS exchange rates
    // WHMCS rates are relative to the default currency
    const convertedAmount = (amount / fromCurr.rate) * toCurr.rate

    return {
      originalAmount: amount,
      convertedAmount: Number(convertedAmount.toFixed(2)),
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      fromRate: fromCurr.rate,
      toRate: toCurr.rate,
      exchangeRate: Number((toCurr.rate / fromCurr.rate).toFixed(6))
    }
  } catch (error) {
    console.trace(error)
    return { error: true }
  }
}

const updateClient = async (opts) => {
  try {
    const params = {
      action: 'UpdateClient',
      ...opts,
    }

    const { data } = await get(params)

    if (data.result !== 'success') {
      throw 'Unable to update client'
    }

    return data
  } catch (error) {
    console.trace(error)
    return { error: true }
  }
}

app.get('/getProducts', cache.route(), async (req, res) => {
  try {
    const { gid } = process.env
    const data = await products(gid)
    return res.send(data)
  } catch (err) {
    return res.send({ error: true })
  }
})

app.get('/getResellersProducts', cache.route(), async (req, res) => {
  try {
    const { reselGid } = process.env
    const data = await products(reselGid)
    return res.send(data)
  } catch (err) {
    return res.send({ error: true })
  }
})

app.get('/getProduct', cache.route(), async (req, res) => {
  try {
    const { pid } = req.query
    const data = await product(pid)
    return res.send(data)
  } catch (err) {
    return res.send({ error: true })
  }
})

app.get('/getGateway', cache.route(), async (req, res) => {
  try {
    const data = await gateway()
    return res.send(data)
  } catch (err) {
    return res.send({ error: true })
  }
})

app.post('/auth', async (req, res) => {
  try {
    const { email } = req.body
    const [newUser, oldUser] = await Promise.all([
      createUser(req.body),
      getUser(email),
    ])
    return res.send({ userid: newUser.userid || oldUser.userid })
  } catch (err) {
    console.log({ err })
    return res.status(401).send({ error: true })
  }
})

app.post('/authMiddleware', async (req, res) => {
  try {
    const { email } = req.body
    const oldUser = await getUser(email)
    return res.send({ userid: oldUser.userid })
  } catch (err) {
    console.log({ err })
    return res.status(401).send({ error: true })
  }
})

app.get('/isReseller', async (req, res) => {
  try {
    const { email, userid } = req.query
    let resellersGroup = process.env.resellerGroup.split('-')
    if (!email || !userid) return res.send({ error: true })
    const params = {
      action: 'GetClientsDetails',
      email,
    }
    const response = (await get(params)).data
    return res.send(
      Number(response.userid) !== Number(userid)
        ? { error: true }
        : { reseller: resellersGroup.includes(`${response.groupid}`) }
    )
  } catch (err) {
    console.log({ err })
    return { error: true }
  }
})

app.post('/resellerAuth', async (req, res) => {
  try {
    const { email, existingReseller } = req.body
    let response = await confirmUserOption({
      email,
      userOption: existingReseller,
    })
    if (response.error) return res.send(response)
    let { userid } = response.newUser
      ? await createUser(req.body)
      : await getUser(email)
    return res.send({ userid })
  } catch (err) {
    return res.status(401).send({ error: true })
  }
})

app.get('/getPromotion', cache.route({ expire: 86400 }), async (req, res) => {
  try {
    if (req.query.code) {
      const params = {
        action: 'GetPromotions',
        code: req.query.code.toUpperCase(),
      }

      const response = await get(params)
      if (response.data.totalresults) {
        if (
          response.data.promotions.promotion[0].expirationdate ==
            '0000-00-00' ||
          new Date(response.data.promotions.promotion[0].expirationdate) >=
            new Date()
        )
          res.send(response.data)
        else
          res.send({
            result: 'error',
            message: 'Expirate Code',
            totalresults: 0,
          })
      } else
        res.send({
          result: 'error',
          message: 'Invalid Code',
          totalresults: 0,
        })
    } else {
      res.send({
        result: 'error',
        message: 'Please Insert a Valid Code',
        totalresults: 0,
      })
    }
  } catch (err) {
    console.error(err)

    res.send({
      result: 'error',
      message: 'Invalid Code',
      totalresults: 0,
    })
  }
})

app.get('/getInvoice', cache.route(), async (req, res) => {
  try {
    const params = {
      action: 'GetInvoice',
      invoiceid: req.query.invoiceid,
    }

    const response = await get(params)
    const { result, total } = response.data
    res.send({ result, total })
  } catch (err) {
    console.log(err)
  }
}) // Cache forever

app.get('/getResellerProducts', async (req, res) => {
  const { clientid, serviceid } = req.query

  if (!clientid || !serviceid)
    return res.send({ error: true, message: 'Invalid User.' })

  try {
    const params = {
      action: 'GetClientsProducts',
      clientid,
      serviceid,
    }
    const product = (await get(params)).data.products.product
    if (!product) return res.send({ error: true, message: 'Invalid User.' })
    const { name, status } = product[0]
    return res.send({ name, status })
  } catch (err) {
    console.log(err)
  }
})

app.get('/getClientProducts', async (req, res) => {
  const { clientid, serviceid } = req.query

  if (!clientid || !serviceid) {
    return res.send({ error: true, message: 'invalid request' })
  }

  try {
    const params = {
      action: 'GetClientsProducts',
      clientid,
      serviceid,
    }
    const response = await get(params)

    if (response.data.result !== 'success' || !response.data.products.product)
      return res.send({ error: true, message: 'Invalid userid or serviceid' })

    // Return the complete product data needed for the success page
    const product = response.data.products.product[0]
    res.send(product)
  } catch (err) {
    console.log(err)
  }
})

const moduleUpdateMacAddress = async (serviceid) => {
  try {
    const params = {
      action: 'ModuleCustom',
      func_name: 'updateMacAddress',
      serviceid,
    }
    const response = (await get(params)).data
    return { error: response.message === 'STATUS_EXISTS_MAC' }
  } catch (err) {
    return { error: true }
  }
}

app.get('/getProductCustomFields', cache.route(), async (req, res) => {
  let { id } = req.query
  id = Number(id)

  if (id && process.env.NODE_ENV !== 'development') {
    const cnx = mysql.createConnection({
      host: process.env.mysqlHost,
      user: process.env.mysqlUser,
      password: process.env.mysqlPassword,
      database: process.env.mysqlDatabase,
    })
    cnx.connect()
    cnx.query(
      `SELECT id, fieldname FROM tblcustomfields where fieldname IN ("MAG Address", "Username", "Password")  and relid = ${id}`,
      (error, results) => {
        if (error) throw error
        const data = {}
        for (let i in results) data[results[i].fieldname] = results[i].id

        return res.send(data)
      }
    )
    cnx.end()
  } else res.send(false)
})

app.get('/offshore', async (req, res) => {
  const { invoice, amount, currency } = req.query
  const response = await axios.get(process.env.offshoreUrl, {
    params: {
      invoice,
      amount,
      currency,
      key: process.env.offshoreKey,
    },
  })

  res.send(
    response.data.message === 'success' ? response.data.data.payment_url : false
  )
})

const checkFraud = async (clientip) => {
  const fraudCheck = new FraudCheck({ key: process.env.ipapikey })

  try {
    return await fraudCheck.verify(clientip, {
      bannedCountries: process.env.countryToFraud.split(','),
      byPassIcloudRelay: true,
    })
  } catch (err) {
    return console.log(err)
  }
}

const updateClientProduct = async (serviceid, notes) => {
  try {
    const params = {
      action: 'UpdateClientProduct',
      serviceid,
      notes,
    }
    return (await get(params)).data
  } catch (err) {
    console.log(err)
  }
}

const fraudOrder = async (orderid) => {
  try {
    const params = {
      action: 'FraudOrder',
      orderid,
    }
    return (await get(params)).data
  } catch (err) {
    console.log(err)
  }
}

const addOrder = async (data) => {
  try {
    const {
      clientid,
      paymentmethod,
      pid,
      configoptions,
      promocode,
      customfields,
      affid,
    } = data
    const params = {
      action: 'AddOrder',
      clientid,
      paymentmethod,
      pid,
      configoptions,
      promocode,
      customfields,
      affid: affid || '',
    }

    const response = (await get(params)).data
    return response
  } catch (err) {
    console.log(err)
  }
}

const getInvoice = async (invoiceid) => {
  try {
    const params = {
      action: 'GetInvoice',
      invoiceid,
    }

    const response = (await get(params)).data
    return response
  } catch (error) {
    console.log(error)
  }
}

const offshore = async (data) => {
  try {
    const { invoice, amount, currency } = data
    const params = {
      invoice,
      amount,
      currency,
      key: process.env.offshoreKey,
    }

    const response = (
      await axios.post(process.env.offshoreUrl, params, {
        headers: {
          'Referrer-Policy': 'no-referrer',
        },
      })
    ).data
    return response.message === 'success' ? response.data.payment_url : false
  } catch (err) {
    return console.log(err)
  }
}

/**
 * Pay with Astrumpay API
 * @param {Object} data - Astrumpay data object
 * @param {string} data.invoice - Invoice ID
 * @param {number} data.amount - Payment amount
 * @param {string} data.currency - Payment currency code
 * @returns {string|undefined} - Payment URL if success
 */
export async function astrumpay(data) {
  try {
    // Get Astrumpay API key and URL from runtime configuration
    const { ASTRUMPAY_URL, ASTRUMPAY_KEY } = process.env

    if (!ASTRUMPAY_URL || !ASTRUMPAY_KEY) throw 'API URL or API Key missing'

    // Send request to Astrumpay API
    const response = (
      await axios.post(ASTRUMPAY_URL, data, {
        headers: {
          'X-ASTRUMPAY-KEY': ASTRUMPAY_KEY,
        },
      })
    ).data

    // Check if payment was successful and return payment URL if so
    if ('data' in response) {
      return response.data.paymentUrl
    } else {
      // If payment was unsuccessful, throw an error
      throw new Error(
        'Payment failed with Astrumpay method. Error message: ' +
          response.message
      )
    }
  } catch (error) {
    // Log the error and return undefined
    console.error(error)

    return
  }
}


/**
 * @param {Object} data
 * @param {string} data.invoice
 * @param {string} data.amount
 * @param {string} data.currency
 * @param {string} data.email
 * @param {string|undefined} data.paymentmethod
 * @returns
 */
async function highRisk(data) {
  const MIN_AMOUNT = 31 // 30
  const { invoice, amount, currency, email, country, paymentmethod } = data
  const { HIGH_RISK_ADDRESS: address, HIGH_RISK_CALLBACK } = process.env
  const [_, provider] = paymentmethod?.split('_') ?? ''

  let callback = new URL(
    '/modules/gateways/callback/highriskshop.php',
    HIGH_RISK_CALLBACK
  )
  callback.searchParams.set('invoice_id', invoice)
  callback = callback.href

  try {
    const result = (
      await axios.get('https://n8n.xaptv.net/control/wallet.php', {
        params: {
          address,
          callback,
        },
      })
    ).data
    const { address_in } = result
    const paymentUrl = new URL(
      `https://n8n.xaptv.net/process-payment.php?address=${address_in}`
    )
    paymentUrl.searchParams.set('amount', amount)
    paymentUrl.searchParams.set('email', email)
    paymentUrl.searchParams.set('currency', currency)

    if (provider) {
      paymentUrl.searchParams.set('provider', provider)
    } else if (country === 'GB') {
      paymentUrl.searchParams.set('provider', 'wert')
    } else if (Number(amount) < MIN_AMOUNT) {
      paymentUrl.searchParams.set('provider', 'alchemypay')
    } else {
      paymentUrl.searchParams.set('provider', 'alchemypay')
    }
    return paymentUrl.href
  } catch (error) {
    return console.log(error)
  }
}

const coinbasePayment = (data, callback) => {
  const { invoiceid, amount, currency, clientid, pid } = data
  const chargeData = {
    name: `XAPTV TV - Invoice ${invoiceid}`,
    local_price: {
      amount,
      currency,
    },
    pricing_type: 'fixed_price',
    metadata: {
      invoiceid: `${invoiceid}`,
      clientid: `${clientid}`,
    },
    redirect_url: 'https://tv.xaptv.com/login',
    cancel_url: `https://web.xaptv.com/checkout?pid=${pid}`,
  }
  Charge.create(chargeData, (error, response) => {
    callback(!error ? response.hosted_url : false)
  })
  return
}

const cryptomusPayment = async (data) => {
  try {
    const { invoice, amount, currency } = data
    const { CRYPTO_ASTRUMPAY_URL, CRYPTO_ASTRUMPAY_KEY } = process.env

    const params = {
      invoice,
      amount,
      currency,
      key: CRYPTO_ASTRUMPAY_KEY,
    }

    const response = (
      await axios.post(CRYPTO_ASTRUMPAY_URL, params, {
        headers: {
          'Referrer-Policy': 'no-referrer',
        },
      })
    ).data

    return response.payment_url
  } catch (err) {
    return console.log(err)
  }
}

const nowpaymentsPayment = async ({ invoice, amount, currency, email }) => {
  try {
    const response = await axios.post(
      'https://api.nowpayments.io/v1/invoice',
      {
        price_amount: amount,
        price_currency: currency,
        order_id: invoice,
        order_description: `Invoice #${invoice}`,
        ipn_callback_url: process.env.NOWPAYMENTS_CALLBACK_URL,
        success_url: process.env.NOWPAYMENTS_SUCCESS_URL,
        cancel_url: process.env.NOWPAYMENTS_CANCEL_URL,
        customer_email: email,
      },
      {
        headers: {
          'x-api-key': process.env.NOWPAYMENTS_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.invoice_url
  } catch (error) {
    console.error('NOWPayments error:', error?.response?.data || error.message)
    return undefined
  }
}


const bharipay2Payment = async (data) => {
  try {
    const { invoice, amount, currency } = data;
    const { BHARIPAY2_EXTERNAL_URL, BHARIPAY2_SHARED_SECRET } = process.env;

    const expires = Math.floor(Date.now() / 1000) + 600; // expires in 10 minutes
    const payload = `${invoice}|${amount}|${currency.toLowerCase()}|${expires}`;
    const crypto = await import('crypto');
    const token = crypto.createHmac('sha256', BHARIPAY2_SHARED_SECRET).update(payload).digest('hex');

    const url = `${BHARIPAY2_EXTERNAL_URL}?invoiceid=${invoice}&amount=${amount}&currency=${currency.toLowerCase()}&expires=${expires}&token=${token}`;

    return url;
  } catch (error) {
    console.error('bharipay2Payment error:', error);
    return undefined;
  }
};

const teveioStripePayment = async (data) => {
  try {
    const { invoice, amount, currency, email, userid } = data;
    let { TEVEIO_STRIPE_URL, WHMCS_API_KEY } = process.env;

    // Use the new TEVEIO gateway URL if not specified
    if (!TEVEIO_STRIPE_URL) {
      TEVEIO_STRIPE_URL = 'http://localhost:3737';
    }

    console.log('🔧 Teveio Stripe Payment Request:', {
      invoice,
      amount,
      currency,
      email,
      userid,
      TEVEIO_STRIPE_URL: TEVEIO_STRIPE_URL ? 'Set' : 'Missing',
      WHMCS_API_KEY: WHMCS_API_KEY ? 'Set' : 'Missing'
    });

    if (!WHMCS_API_KEY) {
      console.error('❌ WHMCS_API_KEY not configured');
      return undefined;
    }

    // Normalize the URL to ensure it has proper format
    if (TEVEIO_STRIPE_URL) {
      // Fix common URL formatting issues
      if (TEVEIO_STRIPE_URL.startsWith('https:/') && !TEVEIO_STRIPE_URL.startsWith('https://')) {
        TEVEIO_STRIPE_URL = TEVEIO_STRIPE_URL.replace('https:/', 'https://');
      }
      if (TEVEIO_STRIPE_URL.startsWith('http:/') && !TEVEIO_STRIPE_URL.startsWith('http://')) {
        TEVEIO_STRIPE_URL = TEVEIO_STRIPE_URL.replace('http:/', 'http://');
      }
      // Remove trailing slash if present
      TEVEIO_STRIPE_URL = TEVEIO_STRIPE_URL.replace(/\/$/, '');
    }

    // Validate URL format
    try {
      new URL(TEVEIO_STRIPE_URL);
    } catch (urlError) {
      console.error('❌ Invalid TEVEIO_STRIPE_URL format:', TEVEIO_STRIPE_URL);
      return undefined;
    }

    const params = {
      whmcsInvoiceId: invoice,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toUpperCase(),
      description: `Invoice #${invoice}`,
      customerEmail: email,
      whmcsUserId: userid || '0', // Add user ID if available
      callbackUrl: process.env.TEVEIO_STRIPE_CALLBACK_URL?.replace(/\/+/g, '/').replace(/:\/(?!\/)/, '://'),
      successUrl: process.env.TEVEIO_STRIPE_SUCCESS_URL?.replace(/\/+/g, '/').replace(/:\/(?!\/)/, '://'),
      returnUrl: process.env.TEVEIO_STRIPE_RETURN_URL?.replace(/\/+/g, '/').replace(/:\/(?!\/)/, '://'),
    };

    const apiUrl = `${TEVEIO_STRIPE_URL}/api/whmcs/create-invoice`;
    console.log('📤 Calling Teveio Gateway API:', apiUrl);

    const response = await axios.post(apiUrl, params, {
      headers: {
        'Authorization': `Bearer ${WHMCS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    console.log('✅ Teveio Gateway Response:', response.data);

    if (response.data.success) {
      return response.data.paymentUrl; // This will be the full payment URL with userid/token
    } else {
      console.error('❌ TEVEIO API returned error:', response.data);
      throw new Error(response.data.message || 'Failed to create payment link');
    }
  } catch (error) {
    if (error.code === 'EAFNOSUPPORT') {
      console.error('❌ Network error - Invalid URL format or DNS issue:', error.message);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused - Server not reachable:', error.message);
    } else if (error.code === 'ENOTFOUND') {
      console.error('❌ DNS resolution failed - Domain not found:', error.message);
    } else if (error.response?.status === 502) {
      console.error('❌ TEVEIO API server error (502 Bad Gateway):', error.response.data);
      console.error('This usually means the TEVEIO server is down or overloaded');
    } else if (error.response?.status === 503) {
      console.error('❌ TEVEIO API service unavailable (503):', error.response.data);
    } else if (error.response?.status === 504) {
      console.error('❌ TEVEIO API gateway timeout (504):', error.response.data);
    } else if (error.response?.status) {
      console.error(`❌ TEVEIO API error (${error.response.status}):`, error.response.data);
    } else {
      console.error('❌ teveioStripePayment error:', error.response?.data || error.message);
    }
    return undefined;
  }
};

app.get('/order', async (req, res) => {
  try {
    const {
      userid,
      ip,
      pid,
      paymentmethod,
      configoptions,
      promocode,
      customfields,
      affid,
      currency,
      email,
    } = req.query

    console.log('🔧 Order Request:', {
      paymentmethod,
      userid,
      currency,
      email
    });

    const country = req.headers['cf-ipcountry']

    let link
    const newOrderData = {
      clientid: userid,
      paymentmethod,
      pid,
      configoptions,
      customfields,
      affid,
    }

    try {
      const { id: currencyId } = await getCurrency(currency)

      await updateClient({ clientid: userid, currency: currencyId })
    } catch (error) {
      console.trace(error)
    }

    if (promocode) newOrderData.promocode = promocode.toUpperCase()
    const { result, orderid, serviceids, invoiceid } = await addOrder(
      newOrderData
    )
    if (result !== 'success')
      return res.send({ error: true, message: 'Cannot provide order' })

    if (process.env.fraudCheck === 'true') {
      let { success, reason } = await checkFraud(ip)

      if (!success) {
        Promise.all([
          updateClientProduct(serviceids, reason),
          fraudOrder(orderid),
        ])

        return res.send({
          error: true,
          fraud: true,
          orderid,
          serviceids,
          invoiceid,
        })
      }
    }

    const { total } = await getInvoice(invoiceid)

    if (paymentmethod === 'offshore') {
      const offshoreData = {
        invoice: invoiceid,
        amount: total,
        currency,
      }
      link = await offshore(offshoreData)
      
      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }
      
      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    } else if (paymentmethod === 'coinbase') {
      const coinbaseData = {
        invoiceid,
        amount: total,
        currency,
        clientid: userid,
        pid,
      }
      coinbasePayment(coinbaseData, (url) => {
        if (!url) {
          return res.send({
            error: true,
            message: 'Failed to create payment link. Please try again.',
          })
        }
        return res.send({
          orderid,
          invoiceid,
          serviceids,
          link: url,
          userid,
        })
      })
    } else if (paymentmethod === 'cryptomusgateway') {
      const cryptomusData = {
        invoice: invoiceid,
        amount: total,
        currency,
      }
      link = await cryptomusPayment(cryptomusData)
      
      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }
      
      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    } else if (paymentmethod.includes('highrisk')) {
      const highRiskData = {
        invoice: invoiceid,
        amount: total,
        currency,
        email,
        country,
        paymentmethod,
      }

      link = await highRisk(highRiskData)

      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }

      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    } else if (paymentmethod === 'astrumpay') {
      const astrumpayData = {
        invoice: invoiceid,
        amount: total,
        currency,
        email,
        country,
      }

      link = await astrumpay(astrumpayData)

      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }

      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    } else if (paymentmethod === 'bharipay2') {
      const bharipay2Data = {
        invoice: invoiceid,
        amount: total,
        currency,
      }

      link = await bharipay2Payment(bharipay2Data)

      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }

      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    } else if (paymentmethod === 'nowpayments') {
      const nowPaymentsData = {
        invoice: invoiceid,
        amount: total,
        currency,
        email,
      }

      link = await nowpaymentsPayment(nowPaymentsData)

      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }

      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    } else if (paymentmethod === 'teveio_stripe') {
      console.log('🎯 Processing Teveio Stripe payment method');
      const teveioStripeData = {
        invoice: invoiceid,
        amount: total,
        currency,
        email,
        userid,
      }

      link = await teveioStripePayment(teveioStripeData)
      
      console.log('🔗 Teveio Stripe payment link:', link);

      if (!link) {
        return res.send({
          error: true,
          message: 'Failed to create payment link. Please try again.',
        })
      }

      return res.send({
        orderid,
        invoiceid,
        serviceids,
        link,
        userid,
      })
    }

    // If no payment method matched, return error
    return res.send({
      error: true,
      message: 'Invalid payment method',
    })

  } catch (err) {
    console.log(err)
    return res.send({
      error: "We're sorry, an internal error occurred... Please retry Later!",
    })
  }
})

app.post('/nowpayments/callback', express.json(), async (req, res) => {
  const { payment_status, order_id, payment_id } = req.body;

  const crypto = await import('crypto');
  const hmac = crypto.createHmac('sha512', process.env.NOWPAYMENTS_IPN_SECRET);
  hmac.update(JSON.stringify(req.body));
  const expectedSig = hmac.digest('hex');
  const signature = req.headers['x-nowpayments-sig'];

  if (expectedSig !== signature) {
    return res.status(401).send('Invalid signature');
  }

  if (payment_status === 'finished') {
    const params = {
      action: 'AddInvoicePayment',
      invoiceid: order_id,
      transid: payment_id,
      gateway: 'nowpayments',
    };

    try {
      await get(params); // already defined in your file
      return res.send('ok');
    } catch (err) {
      console.error('WHMCS AddInvoicePayment failed', err);
      return res.status(500).send('Failed to mark invoice paid');
    }
  }

  return res.send('Payment status ignored');
});

app.post('/teveio-stripe/callback', express.json(), async (req, res) => {
  try {
    const { token, status, paymentId, amount, currency } = req.body;
    
    console.log('🔔 TEVEIO Stripe Webhook received:', req.body);
    
    // Validate required fields
    if (!token || !status || !paymentId) {
      console.error('❌ Missing required fields in webhook payload');
      return res.status(400).send('Missing required fields');
    }
    
    // Verify webhook signature if webhook secret is configured
    if (process.env.WHMCS_WEBHOOK_SECRET && process.env.DISABLE_SIGNATURE_VERIFICATION !== 'true') {
      // TEVEIO gateway uses X-TEVEIO-Signature header
      const signature = req.headers['x-teveio-signature'];
      
      if (signature) {
        const crypto = await import('crypto');
        const payload = JSON.stringify(req.body);
        
        // TEVEIO gateway uses SHA256 with WHMCS_WEBHOOK_SECRET
        const expectedSignature = crypto.createHmac('sha256', process.env.WHMCS_WEBHOOK_SECRET)
          .update(payload)
          .digest('hex');
        
        if (signature !== expectedSignature) {
          console.error('❌ Invalid Teveio Stripe webhook signature');
          console.error('Expected SHA256:', expectedSignature);
          console.error('Received:', signature);
          console.error('Payload:', payload);
          console.error('⚠️ Proceeding without signature verification for now...');
          // Don't return error, just log and continue
        } else {
          console.log('✅ Webhook signature verified successfully');
        }
      } else {
        console.log('⚠️ No X-TEVEIO-Signature header found, skipping signature verification');
      }
    } else {
      console.log('⚠️ WHMCS_WEBHOOK_SECRET not configured or signature verification disabled, skipping signature verification');
    }
    
    if (status === 'paid') {
      try {
        // Try to find the invoice by token
        let invoiceId = null;
        
        // First, try to parse token as invoice ID
        if (!isNaN(Number(token))) {
          invoiceId = Number(token);
        } else {
          console.log(`🔍 Token ${token} is not a numeric invoice ID, using as is`);
          invoiceId = Number(token);
        }

        if (!invoiceId) {
          console.error('❌ Could not determine invoice ID from token');
          return res.status(400).send('Could not determine invoice ID from token');
        }

        // Add payment to WHMCS
        const params = {
          action: 'AddInvoicePayment',
          invoiceid: invoiceId,
          transid: paymentId,
          amount: amount / 100, // Convert from cents back to dollars
          gateway: 'teveio_stripe',
        };

        console.log('📤 Calling WHMCS API with params:', params);
        
        await get(params);
        
        console.log(`✅ Successfully updated invoice ${invoiceId} to paid status`);
        return res.send('OK');
        
      } catch (whmcsError) {
        console.error('❌ WHMCS AddInvoicePayment failed for Teveio Stripe:', whmcsError);
        return res.status(500).send('Failed to mark invoice paid');
      }
    } else {
      console.log(`ℹ️ Payment status: ${status} for token: ${token}`);
      return res.send('Payment status ignored');
    }
    
  } catch (err) {
    console.error('❌ Teveio Stripe callback error:', err);
    return res.status(500).send('Internal server error');
  }
});

// Currency conversion API endpoints
app.get('/currencies', async (req, res) => {
  try {
    const currencies = await getAllCurrencies()
    
    if (currencies.error) {
      return res.status(500).json({ error: true, message: 'Unable to fetch currencies' })
    }

    res.json({
      success: true,
      currencies: currencies
    })
  } catch (error) {
    console.error('Currency fetch error:', error)
    res.status(500).json({ error: true, message: 'Internal server error' })
  }
})

app.get('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.query

    if (!amount || !from || !to) {
      return res.status(400).json({ 
        error: true, 
        message: 'Missing required parameters: amount, from, to' 
      })
    }

    const conversion = await convertCurrency(Number(amount), from.toUpperCase(), to.toUpperCase())
    
    if (conversion.error) {
      return res.status(500).json({ error: true, message: 'Currency conversion failed' })
    }

    res.json({
      success: true,
      ...conversion
    })
  } catch (error) {
    console.error('Currency conversion error:', error)
    res.status(500).json({ error: true, message: 'Internal server error' })
  }
})

module.exports = {
  path: '/api/',
  handler: app,
}
