import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface UpdateFriendshipUseCaseRequest {
  friendshipId: string
  userId: string
  accept: boolean
}

export class UpdateFriendshipUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    accept,
    friendshipId,
    userId,
  }: UpdateFriendshipUseCaseRequest) {
    const existsFriendShip =
      await this.usersRepository.getFriendShipById(friendshipId)

    if (!existsFriendShip) {
      throw new AppError(usersErrorsConstants.FRIENDSHIP_NOT_EXISTS)
    }

    if (
      existsFriendShip?.userId1 !== userId &&
      existsFriendShip?.userId2 !== userId
    ) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (existsFriendShip?.userId2 !== userId) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED_FRIENDSHIP)
    }

    if (existsFriendShip.isAccepted !== null) {
      throw new AppError(usersErrorsConstants.FRIENDSHIP_STATUS_ALREADY_UPDATED)
    }

    await this.usersRepository.updateFriendshipById(
      {
        isAccepted: accept,
      },
      friendshipId,
    )
  }
}
