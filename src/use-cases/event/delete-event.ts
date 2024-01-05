import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { AppError } from '@/shared/errors/AppError'

export class DeleteEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(userId: string, eventId: string) {
    const event = await this.eventRepository.getEvent(eventId)

    if (!event) {
      throw new AppError(eventErrorsConstants.NOT_FOUND)
    }

    if (event.admin_id !== userId) {
      throw new AppError(eventErrorsConstants.ACTION_NOT_ALLOWED)
    }

    await this.eventRepository.delete(eventId)
  }
}
