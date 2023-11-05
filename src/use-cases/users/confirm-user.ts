import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { User } from '@prisma/client'
import { usersErrorsConstants } from './errors/constants'

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

    const confirmedUser = await this.userRepository.confirmUserEmail(id)

    return confirmedUser
  }
}
