import { FastifyRequest } from 'fastify'

import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'

export async function verifyConfirmMail(request: FastifyRequest) {
  if (!request.headers.authorization) {
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }

  try {
    await request.jwtVerify()
  } catch (error) {
    console.error(error)
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }

  if (!request.user.isConfirmMail) {
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }
}
