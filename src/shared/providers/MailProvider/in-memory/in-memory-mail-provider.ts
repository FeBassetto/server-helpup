import { MailProvider } from '../mail-provider'

export class InMemoryMailProvider implements MailProvider {
  private messages: unknown[] = []

  async sendMail(
    to: string,
    subject: string,
    variables: object,
    path: string,
  ): Promise<void> {
    this.messages.push({ to, subject, variables, path })
  }
}
