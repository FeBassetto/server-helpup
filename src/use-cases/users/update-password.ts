import { compare, hash } from 'bcryptjs'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface UpdatePasswordUseCaseRequest {
  userId: string
  password: string
}

export class UpdatePasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ password, userId }: UpdatePasswordUseCaseRequest) {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    const password_hash = await hash(password, 6)
    const isSamePassword = await compare(password, user.password_hash)

    if (isSamePassword) {
      throw new AppError(usersErrorsConstants.SAME_PASSWORD)
    }

    await this.usersRepository.updatePassword({ password_hash, userId })
  }
}
