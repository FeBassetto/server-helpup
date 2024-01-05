import { groupErrorsConstants } from './errors/constants'

import { GroupRepository } from '@/repositories/groups-repository'
import { AppError } from '@/shared/errors/AppError'

export interface DeleteGroupUseCaseRequest {
  userId: string
  groupId: string
}

export class DeleteGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute({ groupId, userId }: DeleteGroupUseCaseRequest) {
    const group = await this.groupRepository.getById(groupId)

    if (!group) {
      throw new AppError(groupErrorsConstants.NOT_FOUND)
    }

    if (group.admin_id !== userId) {
      throw new AppError(groupErrorsConstants.ACTION_NOT_ALLOWED)
    }

    return await this.groupRepository.delete(groupId)
  }
}
