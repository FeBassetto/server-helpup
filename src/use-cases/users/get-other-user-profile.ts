/* eslint-disable @typescript-eslint/no-unused-vars */
import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface GetOtherUserProfileUseCaseRequest {
  id: string
  userId: string
}

export class GetOtherUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id, userId }: GetOtherUserProfileUseCaseRequest) {
    if (id === userId) {
      throw new AppError(usersErrorsConstants.GET_SAME_ACCOUNT_DATA)
    }

    const [me, user] = await Promise.all([
      this.usersRepository.getUserDataById(id),
      this.usersRepository.getUserDataById(userId),
    ])

    if (!me) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (!user || user.is_deleted || !user.is_confirmed) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    const {
      is_deleted,
      is_admin,
      is_confirmed,
      password_hash,
      email,
      longitude,
      latitude,
      cep,
      ...userWithoutSensitiveData
    } = user

    return userWithoutSensitiveData
  }
}
