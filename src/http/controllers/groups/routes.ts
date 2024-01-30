import { FastifyInstance } from 'fastify'

import { createGroup } from './routes/create-group'
import { deleteGroup } from './routes/delete-group'
import { getGroup } from './routes/get-group'
import { getGroups } from './routes/get-groups'
import { getMeGroups } from './routes/get-me-groups'
import { joinGroup } from './routes/join-group'
import { unjoinGroup } from './routes/unjoin-group'
import { updateGroup } from './routes/update-group'

import { verifyValidUser } from '@/http/middlewares/verify-valid-user'

export async function groupsRoutes(app: FastifyInstance) {
  app.post('/', { onRequest: [verifyValidUser] }, createGroup)
  app.post('/join/:groupId', { onRequest: [verifyValidUser] }, joinGroup)
  app.post('/unjoin/:groupId', { onRequest: [verifyValidUser] }, unjoinGroup)

  app.get('/', { onRequest: [verifyValidUser] }, getGroups)
  app.get('/me', { onRequest: [verifyValidUser] }, getMeGroups)
  app.get('/:groupId', { onRequest: [verifyValidUser] }, getGroup)

  app.patch('/:groupId', { onRequest: [verifyValidUser] }, updateGroup)

  app.delete('/:groupId', { onRequest: [verifyValidUser] }, deleteGroup)
}
