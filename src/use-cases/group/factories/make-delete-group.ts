import { DeleteGroupUseCase } from '../delete-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'

export function makeDeleteGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()

  const deleteGroupUseCase = new DeleteGroupUseCase(groupRepository)

  return deleteGroupUseCase
}
