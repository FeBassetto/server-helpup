import { UpdatePasswordUseCase } from '../update-password'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeUpdatePasswordUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const updatePasswordUseCase = new UpdatePasswordUseCase(usersRepository)

  return updatePasswordUseCase
}
