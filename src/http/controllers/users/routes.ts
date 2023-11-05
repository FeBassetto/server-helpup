import { FastifyInstance } from 'fastify'
import { authenticate } from './routes/authenticate'
import { register } from './routes/register'
import { confirmEmail } from './routes/confirm-email'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/confirm-email', { onRequest: [verifyJWT] }, confirmEmail)
  app.post('/sessions', { onRequest: [verifyValidUser] }, authenticate)
}
