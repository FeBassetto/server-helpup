import { Prisma } from '@prisma/client'

import { groupErrorsConstants } from './errors/constants'

import { GroupRepository } from '@/repositories/groups-repository'
import { AppError } from '@/shared/errors/AppError'

export interface UpdateGroupUseCaseRequest {
  userId: string
  data: Prisma.GroupUpdateInput
  groupId: string
}

export class UpdateGroupUseCase {
  constructor(private groupRepository: GroupRepository) {}

  async execute({ data, groupId, userId }: UpdateGroupUseCaseRequest) {
    const group = await this.groupRepository.getById(groupId)

    if (!group) {
      throw new AppError(groupErrorsConstants.NOT_FOUND)
    }

    if (group.admin_id !== userId) {
      throw new AppError(groupErrorsConstants.ACTION_NOT_ALLOWED)
    }

    return await this.groupRepository.update(groupId, data)
  }
}
