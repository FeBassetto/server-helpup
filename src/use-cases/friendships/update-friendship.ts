import { FastifyInstance } from 'fastify'

import { env } from '@/env'

import { friendshipErrorsConstants } from './errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { NotificationRepository } from '@/repositories/notifications-repository'
import { AppError } from '@/shared/errors/AppError'
import { sendNotificationsUtils } from '@/utils/send-notificaitons'

interface UpdateFriendshipUseCaseRequest {
  friendshipId: string
  userId: string
  accept: boolean
  app: FastifyInstance
}

export class UpdateFriendshipUseCase {
  constructor(
    private friendshipsRepository: FriendshipsRepository,
    private notificationRepository: NotificationRepository,
  ) {}

  async execute({
    accept,
    friendshipId,
    userId,
    app,
  }: UpdateFriendshipUseCaseRequest) {
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

    if (existsFriendShip?.receiverId !== userId) {
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

    if (accept) {
      sendNotificationsUtils({
        app,
        title: `${existsFriendShip.receiverName}`,
        message: 'Solicitação de amizade aceita',
        notificationRepository: this.notificationRepository,
        redirectId: `${env.USERS_REDIRECT_LINK}/${existsFriendShip.receiverId}`,
        type: 'group_created',
        userIds: [existsFriendShip.senderId],
      })
    }
  }
}
