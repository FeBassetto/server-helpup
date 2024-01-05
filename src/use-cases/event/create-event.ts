import { Prisma } from '@prisma/client'

import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'

export class CreateEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private participantRepository: ParticipantRepository,
  ) {}

  async execute(data: Prisma.EventCreateInput, userId: string) {
    const eventExists = await this.eventRepository.getEventByTitle(data.title)

    if (eventExists) {
      throw new AppError(eventErrorsConstants.EVENT_ALREADY_EXISTS)
    }

    const event = await this.eventRepository.create(data)
    await this.participantRepository.register({
      user: { connect: { id: userId } },
      event: { connect: { id: event.id } },
    })
  }
}
