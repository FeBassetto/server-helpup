import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteGroupUseCase } from '@/use-cases/group/factories/make-delete-group'

export async function deleteGroup(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const deleteParamsSchema = z.object({
    groupId: z.string(),
  })

  const { groupId } = deleteParamsSchema.parse(request.params)

  const deleteGroupUseCase = makeDeleteGroupUseCase()

  await deleteGroupUseCase.execute({ groupId, userId: sub })

  reply.status(204).send()
}
