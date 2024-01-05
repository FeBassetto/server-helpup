import { CreateGroupUseCase } from '../create-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeCreateGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()
  const participantRepository = new PrismaParticipantRepository()

  const createGroupUseCase = new CreateGroupUseCase(
    groupRepository,
    participantRepository,
  )

  return createGroupUseCase
}
