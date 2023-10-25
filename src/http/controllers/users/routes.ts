import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/hello-world', (request, reply) => {
    return reply.status(201).send('Hello World3')
  })
}
