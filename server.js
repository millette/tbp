'use strict'

// npm
require("dotenv-safe").config()
const got = require("got")
const {CookieJar} = require('tough-cookie')
const fastify = require('fastify')({
  trustProxy: process.env.PROXY,
  // logger: true
})

const cookieJar = new CookieJar()
const u = "https://sms.voip.ms/sms_manage.php"

// console.log("LOGIN", process.env.LOGIN)
// console.log("PASSWORD", process.env.PASSWORD)

const fetchTicker = (symbol) =>
got("https://api.binance.com/api/v1/ticker/price", {
  searchParams: {
    symbol
  },
  responseType: "json"
})
.then(({headers, body}) => ({
  symbol: body.symbol,
  price: parseFloat(body.price),
  date: headers.date
}))


const login = () => got.post(u, {
  cookieJar,
  responseType: "json",
  form: {
    method: "login_json",
    col_email: process.env.LOGIN,
    col_password: process.env.PASSWORD,
    action: "login",
    sync: 1
  }
})

/*
fastify.after((err) => {
  console.log("AFTER", err)
  return login()
})
*/

/*
.then(({headers, body}) => {
  console.log("HEADERS", headers)
  console.log("BODY", body)
})
.catch(console.error)
*/




// , reply
fastify.get('/', async (request) => {
  if (request.query.to !== process.env.DID) return "ok"
  if (!request.query.from || !request.query.message) return "ok"
  // if (request.query.message.indexOf(" ") !== -1) return "ok"
  if (!/^[A-Z]{4,}$/.test(request.query.message)) return "ok"
  // if (request.ip !== process.env.PROXY) return "ok"
  // console.log("headers", request.headers)
  // console.log("ip", request.ip)
  // console.log("ips", request.ips)
  // console.log("query", JSON.stringify(request.query))
  // reply.send("ok")

  // await login()
  // const resp = await fetchTicker(request.query.message.toUpperCase())
  const [resp] = await Promise.all([fetchTicker(request.query.message), login()])

  // console.log("RESP", resp)

  const contact = request.query.from
  // const msg = "btc test #2 BTCUSDT: 10013.22 (dernier)"
  const msg = `${resp.date}
${resp.symbol}: ${resp.price}`

  // console.log("MES", msg)
  await got.post(u, {
    cookieJar,
    responseType: "json",
    form: {
      method: "send_sms",
      contact,
      did: process.env.DID,
      msg,
      type: 0,
      sync: 1,
    }
  })
  /*
  .then(({headers, body}) => {
    console.log("HEADERS", headers)
    console.log("BODY", body)
  })
  .catch(console.error)
  */

  return "ok"
})


// Run the server!
fastify.listen(3080, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
