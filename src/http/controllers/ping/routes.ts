import { FastifyInstance } from 'fastify'

export async function pingRoutes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    return reply
      .status(201)
      .send({ status: 'ok', host: 'AWS-SP', version: '1.0.0' })
  })

  app.post('/ping', async (request, reply) => {
    return reply
      .status(201)
      .send({ status: 'ok', host: 'AWS-SP', version: '1.0.0' })
  })

  app.put('/ping', async (request, reply) => {
    return reply
      .status(201)
      .send({ status: 'ok', host: 'AWS-SP', version: '1.0.0' })
  })

  app.delete('/ping', async (request, reply) => {
    return reply
      .status(201)
      .send({ status: 'ok', host: 'AWS-SP', version: '1.0.0' })
  })

  app.patch('/ping', async (request, reply) => {
    return reply
      .status(201)
      .send({ status: 'ok', host: 'AWS-SP', version: '1.0.0' })
  })
}
