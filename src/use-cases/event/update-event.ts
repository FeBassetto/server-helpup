import { Prisma } from '@prisma/client'

import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { AppError } from '@/shared/errors/AppError'

interface UpdateEventUseCaseRequest {
  userId: string
  eventId: string
  data: Prisma.EventUpdateInput
}

export class UpdateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ data, eventId, userId }: UpdateEventUseCaseRequest) {
    const event = await this.eventRepository.getEvent(eventId)

    if (!event) {
      throw new AppError(eventErrorsConstants.NOT_FOUND)
    }

    if (event.admin_id !== userId) {
      throw new AppError(eventErrorsConstants.ACTION_NOT_ALLOWED)
    }

    return await this.eventRepository.update(eventId, data)
  }
}
