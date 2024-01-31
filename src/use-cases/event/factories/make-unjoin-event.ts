import { UnjoinEventUseCase } from '../unjoin-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeUnjoinEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const participantRepository = new PrismaParticipantRepository()

  const unjoinEventUseCase = new UnjoinEventUseCase(
    eventRepository,
    participantRepository,
  )

  return unjoinEventUseCase
}
