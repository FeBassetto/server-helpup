import { UnjoinGroupUseCase } from '../unjoin-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeUnjoinGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()
  const participantRepository = new PrismaParticipantRepository()

  const joinGroupRepository = new UnjoinGroupUseCase(
    groupRepository,
    participantRepository,
  )

  return joinGroupRepository
}
