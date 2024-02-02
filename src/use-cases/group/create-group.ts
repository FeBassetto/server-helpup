import { FastifyInstance } from 'fastify'

import { Prisma } from '@prisma/client'

import { usersErrorsConstants } from '../users/errors/constants'

import { groupErrorsConstants } from './errors/constants'

import { GroupRepository } from '@/repositories/groups-repository'
import { NotificationRepository } from '@/repositories/notifications-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { sendNotificationsUtils } from '@/utils/send-notificaitons'

export class CreateGroupUseCase {
  constructor(
    private groupRepository: GroupRepository,
    private participantRepository: ParticipantRepository,
    private usersRepository: UsersRepository,
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(
    data: Prisma.GroupCreateInput,
    userId: string,
    app: FastifyInstance,
  ) {
    const existsGroup = await this.groupRepository.getByTitle(data.title)

    if (existsGroup) {
      throw new AppError(groupErrorsConstants.GROUP_ALREADY_EXISTS)
    }

    const user = await this.usersRepository.getUserDataById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED)
    }

    data.city = user.city

    const notificationUsers = await this.usersRepository.getUsersByDistance(
      Number(user.latitude),
      Number(user.longitude),
      100,
    )

    const group = await this.groupRepository.create(data)

    const userIds = notificationUsers
      .map((user) => {
        if (user.id !== group.admin_id) {
          return user.id
        }

        return 'null'
      })
      .filter((id) => id !== 'null')

    await this.participantRepository.register({
      user: { connect: { id: userId } },
      group: { connect: { id: group.id } },
    })

    sendNotificationsUtils({
      app,
      title: `${data.title}`,
      message: 'Grupo criado na sua região',
      notificationRepository: this.notificationRepository,
      redirectId: group.id,
      type: 'group_created',
      userIds,
    })
  }
}
