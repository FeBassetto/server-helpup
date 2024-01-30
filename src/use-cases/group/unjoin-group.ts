import { groupErrorsConstants } from './errors/constants'

import { GroupRepository } from '@/repositories/groups-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'

export class UnjoinGroupUseCase {
  constructor(
    private groupRepository: GroupRepository,
    private participantRepository: ParticipantRepository,
  ) {}

  async execute(userId: string, groupId: string) {
    const group = await this.groupRepository.getById(groupId)

    if (!group) {
      throw new AppError(groupErrorsConstants.GROUP_NOT_EXISTS)
    }

    const alreadyIsParticipant =
      await this.participantRepository.getParticipantByGroupId(userId, groupId)

    if (
      !alreadyIsParticipant ||
      alreadyIsParticipant.user_id === group.admin_id
    ) {
      throw new AppError(groupErrorsConstants.ACTION_NOT_ALLOWED)
    }

    await this.participantRepository.unregisterGroup(userId, groupId)
  }
}
