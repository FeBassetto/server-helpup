import { EventType } from '@prisma/client'

import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'
import { getGeoLocation } from '@/utils/get-geo-location'

export interface CreateEventPayload {
  title: string
  description: string
  street: string
  number: number
  city: string
  date: Date
  type: EventType
  neighborhood: string
}

export class CreateEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private participantRepository: ParticipantRepository,
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

    const event = await this.eventRepository.create(eventData)

    await this.participantRepository.register({
      user: { connect: { id: userId } },
      event: { connect: { id: event.id } },
    })
  }
}
