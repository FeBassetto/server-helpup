import { CreateEventUseCase } from '../create-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeCreateEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const participantRepository = new PrismaParticipantRepository()

  const createEventRepository = new CreateEventUseCase(
    eventRepository,
    participantRepository,
  )

  return createEventRepository
}
