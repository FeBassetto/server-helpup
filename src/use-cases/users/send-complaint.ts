import { env } from '@/env'

import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'
import { generateUserComplaintEmailHtml } from '@/views/emails/user-complaint'

interface SendUserComplaintUseCaseRequest {
  fullName: string
  email: string
  phoneNumber: string
  observations: string
}

export class SendUserComplaintUseCase {
  constructor(private mailProvider: MailProvider) {}

  async execute({
    email,
    fullName,
    observations,
    phoneNumber,
  }: SendUserComplaintUseCaseRequest) {
    const html = generateUserComplaintEmailHtml({
      email,
      fullName,
      logo: env.LOGO_URL,
      observations,
      phoneNumber,
      siteurl: env.BASE_URL,
    })

    await this.mailProvider.sendMail(
      env.ADMIN_MAIL,
      `Observações do usuário ${fullName}`,
      html,
    )
  }
}
