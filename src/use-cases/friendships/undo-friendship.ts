import { friendshipErrorsConstants } from './errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { AppError } from '@/shared/errors/AppError'

interface UndoFriendshipUseCaseRequest {
  friendshipId: string
  userId: string
}

export class UndoFriendshipUseCase {
  constructor(private friendshipsRepository: FriendshipsRepository) {}

  async execute({ friendshipId, userId }: UndoFriendshipUseCaseRequest) {
    const existsFriendShip =
      await this.friendshipsRepository.getFriendShipById(friendshipId)

    if (!existsFriendShip) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_NOT_EXISTS)
    }

    if (
      existsFriendShip?.senderId !== userId &&
      existsFriendShip?.receiverId !== userId
    ) {
      throw new AppError(friendshipErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (
      existsFriendShip.receiverId === userId &&
      existsFriendShip.isAccepted !== true
    ) {
      throw new AppError(friendshipErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (
      existsFriendShip.senderId === userId &&
      existsFriendShip.isAccepted === false
    ) {
      throw new AppError(friendshipErrorsConstants.ACTION_NOT_ALLOWED)
    }

    await this.friendshipsRepository.deleteFriendshipById(friendshipId)
  }
}
