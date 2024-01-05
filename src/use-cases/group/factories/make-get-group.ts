import { GetGroupUseCase } from '../get-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeGetGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()
  const participantRepository = new PrismaParticipantRepository()

  const getGroupUseCase = new GetGroupUseCase(
    groupRepository,
    participantRepository,
  )

  return getGroupUseCase
}
