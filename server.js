'use strict'

// npm
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/:path', function (request, reply) {
  console.log("headers", request.headers)
  console.log("path", request.params.path)
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
