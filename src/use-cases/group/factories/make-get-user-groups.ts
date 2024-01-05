import { GetUserGroupsUseCase } from '../get-user-groups'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'

export function makeGetUserGroupsUseCase() {
  const groupRepository = new PrismaGroupRepository()

  const getUserGroupsUseCase = new GetUserGroupsUseCase(groupRepository)

  return getUserGroupsUseCase
}
