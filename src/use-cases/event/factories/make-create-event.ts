import { CreateEventUseCase } from '../create-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeCreateEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const participantRepository = new PrismaParticipantRepository()
  const userRepository = new PrismaUsersRepository()
  const notificationRepository = new PrismaNotificationRepository()

  const createEventRepository = new CreateEventUseCase(
    eventRepository,
    participantRepository,
    userRepository,
    notificationRepository,
  )

  return createEventRepository
}
