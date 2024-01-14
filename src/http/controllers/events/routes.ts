import { FastifyInstance } from 'fastify'

import { createEvent } from './routes/create-event'
import { deleteEvent } from './routes/delete-event'
import { getEvent } from './routes/get-event'
import { getEvents } from './routes/get-events'
import { getMeEvents } from './routes/get-me-events'
import { joinEvent } from './routes/join-event'
import { updateEvent } from './routes/update-event'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function eventsRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: [verifyValidUser] }, createEvent)
  app.post('/join/:eventId', { onRequest: [verifyValidUser] }, joinEvent)

  app.get('/', { onRequest: [verifyValidUser] }, getEvents)
  app.get('/me', { onRequest: [verifyValidUser] }, getMeEvents)
  app.get('/:eventId', { onRequest: [verifyValidUser] }, getEvent)

  app.patch('/:eventId', { onRequest: [verifyValidUser] }, updateEvent)

  app.delete('/:eventId', { onRequest: [verifyValidUser] }, deleteEvent)
}
