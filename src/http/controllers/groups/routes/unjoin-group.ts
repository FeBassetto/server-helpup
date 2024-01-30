import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUnjoinGroupUseCase } from '@/use-cases/group/factories/make-unjoin-group'

export async function unjoinGroup(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const unjoinGroupParamsSchema = z.object({
    groupId: z.string(),
  })

  const { groupId } = unjoinGroupParamsSchema.parse(request.params)

  const unjoinGroupUseCase = makeUnjoinGroupUseCase()

  await unjoinGroupUseCase.execute(sub, groupId)

  reply.send()
}
