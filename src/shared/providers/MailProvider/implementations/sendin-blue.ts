import nodemailer, { Transporter } from 'nodemailer'

import { env } from '@/env'

import { MailProvider } from '../mail-provider'

import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'

export class SendinBlueProvider implements MailProvider {
  private client!: Transporter

  constructor() {
    try {
      const transporter = nodemailer.createTransport({
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        auth: {
          user: env.MAIL_USER,
          pass: env.MAIL_PASS,
        },
      })

      this.client = transporter
    } catch (error) {
      console.error(error)

      throw new AppError(usersErrorsConstants.SEND_EMAIL_FAILED)
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    if (env.NODE_ENV === 'test') return

    await this.client.sendMail({
      to,
      from: 'HelpUp <noreplay@helpup.com.br>',
      subject,
      html,
    })
  }
}
