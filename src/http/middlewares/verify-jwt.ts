import { FastifyRequest } from 'fastify'

import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'

export async function verifyJWT(request: FastifyRequest) {
  if (!request.headers.authorization) {
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }

  try {
    await request.jwtVerify()
  } catch (error) {
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }
}
