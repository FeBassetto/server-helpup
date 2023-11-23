import { ResendConfirmationUseCase } from '../resend-confirmation'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeResendConfirmationUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const resendConfirmationUseCase = new ResendConfirmationUseCase(
    usersRepository,
  )

  return resendConfirmationUseCase
}
