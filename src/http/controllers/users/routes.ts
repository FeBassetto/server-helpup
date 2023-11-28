import { FastifyInstance } from 'fastify'

import { authenticate } from './routes/authenticate'
import { confirmEmail } from './routes/confirm-email'
import { deleteRoute } from './routes/delete'
import { profile } from './routes/profile'
import { refresh } from './routes/refresh'
import { register } from './routes/register'
import { resendConfirmation } from './routes/resend-confirmation'
import { sendDeleteMail } from './routes/send-delete-mail'
import { SendFriendShip } from './routes/send-friendship'
import { undoFriendship } from './routes/undo-friendship'
import { updateFriendship } from './routes/update-friendship'

import { verifyConfirmMail } from '@/http/middlewares/verify-confirm-mail'
import { verifyDeleteMail } from '@/http/middlewares/verify-delete-mail'
import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', register)
  app.post('/resend-confirmation', resendConfirmation)
  app.post('/confirm-email', { onRequest: [verifyConfirmMail] }, confirmEmail)
  app.post('/sessions', authenticate)
  app.post('/delete-mail', { onRequest: [verifyValidUser] }, sendDeleteMail)
  app.post('/send-friendship', { onRequest: [verifyValidUser] }, SendFriendShip)

  app.get('/', { onRequest: [verifyValidUser] }, profile)

  app.patch(
    '/friendship-status/:friendshipId',
    { onRequest: [verifyValidUser] },
    updateFriendship,
  )
  app.patch('/token/refresh', refresh)

  app.delete(
    '/undo-friendship/:friendshipId',
    { onRequest: [verifyValidUser] },
    undoFriendship,
  )
  app.delete('/', { onRequest: [verifyDeleteMail] }, deleteRoute)
}
