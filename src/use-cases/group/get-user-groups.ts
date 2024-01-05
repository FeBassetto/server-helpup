import { GroupRepository } from '@/repositories/groups-repository'

export class GetUserGroupsUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute(userId: string) {
    return await this.groupRepository.getGroupsByUserId(userId)
  }
}
