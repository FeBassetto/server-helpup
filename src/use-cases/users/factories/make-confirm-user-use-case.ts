import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ConfirmEmailUseCase } from '../confirm-email'

export function makeConfirmEmailUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const confirmEmailUseCase = new ConfirmEmailUseCase(usersRepository)

  return confirmEmailUseCase
}
