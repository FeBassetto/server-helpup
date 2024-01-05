import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeJoinGroupUseCase } from '@/use-cases/group/factories/make-join-group'

export async function joinGroup(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  const joinGroupParamsSchema = z.object({
    groupId: z.string(),
  })

  const { groupId } = joinGroupParamsSchema.parse(request.params)

  const joinGroupUseCase = makeJoinGroupUseCase()

  await joinGroupUseCase.execute(sub, groupId)

  reply.send()
}
