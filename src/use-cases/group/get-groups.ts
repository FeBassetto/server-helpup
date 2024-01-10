import { usersErrorsConstants } from '../users/errors/constants'

import { GroupQuery, GroupRepository } from '@/repositories/groups-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

export class GetGroupsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private groupsRepository: GroupRepository,
  ) {}

  async execute(userId: string, query: GroupQuery) {
    const user = await this.usersRepository.getUserDataById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    const response = await this.groupsRepository.getGroupsByDistanceAndQuery({
      lat: Number(user.latitude),
      long: Number(user.longitude),
      query,
    })

    return response
  }
}
