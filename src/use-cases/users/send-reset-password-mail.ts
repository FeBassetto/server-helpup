import { User } from '@prisma/client'

import { env } from '@/env'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'
import { generateResetPasswordHtml } from '@/views/emails/reset-password'

interface SendResetPasswordMailUseCaseRequest {
  email: string
  token?: string
}

export class SendResetPasswordMailUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({
    email,
    token,
  }: SendResetPasswordMailUseCaseRequest): Promise<User> {
    const user = await this.usersRepository.findUserByEmail(email)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (user.is_admin) {
      throw new AppError(usersErrorsConstants.ADMIN_NOT_ALLOWED_ACTION)
    }

    if (!user.is_confirmed) {
      throw new AppError(usersErrorsConstants.UNCONFIRMED_EMAIL)
    }

    if (!token) {
      return user
    }

    const props = {
      link: `${env.BASE_URL}/${env.RESET_PASSWORD_MAIL_URL}?token=${token}`,
      siteurl: `${env.BASE_URL}`,
      logo: `${env.LOGO_URL}`,
    }

    const html = generateResetPasswordHtml(props)

    await this.mailProvider.sendMail(user.email, 'Redefinição de senha', html)

    return user
  }
}
