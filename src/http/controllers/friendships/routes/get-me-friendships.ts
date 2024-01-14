import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetMeFriendshipsUseCase } from '@/use-cases/friendships/factories/make-get-me-friendships'

export async function getMeFriendships(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getFrienSuggestionsQuerySchema = z.object({
    offset: z.coerce.number({
      required_error: 'O campo "offset" é obrigatório.',
    }),
    query: z.string().optional(),
  })

  const { offset, query } = getFrienSuggestionsQuerySchema.parse(request.query)

  const getMeFriendshipsUseCase = makeGetMeFriendshipsUseCase()

  const friendships = await getMeFriendshipsUseCase.execute(sub, offset, query)

  reply.send(friendships)
}
