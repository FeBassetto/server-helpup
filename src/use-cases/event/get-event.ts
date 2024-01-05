import { Event } from '@prisma/client'

import { eventErrorsConstants } from './errors/constants'

import { EventRepository } from '@/repositories/event-repository'
import {
  GetEventParticipantsParams,
  GetParticipantsResponse,
  ParticipantRepository,
} from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'

interface GetGroupUseCaseRequest {
  event: Event
  participants: GetParticipantsResponse
}

export class GetEventUseCase {
  constructor(
    private eventRepository: EventRepository,
    private participantRepository: ParticipantRepository,
  ) {}

  async execute({
    eventId,
    offset,
    orderBy,
    query,
  }: GetEventParticipantsParams): Promise<GetGroupUseCaseRequest> {
    const event = await this.eventRepository.getEvent(eventId)

    if (!event) {
      throw new AppError(eventErrorsConstants.EVENT_NOT_EXISTS)
    }

    const participants = await this.participantRepository.getEventParticipants({
      eventId,
      offset,
      orderBy,
      query,
    })

    return { event, participants }
  }
}
