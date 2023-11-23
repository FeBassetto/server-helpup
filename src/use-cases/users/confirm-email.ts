import { User } from '@prisma/client'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

export class ConfirmEmailUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (user.is_deleted) {
      throw new AppError(usersErrorsConstants.DELETED_USER)
    }

    if (user.is_confirmed) {
      throw new AppError(usersErrorsConstants.ACCOUNT_ALREADY_IS_CONFIRMED)
    }

    const confirmedUser = await this.userRepository.confirmUserEmail(id)

    return confirmedUser
  }
}
