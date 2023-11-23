export interface MailProvider {
  sendMail(
    to: string,
    subject: string,
    variables: object,
    path: string,
  ): Promise<void>
}
