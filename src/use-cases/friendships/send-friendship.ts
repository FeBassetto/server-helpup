import { usersErrorsConstants } from '../users/errors/constants'

import { friendshipErrorsConstants } from './errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

export interface SendFriendshipUseCaseRequest {
  userId1: string
  userId2: string
}

export class SendFriendshipUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private friendshipsRepository: FriendshipsRepository,
  ) {}

  async execute({ userId1, userId2 }: SendFriendshipUseCaseRequest) {
    const [user1, user2] = await Promise.all([
      this.usersRepository.findUserById(userId1),
      this.usersRepository.findUserById(userId2),
    ])

    if (!user1) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (!user2 || !user2.is_confirmed || user2.is_deleted || user2.is_admin) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_NOT_ALLOWED)
    }

    const existsFriendship =
      await this.friendshipsRepository.getFriendshipByUsersId({
        userId1,
        userId2,
      })

    if (existsFriendship?.isAccepted === true) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_ALREADY_EXISTS)
    }

    if (
      existsFriendship?.isAccepted === false &&
      existsFriendship.userId1 === userId1
    ) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_NOT_ACCEPT)
    }

    if (existsFriendship?.isAccepted === null) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_ALREADY_SENT)
    }

    if (
      existsFriendship?.isAccepted === false &&
      existsFriendship.userId2 === userId1
    ) {
      await this.friendshipsRepository.deleteFriendshipById(existsFriendship.id)
    }

    await this.friendshipsRepository.createFriendship({ userId1, userId2 })
  }
}
