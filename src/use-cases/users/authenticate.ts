import { compare } from 'bcryptjs'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest) {
    const user = await this.usersRepository.findUserByEmail(email)

    if (!user) {
      throw new AppError(usersErrorsConstants.INVALID_CREDENTIALS)
    }

    if (user.is_deleted) {
      throw new AppError(usersErrorsConstants.DELETED_USER)
    }

    if (!user.is_confirmed) {
      throw new AppError(usersErrorsConstants.UNCONFIRMED_EMAIL)
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new AppError(usersErrorsConstants.INVALID_CREDENTIALS)
    }

    return user
  }
}
