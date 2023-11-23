import { FastifyReply, FastifyRequest } from 'fastify'

import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'

export async function verifyValidUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify()
  } catch (error) {
    console.error(error)
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  if (!request.user.isConfirmed) {
    throw new AppError(usersErrorsConstants.UNCONFIRMED_EMAIL)
  }

  if (request.user.isDeleted) {
    throw new AppError(usersErrorsConstants.DELETED_USER)
  }
}
