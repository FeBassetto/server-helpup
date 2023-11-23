import { ConfirmEmailUseCase } from '../confirm-email'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeConfirmEmailUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const confirmEmailUseCase = new ConfirmEmailUseCase(usersRepository)

  return confirmEmailUseCase
}
