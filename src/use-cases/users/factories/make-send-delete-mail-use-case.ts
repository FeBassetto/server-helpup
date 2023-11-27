import { SendDeleteMailUseCase } from '../send-delete-mail'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { SendinBlueProvider } from '@/shared/providers/MailProvider/implementations/sendin-blue'

export function makeSendDeleteMailUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const mailProvider = new SendinBlueProvider()

  const sendDeleteMail = new SendDeleteMailUseCase(
    usersRepository,
    mailProvider,
  )

  return sendDeleteMail
}
