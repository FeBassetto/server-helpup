import { SendinBlueProvider } from '@/shared/providers/MailProvider/implementations/sendin-blue'
import { SendConfirmationUseCase } from '../send-confirmation'

export function makeSendConfirmationUseCase() {
  const sendinBlueProvider = new SendinBlueProvider()
  const sendConfirmationUseCase = new SendConfirmationUseCase(
    sendinBlueProvider,
  )

  return sendConfirmationUseCase
}
