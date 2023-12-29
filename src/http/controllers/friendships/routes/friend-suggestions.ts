import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeGetFriendSuggestionsUseCase } from '@/use-cases/friendships/factories/make-get-friend-suggestions'

export async function friendSuggestions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const getFrienSuggestionsQuerySchema = z.object({
    offset: z.string({
      required_error: 'O campo "offset" é obrigatório.',
    }),
  })

  const { offset } = getFrienSuggestionsQuerySchema.parse(request.query)

  const getFriendSuggestionsUseCase = makeGetFriendSuggestionsUseCase()

  const friendsSuggestions = await getFriendSuggestionsUseCase.execute({
    offset: Number(offset),
    userId: sub,
  })

  reply.status(200).send(friendsSuggestions)
}
