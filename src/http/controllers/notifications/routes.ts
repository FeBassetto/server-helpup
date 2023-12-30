import { FastifyInstance } from 'fastify'

import { wsNotifications } from './routes/ws-notifications'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function notificationsRoutes(app: FastifyInstance) {
  app.get(
    '/ws-notifications',
    { websocket: true, onRequest: verifyValidUser },
    wsNotifications,
  )
}
