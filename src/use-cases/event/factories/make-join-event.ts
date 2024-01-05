import { JoinEventUseCase } from '../join-event'

import { PrismaEventRepository } from '@/repositories/prisma/prisma-event-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeJoinEventUseCase() {
  const eventRepository = new PrismaEventRepository()
  const participantRepository = new PrismaParticipantRepository()

  const joinEventUseCase = new JoinEventUseCase(
    eventRepository,
    participantRepository,
  )

  return joinEventUseCase
}
