import { FastifyInstance } from 'fastify'

import { authenticate } from './routes/authenticate'
import { confirmEmail } from './routes/confirm-email'
import { deleteRoute } from './routes/delete'
import { profile } from './routes/profile'
import { register } from './routes/register'
import { resendConfirmation } from './routes/resend-confirmation'
import { sendDeleteMail } from './routes/send-delete-mail'

import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', register)
  app.post('/resend-confirmation', resendConfirmation)
  app.post('/confirm-email', { onRequest: [verifyJWT] }, confirmEmail)
  app.post('/sessions', authenticate)
  app.post('/delete-mail', { onRequest: [verifyValidUser] }, sendDeleteMail)

  app.get('/', { onRequest: [verifyValidUser] }, profile)

  app.delete('/', { onRequest: [verifyValidUser] }, deleteRoute)
}
