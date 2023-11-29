import { FastifyInstance } from 'fastify'

import { friendSuggestions } from './routes/friend-suggestions'
import { SendFriendShip } from './routes/send-friendship'
import { undoFriendship } from './routes/undo-friendship'
import { updateFriendship } from './routes/update-friendship'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function friendshipsRoutes(app: FastifyInstance) {
  app.get(
    '/friend-suggestions',
    { preHandler: [verifyValidUser] },
    friendSuggestions,
  )

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
