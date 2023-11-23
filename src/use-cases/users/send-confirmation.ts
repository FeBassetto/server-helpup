import { env } from '@/env'

import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'
import { generateConfirmationEmailHtml } from '@/views/emails/confirm-email'

interface SendConfirmationUseCaseRequest {
  email: string
  token: string
}

export class SendConfirmationUseCase {
  constructor(private mailProvider: MailProvider) {}

  async execute({ email, token }: SendConfirmationUseCaseRequest) {
    const props = {
      link: `${env.BASE_URL}/${env.CONFIRM_MAIL_URL}/${token}`,
      siteurl: `${env.BASE_URL}`,
      logo: `${env.LOGO_URL}`,
    }

    const html = generateConfirmationEmailHtml(props)

    await this.mailProvider.sendMail(email, 'Confirmação de email', html)
  }
}
