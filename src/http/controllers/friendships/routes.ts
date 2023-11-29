import { FastifyInstance } from 'fastify'

import { SendFriendShip } from './routes/send-friendship'
import { undoFriendship } from './routes/undo-friendship'
import { updateFriendship } from './routes/update-friendship'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/send-friendship', { onRequest: [verifyValidUser] }, SendFriendShip)

  app.patch(
    '/friendship-status/:friendshipId',
    { onRequest: [verifyValidUser] },
    updateFriendship,
  )

  app.delete(
    '/undo-friendship/:friendshipId',
    { onRequest: [verifyValidUser] },
    undoFriendship,
  )
}
