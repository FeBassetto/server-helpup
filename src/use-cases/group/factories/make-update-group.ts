import { UpdateGroupUseCase } from '../update-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'

export function makeUpdateGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()

  const updateGroupsUseCase = new UpdateGroupUseCase(groupRepository)

  return updateGroupsUseCase
}
