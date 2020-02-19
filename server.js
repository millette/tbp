'use strict'

// npm
const fastify = require('fastify')({
  trustProxy: true,
  logger: true
})

// Declare a route
fastify.get('/', function (request, reply) {
  console.log("headers", request.headers)
  console.log("ip", request.ip)
  console.log("ips", request.ips)
  console.log("query", JSON.stringify(request.query))
  reply.send("ok")
})

// Run the server!
fastify.listen(3080, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
