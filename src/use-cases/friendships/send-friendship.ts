import { usersErrorsConstants } from '../users/errors/constants'

import { friendshipErrorsConstants } from './errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

export interface SendFriendshipUseCaseRequest {
  senderId: string
  receiverId: string
}

export class SendFriendshipUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private friendshipsRepository: FriendshipsRepository,
  ) {}

  async execute({ senderId, receiverId }: SendFriendshipUseCaseRequest) {
    if (senderId === receiverId) {
      throw new AppError(friendshipErrorsConstants.ACTION_NOT_ALLOWED)
    }

    const [senderUser, receiverUser] = await Promise.all([
      this.usersRepository.findUserById(senderId),
      this.usersRepository.findUserById(receiverId),
    ])

    if (!senderUser) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (
      !receiverUser ||
      !receiverUser.is_confirmed ||
      receiverUser.is_deleted ||
      receiverUser.is_admin
    ) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_NOT_ALLOWED)
    }

    const existsFriendship =
      await this.friendshipsRepository.getFriendshipByUsersId({
        userId: senderId,
        friendId: receiverId,
      })

    if (existsFriendship?.isAccepted === true) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_ALREADY_EXISTS)
    }

    if (
      existsFriendship?.isAccepted === false &&
      existsFriendship.senderId === senderId
    ) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_NOT_ACCEPT)
    }

    if (existsFriendship?.isAccepted === null) {
      throw new AppError(friendshipErrorsConstants.FRIENDSHIP_ALREADY_SENT)
    }

    if (
      existsFriendship?.isAccepted === false &&
      existsFriendship.receiverId === senderId
    ) {
      await this.friendshipsRepository.deleteFriendshipById(existsFriendship.id)
    }

    await this.friendshipsRepository.createFriendship({
      senderId,
      receiverId,
      receiverName: receiverUser.name,
      senderName: senderUser.name,
    })
  }
}
