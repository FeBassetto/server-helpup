import { Prisma } from '@prisma/client'

import { groupErrorsConstants } from './errors/constants'

import { GroupRepository } from '@/repositories/groups-repository'
import { ParticipantRepository } from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'

export class CreateGroupUseCase {
  constructor(
    private groupRepository: GroupRepository,
    private participantRepository: ParticipantRepository,
  ) {}

  async execute(data: Prisma.GroupCreateInput, userId: string) {
    const existsGroup = await this.groupRepository.getByTitle(data.title)

    if (existsGroup) {
      throw new AppError(groupErrorsConstants.GROUP_ALREADY_EXISTS)
    }

    const group = await this.groupRepository.create(data)
    await this.participantRepository.register({
      user: { connect: { id: userId } },
      group: { connect: { id: group.id } },
    })
  }
}
