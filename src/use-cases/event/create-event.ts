import { FastifyInstance } from 'fastify'

import { EventType } from '@prisma/client'

import { usersErrorsConstants } from '../users/errors/constants'

import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { NotificationRepository } from '@/repositories/notifications-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { getGeoLocation } from '@/utils/get-geo-location'
import { sendNotificationsUtils } from '@/utils/send-notificaitons'

export interface CreateEventPayload {
  title: string
  description: string
  street: string
  number: number
  city: string
  date: Date
  type: EventType
  neighborhood: string
  app: FastifyInstance
}

export class CreateEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private participantRepository: ParticipantRepository,
    private usersRepository: UsersRepository,
    private notificationRepository: NotificationRepository,
  ) {}

  async execute(
    {
      city,
      date,
      description,
      number,
      street,
      title,
      type,
      neighborhood,
      app,
    }: CreateEventPayload,
    userId: string,
    groupId?: string,
  ) {
    const eventExists = await this.eventRepository.getEventByTitle(title)

    if (eventExists) {
      throw new AppError(eventErrorsConstants.EVENT_ALREADY_EXISTS)
    }

    const { lat, lon } = await getGeoLocation({
      city,
      neighborhood,
      number,
      street,
    })

    const eventData = {
      city,
      date,
      description,
      number,
      street,
      neighborhood,
      title,
      type,
      latitude: lat,
      longitude: lon,
      adminId: { connect: { id: userId } },
      ...(groupId ? { groupId: { connect: { id: groupId } } } : {}),
    }

    const user = await this.usersRepository.getUserDataById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACTION_NOT_ALLOWED)
    }

    const notificationUsers = await this.usersRepository.getUsersByDistance(
      Number(lat),
      Number(lon),
      100,
    )

    const event = await this.eventRepository.create(eventData)

    const userIds = notificationUsers
      .map((user) => {
        if (user.id !== event.admin_id) {
          return user.id
        }

        return 'null'
      })
      .filter((id) => id !== 'null')

    await this.participantRepository.register({
      user: { connect: { id: userId } },
      event: { connect: { id: event.id } },
    })

    sendNotificationsUtils({
      app,
      title: `${event.title}`,
      message: 'Evento criado na sua região',
      notificationRepository: this.notificationRepository,
      redirectId: event.id,
      type: 'event_created',
      userIds,
    })
  }
}
