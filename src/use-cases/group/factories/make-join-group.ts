import { JoinGroupUseCase } from '../join-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'

export function makeJoinGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()
  const participantRepository = new PrismaParticipantRepository()

  const joinGroupRepository = new JoinGroupUseCase(
    groupRepository,
    participantRepository,
  )

  return joinGroupRepository
}
