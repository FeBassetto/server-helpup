import { Group } from '@prisma/client'

import { groupErrorsConstants } from './errors/constants'

import { GroupRepository } from '@/repositories/groups-repository'
import {
  GetGroupParticipantsParams,
  GetParticipantsResponse,
  ParticipantRepository,
} from '@/repositories/participant-repository'
import { AppError } from '@/shared/errors/AppError'

interface GetGroupUseCaseRequest {
  group: Group
  participants: GetParticipantsResponse
}

export class GetGroupUseCase {
  constructor(
    private groupRepository: GroupRepository,
    private participantRepository: ParticipantRepository,
  ) {}

  async execute({
    groupId,
    offset,
    orderBy,
    query,
  }: GetGroupParticipantsParams): Promise<GetGroupUseCaseRequest> {
    const group = (await this.groupRepository.getById(groupId)) as Group | null

    if (!group) {
      throw new AppError(groupErrorsConstants.GROUP_NOT_EXISTS)
    }

    const participants = await this.participantRepository.getGroupParticipants({
      groupId,
      offset,
      orderBy,
      query,
    })

    return { group, participants }
  }
}
