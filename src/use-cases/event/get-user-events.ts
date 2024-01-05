import { EventRepository } from '@/repositories/event-repository'

export class GetUserEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(userId: string) {
    return await this.eventRepository.getEventsByUserId(userId)
  }
}
