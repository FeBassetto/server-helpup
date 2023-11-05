import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ConfirmEmailUseCase } from '../confirm-user'

export function makeConfirmEmailUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const confirmEmailUseCase = new ConfirmEmailUseCase(usersRepository)

  return confirmEmailUseCase
}
