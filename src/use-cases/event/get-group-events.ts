import { EventRepository } from '@/repositories/event-repository'

export class GetGroupEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(groupId: string) {
    return await this.eventRepository.getEventsByGroupId(groupId)
  }
}
