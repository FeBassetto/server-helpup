import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { ResendConfirmationUseCase } from '../resend-confirmation'

export function makeResendConfirmationUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const resendConfirmationUseCase = new ResendConfirmationUseCase(
    usersRepository,
  )

  return resendConfirmationUseCase
}
