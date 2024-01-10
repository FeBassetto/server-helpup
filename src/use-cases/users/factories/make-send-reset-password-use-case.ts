import { SendResetPasswordMailUseCase } from '../send-reset-password-mail'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { SendinBlueProvider } from '@/shared/providers/MailProvider/implementations/sendin-blue'

export function makeSendResetPasswordUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const mailProvider = new SendinBlueProvider()

  const sendResetPassword = new SendResetPasswordMailUseCase(
    usersRepository,
    mailProvider,
  )

  return sendResetPassword
}
