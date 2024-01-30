import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeCreateGroupUseCase } from '@/use-cases/group/factories/make-create-group'

export async function createGroup(
  this: FastifyInstance,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const createBodySchema = z.object({
    title: z
      .string()
      .min(4, 'O título deve ter pelo menos 4 caracteres.')
      .max(60, 'O título não pode exceder 60 caracteres.'),
    description: z
      .string()
      .min(4, 'A descrição deve ter pelo menos 4 caracteres.')
      .max(100, 'A descrição não pode exceder 100 caracteres.'),
  })

  const { description, title } = createBodySchema.parse(request.body)

  const createGroupUseCase = makeCreateGroupUseCase()

  await createGroupUseCase.execute(
    {
      adminId: { connect: { id: sub } },
      description,
      title,
      city: '',
    },
    sub,
    this,
  )

  return reply.status(200).send()
}
