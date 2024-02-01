import { Prisma } from '@prisma/client'

import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { AppError } from '@/shared/errors/AppError'
import { getGeoLocation } from '@/utils/get-geo-location'

interface UpdateEventUseCaseRequest {
  userId: string
  eventId: string
  data: Prisma.EventUpdateInput
}

export class UpdateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ data, eventId, userId }: UpdateEventUseCaseRequest) {
    const event = await this.eventRepository.getEvent(eventId)
    const existsEvent = await this.eventRepository.getEventByTitle(
      String(data.title),
    )

    const { city, neighborhood, number, street } = data

    const { lat, lon } = await getGeoLocation({
      city: String(city),
      neighborhood: String(neighborhood),
      number: Number(number),
      street: String(street),
    })

    if (!event) {
      throw new AppError(eventErrorsConstants.NOT_FOUND)
    }

    if (existsEvent && existsEvent.id !== event.id) {
      throw new AppError(eventErrorsConstants.EVENT_ALREADY_EXISTS)
    }

    if (event.admin_id !== userId) {
      throw new AppError(eventErrorsConstants.ACTION_NOT_ALLOWED)
    }

    return await this.eventRepository.update(eventId, {
      ...data,
      latitude: lat,
      longitude: lon,
    })
  }
}
