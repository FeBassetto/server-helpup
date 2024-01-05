import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateGroupUseCase } from '@/use-cases/group/factories/make-update-group'

export async function updateGroup(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const updateBodySchema = z.object({
    title: z
      .string()
      .min(4, 'O título deve ter pelo menos 4 caracteres.')
      .max(60, 'O título não pode exceder 60 caracteres.'),
    description: z
      .string()
      .min(4, 'A descrição deve ter pelo menos 4 caracteres.')
      .max(100, 'A descrição não pode exceder 100 caracteres.'),
    city: z.string(),
  })

  const data = updateBodySchema.parse(request.body)

  const updateParamsSchema = z.object({
    groupId: z.string(),
  })

  const { groupId } = updateParamsSchema.parse(request.params)

  const updateGroupUseCase = makeUpdateGroupUseCase()

  const group = await updateGroupUseCase.execute({ data, groupId, userId: sub })

  reply.send(group)
}
