import { friendshipErrorsConstants } from './errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { AppError } from '@/shared/errors/AppError'

interface UpdateFriendshipUseCaseRequest {
  friendshipId: string
  userId: string
  accept: boolean
}

export class UpdateFriendshipUseCase {
  constructor(private friendshipsRepository: FriendshipsRepository) {}

  async execute({
    accept,
    friendshipId,
    userId,
  }: UpdateFriendshipUseCaseRequest) {
    const existsFriendShip =
      await this.friendshipsRepository.getFriendShipById(friendshipId)

    if (!existsFriendShip) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_NOT_EXISTS)
    }

    if (
      existsFriendShip?.userId1 !== userId &&
      existsFriendShip?.userId2 !== userId
    ) {
      throw new AppError(friendshipErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (existsFriendShip?.userId2 !== userId) {
      throw new AppError(friendshipErrorsConstants.ACTION_NOT_ALLOWED)
    }

    if (existsFriendShip.isAccepted !== null) {
      throw new AppError(
        friendshipErrorsConstants.FRIENDSHIP_STATUS_ALREADY_UPDATED,
      )
    }

    await this.friendshipsRepository.updateFriendshipById(
      {
        isAccepted: accept,
      },
      friendshipId,
    )
  }
}
