import { FastifyInstance } from 'fastify'

import { authenticate } from './routes/authenticate'
import { confirmEmail } from './routes/confirm-email'
import { deleteRoute } from './routes/delete'
import { otherProfile } from './routes/other-profile'
import { profile } from './routes/profile'
import { refresh } from './routes/refresh'
import { register } from './routes/register'
import { resendConfirmation } from './routes/resend-confirmation'
import { sendDeleteMail } from './routes/send-delete-mail'
import { update } from './routes/update'
import { updatePassword } from './routes/update-password'

import { verifyConfirmMail } from '@/http/middlewares/verify-confirm-mail'
import { verifyDeleteMail } from '@/http/middlewares/verify-delete-mail'
import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', register)
  app.post('/resend-confirmation', resendConfirmation)
  app.post('/confirm-email', { onRequest: [verifyConfirmMail] }, confirmEmail)
  app.post('/sessions', authenticate)
  app.post('/delete-mail', { onRequest: [verifyValidUser] }, sendDeleteMail)

  app.get('/', { onRequest: [verifyValidUser] }, profile)
  app.get('/profile/:userId', { onRequest: [verifyValidUser] }, otherProfile)

  app.patch('/', { onRequest: verifyValidUser }, update)
  app.patch('/password', { onRequest: verifyValidUser }, updatePassword)
  app.patch('/token/refresh', refresh)

  app.delete('/', { onRequest: [verifyDeleteMail] }, deleteRoute)
}
