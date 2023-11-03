import { FastifyInstance } from 'fastify'

export async function pingRoutes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS' })
  })

  app.post('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS' })
  })

  app.put('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS' })
  })

  app.delete('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS' })
  })

  app.patch('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS' })
  })
}
