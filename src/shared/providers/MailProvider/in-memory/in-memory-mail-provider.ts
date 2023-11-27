import { MailProvider } from '../mail-provider'

export class InMemoryMailProvider implements MailProvider {
  private messages: unknown[] = []

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    await this.messages.push({ to, subject, html })
  }
}
