import { FastifyReply, FastifyRequest } from 'fastify'

import { makeConfirmEmailUseCase } from '@/use-cases/users/factories/make-confirm-user-use-case'

export async function confirmEmail(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.sub

  const confirmEmailUseCase = makeConfirmEmailUseCase()

  const user = await confirmEmailUseCase.execute(userId)

  const token = await reply.jwtSign(
    {
      isAdmin: user.is_admin,
      isConfirmed: user.is_confirmed,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      isAdmin: user.is_admin,
      isConfirmed: user.is_confirmed,
    },
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
