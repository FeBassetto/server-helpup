import { GetEventUseCase } from '../get-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeGetEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const participantRepository = new PrismaParticipantRepository()

  const getEventUseCase = new GetEventUseCase(
    eventRepository,
    participantRepository,
  )
  return getEventUseCase
}
