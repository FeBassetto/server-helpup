import { FastifyInstance } from 'fastify'

import { usersErrorsConstants } from '../users/errors/constants'

import { friendshipErrorsConstants } from './errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { NotificationRepository } from '@/repositories/notifications-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { sendNotificationsUtils } from '@/utils/send-notificaitons'

export interface SendFriendshipUseCaseRequest {
  senderId: string
  receiverId: string
  app: FastifyInstance
}

export class SendFriendshipUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private friendshipsRepository: FriendshipsRepository,
    private notificationRepository: NotificationRepository,
  ) {}

  async execute({ senderId, receiverId, app }: SendFriendshipUseCaseRequest) {
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

    const friendShip = await this.friendshipsRepository.createFriendship({
      senderId,
      receiverId,
      receiverName: receiverUser.name,
      senderName: senderUser.name,
    })

    sendNotificationsUtils({
      app,
      message: 'Enviou um pedido de amizade',
      title: `${senderUser.name}`,
      notificationRepository: this.notificationRepository,
      userIds: [receiverUser?.id],
      redirectId: friendShip.senderId,
      type: 'friendship_invitation',
    })
  }
}
