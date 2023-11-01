import { FastifyInstance } from 'fastify'
import { authenticate } from './routes/authenticate'
import { register } from './routes/register'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
