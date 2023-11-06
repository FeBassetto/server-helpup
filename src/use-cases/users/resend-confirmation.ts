import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { usersErrorsConstants } from './errors/constants'

export class ResendConfirmationUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(email: string) {
    const user = await this.usersRepository.findUserByEmail(email)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (user.is_deleted) {
      throw new AppError(usersErrorsConstants.DELETED_USER)
    }

    if (user.is_confirmed) {
      throw new AppError(usersErrorsConstants.ACCOUNT_ALREADY_IS_CONFIRMED)
    }

    const lastThirtyMinutesConfirmationCodes =
      await this.usersRepository.getConfirmationCodeByMinutes({
        minutes: 30,
        userId: user.id,
      })

    if (lastThirtyMinutesConfirmationCodes.length === 3) {
      throw new AppError(usersErrorsConstants.MANY_ATTEMPTS)
    }

    await this.usersRepository.createConfirmationCode(user.id)

    return user
  }
}
