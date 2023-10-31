import { FastifyInstance } from 'fastify'

export async function pingRoutes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok' })
  })

  app.post('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok' })
  })

  app.put('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok' })
  })

  app.delete('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok' })
  })

  app.patch('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok' })
  })
}
