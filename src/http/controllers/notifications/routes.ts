import { FastifyInstance } from 'fastify'

import { getNotifications } from './routes/get-notifications'
import { markNotificationRead } from './routes/mark-notification-read'
import { wsNotifications } from './routes/ws-notifications'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function notificationsRoutes(app: FastifyInstance) {
  app.get('/', { onRequest: verifyValidUser }, getNotifications)

  app.get(
    '/ws-notifications',
    { websocket: true, onRequest: verifyValidUser },
    wsNotifications,
  )

  app.post('/read', { onRequest: verifyValidUser }, markNotificationRead)
}
