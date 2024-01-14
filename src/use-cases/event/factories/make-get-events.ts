import { GetEventsUseCase } from '../get-events'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetEventsUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const eventsRepository = new PrismaEventRepository()

  const useCase = new GetEventsUseCase(usersRepository, eventsRepository)

  return useCase
}
