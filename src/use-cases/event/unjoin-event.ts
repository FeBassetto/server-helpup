import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'

export class UnjoinEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private participantRepository: ParticipantRepository,
  ) {}

  async execute(userId: string, eventId: string) {
    const event = await this.eventRepository.getEvent(eventId)

    if (!event) {
      throw new AppError(eventErrorsConstants.EVENT_NOT_EXISTS)
    }

    const alreadyIsParticipant =
      await this.participantRepository.getParticipantByEventId(userId, eventId)

    if (!alreadyIsParticipant) {
      throw new AppError(eventErrorsConstants.ACTION_NOT_ALLOWED)
    }

    await this.participantRepository.unregisterEvent(userId, eventId)
  }
}
