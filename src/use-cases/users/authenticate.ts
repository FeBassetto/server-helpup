import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { compare } from 'bcryptjs'
import { usersErrorsConstants } from './errors/constants'

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

    const doesPasswordMatch = await compare(password, user.password_hash)

    if (!doesPasswordMatch) {
      throw new AppError(usersErrorsConstants.INVALID_CREDENTIALS)
    }

    return user
  }
}
