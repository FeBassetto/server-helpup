import { MailProvider } from '../mail-provider'
import nodemailer, { Transporter } from 'nodemailer'
import fs from 'fs'
import handlebars from 'handlebars'
import { AppError } from '@/shared/errors/AppError'
import { env } from '@/env'
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

  async sendMail(
    to: string,
    subject: string,
    variables: object,
    path: string,
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    await this.client.sendMail({
      to,
      from: 'HelpUp <noreplay@helpup.com.br>',
      subject,
      html: templateHTML,
    })
  }
}
