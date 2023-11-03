import { FastifyInstance } from 'fastify'

export async function pingRoutes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS-SP' })
  })

  app.post('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS-SP' })
  })

  app.put('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS-SP' })
  })

  app.delete('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS-SP' })
  })

  app.patch('/ping', async (request, reply) => {
    return reply.status(201).send({ status: 'ok', host: 'AWS-SP' })
  })
}
