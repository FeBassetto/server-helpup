import { SendConfirmationUseCase } from '../send-confirmation'

import { SendinBlueProvider } from '@/shared/providers/MailProvider/implementations/sendin-blue'

export function makeSendConfirmationUseCase() {
  const sendinBlueProvider = new SendinBlueProvider()
  const sendConfirmationUseCase = new SendConfirmationUseCase(
    sendinBlueProvider,
  )

  return sendConfirmationUseCase
}
