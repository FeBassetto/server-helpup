import { GetGroupsUseCase } from '../get-groups'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetGroupsUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const groupsRepository = new PrismaGroupRepository()

  const useCase = new GetGroupsUseCase(usersRepository, groupsRepository)

  return useCase
}
