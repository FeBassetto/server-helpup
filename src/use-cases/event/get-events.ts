import { usersErrorsConstants } from '../users/errors/constants'

import {
  EventQuery,
  EventRepository,
  GetEventsByDistanceAndQueryResponse,
} from '@/repositories/event-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

export class GetEventsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private eventRepository: EventRepository,
  ) {}

  async execute(
    userId: string,
    query: EventQuery,
  ): Promise<GetEventsByDistanceAndQueryResponse> {
    const user = await this.usersRepository.getUserDataById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    const response = await this.eventRepository.getEventsByDistanceAndQuery({
      lat: Number(user.latitude),
      long: Number(user.longitude),
      query,
    })

    return response
  }
}
