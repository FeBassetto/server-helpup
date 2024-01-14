import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetFriendSuggestionsUseCase } from '@/use-cases/friendships/factories/make-get-friend-suggestions'

export async function friendSuggestions(
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

  const getFriendSuggestionsUseCase = makeGetFriendSuggestionsUseCase()

  const friendsSuggestions = await getFriendSuggestionsUseCase.execute({
    offset,
    userId: sub,
    query,
  })

  reply.status(200).send(friendsSuggestions)
}
