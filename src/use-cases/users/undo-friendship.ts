import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface UndoFriendshipUseCaseRequest {
  friendshipId: string
  userId: string
}

export class UndoFriendshipUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ friendshipId, userId }: UndoFriendshipUseCaseRequest) {
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

    if (
      existsFriendShip.userId2 === userId &&
      existsFriendShip.isAccepted !== true
    ) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED_FRIENDSHIP)
    }

    if (
      existsFriendShip.userId1 === userId &&
      existsFriendShip.isAccepted === false
    ) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED_FRIENDSHIP)
    }

    await this.usersRepository.deleteFriendshipById(friendshipId)
  }
}
