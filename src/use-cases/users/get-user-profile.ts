/* eslint-disable @typescript-eslint/no-unused-vars */
import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.getUserDataById(id)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    const {
      is_deleted,
      is_admin,
      is_confirmed,
      password_hash,
      ...userWithoutSensitiveData
    } = user

    return userWithoutSensitiveData
  }
}
