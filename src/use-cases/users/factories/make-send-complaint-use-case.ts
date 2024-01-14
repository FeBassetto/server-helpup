import { SendUserComplaintUseCase } from '../send-complaint'

import { SendinBlueProvider } from '@/shared/providers/MailProvider/implementations/sendin-blue'

export function makeSendComplaintUseCase() {
  const mailProvider = new SendinBlueProvider()

  const useCase = new SendUserComplaintUseCase(mailProvider)

  return useCase
}
