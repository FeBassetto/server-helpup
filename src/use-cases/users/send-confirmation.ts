import { env } from '@/env'
import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'
import { resolve } from 'path'

interface SendConfirmationUseCaseRequest {
  email: string
  token: string
}

export class SendConfirmationUseCase {
  constructor(private mailProvider: MailProvider) {}

  async execute({ email, token }: SendConfirmationUseCaseRequest) {
    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'confirm-email.hbs',
    )

    const variables = {
      link: `${env.BASE_URL}/${env.CONFIRM_MAIL_URL}/${token}`,
      siteurl: `${env.BASE_URL}`,
      logo: `${env.LOGO_URL}`,
    }

    await this.mailProvider.sendMail(
      email,
      'Confirmação de email',
      variables,
      templatePath,
    )
  }
}
