import { FastifyInstance } from 'fastify'

import { friendInvitations } from './routes/friend-invitations'
import { friendSuggestions } from './routes/friend-suggestions'
import { getMeFriendships } from './routes/get-me-friendships'
import { SendFriendShip } from './routes/send-friendship'
import { undoFriendship } from './routes/undo-friendship'
import { updateFriendship } from './routes/update-friendship'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function friendshipsRoutes(app: FastifyInstance) {
  app.get('/me', { preHandler: [verifyValidUser] }, getMeFriendships)
  app.get('/suggestions', { preHandler: [verifyValidUser] }, friendSuggestions)

  app.get('/invites', { preHandler: [verifyValidUser] }, friendInvitations)

  app.post('/send', { onRequest: [verifyValidUser] }, SendFriendShip)

  app.patch(
    '/status/:friendshipId',
    { onRequest: [verifyValidUser] },
    updateFriendship,
  )

  app.delete(
    '/undo/:friendshipId',
    { onRequest: [verifyValidUser] },
    undoFriendship,
  )
}
