import { FastifyInstance } from 'fastify'

import { createGroup } from './routes/create-group'
import { deleteGroup } from './routes/delete-group'
import { getGroup } from './routes/get-group'
import { joinGroup } from './routes/join-group'
import { updateGroup } from './routes/update-group'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function groupsRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: [verifyValidUser] }, createGroup)
  app.post('/join/:groupId', { onRequest: [verifyValidUser] }, joinGroup)

  app.get('/:groupId', { onRequest: [verifyValidUser] }, getGroup)

  app.patch('/:groupId', { onRequest: [verifyValidUser] }, updateGroup)

  app.delete('/:groupId', { onRequest: [verifyValidUser] }, deleteGroup)
}
