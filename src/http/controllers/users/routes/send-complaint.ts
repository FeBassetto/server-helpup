import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeSendComplaintUseCase } from '@/use-cases/users/factories/make-send-complaint-use-case'

export async function sendComplaint(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    fullName: z.string(),
    phoneNumber: z.string(),
    observations: z.string(),
  })

  const { email, fullName, observations, phoneNumber } =
    authenticateBodySchema.parse(request.body)

  const sendComplaintUseCase = makeSendComplaintUseCase()

  await sendComplaintUseCase.execute({
    email,
    fullName,
    observations,
    phoneNumber,
  })

  reply.send()
}
