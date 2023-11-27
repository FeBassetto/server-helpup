import { env } from '@/env'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'
import { generateDeleteAccountConfirmationHtml } from '@/views/emails/delete-email'

interface SendDeleteUseCaseRequest {
  id: string
  token: string
  deleteData: boolean
}

export class SendDeleteMailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ id, token, deleteData }: SendDeleteUseCaseRequest) {
    const user = await this.usersRepository.findUserById(id)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (user.is_admin) {
      throw new AppError(usersErrorsConstants.ADMIN_NOT_ALLOWED_ACTION)
    }

    const props = {
      link: `${env.BASE_URL}/${env.DELETE_MAIL_URL}/${token}?deleteData=${deleteData}`,
      siteurl: `${env.BASE_URL}`,
      logo: `${env.LOGO_URL}`,
    }

    const html = generateDeleteAccountConfirmationHtml(props)

    await this.mailProvider.sendMail(
      user.email,
      'Confirmação de Deleção de Email',
      html,
    )
  }
}
