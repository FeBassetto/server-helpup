import { FastifyInstance } from 'fastify'
import { authenticate } from './routes/authenticate'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticate)
}
