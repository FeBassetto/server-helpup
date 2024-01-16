import { FastifyRequest } from 'fastify'

import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from '@/use-cases/users/errors/constants'

export async function verifyDeleteMail(request: FastifyRequest) {
  if (!request.headers.authorization) {
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }

  try {
    await request.jwtVerify()
  } catch (error) {
    console.error(error)
    throw new AppError(usersErrorsConstants.EXPIRED_TOKEN)
  }

  if (!request.user.isDeleteMail) {
    throw new AppError(usersErrorsConstants.UNAUTHORIZED)
  }

  if (!request.user.isConfirmed) {
    throw new AppError(usersErrorsConstants.UNCONFIRMED_EMAIL)
  }

  if (request.user.isDeleted) {
    throw new AppError(usersErrorsConstants.DELETED_USER)
  }
}
