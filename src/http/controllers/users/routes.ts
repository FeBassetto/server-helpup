import { FastifyInstance } from 'fastify'

import { authenticate } from './routes/authenticate'
import { confirmEmail } from './routes/confirm-email'
import { register } from './routes/register'
import { resendConfirmation } from './routes/resend-confirmation'

import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', register)
  app.post('/resend-confirmation', resendConfirmation)
  app.post('/confirm-email', { onRequest: [verifyJWT] }, confirmEmail)
  app.post('/sessions', authenticate)
}
