import { DeleteUseCase } from '../delete'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeDeleteUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const deleteUseCase = new DeleteUseCase(usersRepository)

  return deleteUseCase
}
