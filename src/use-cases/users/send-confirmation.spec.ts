import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'
import { SendConfirmationUseCase } from './send-confirmation'
import { beforeEach, describe, it } from 'vitest'
import { InMemoryMailProvider } from '@/shared/providers/MailProvider/in-memory/in-memory-mail-provider'

let mailProvider: MailProvider
let sut: SendConfirmationUseCase

describe('Send Confirmation Use Case', () => {
  beforeEach(() => {
    mailProvider = new InMemoryMailProvider()
    sut = new SendConfirmationUseCase(mailProvider)
  })

  it('should be able to send confirmation', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({ email, token: 'randomToken' })
  })
})
