import { CreateGroupUseCase } from '../create-group'

import { PrismaGroupRepository } from '@/repositories/prisma/prisma-groups-repository'
import { PrismaNotificationRepository } from '@/repositories/prisma/prisma-notifications-repository'
import { PrismaParticipantRepository } from '@/repositories/prisma/prisma-participant-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeCreateGroupUseCase() {
  const groupRepository = new PrismaGroupRepository()
  const participantRepository = new PrismaParticipantRepository()
  const userRepository = new PrismaUsersRepository()
  const notificationRepository = new PrismaNotificationRepository()

  const createGroupUseCase = new CreateGroupUseCase(
    groupRepository,
    participantRepository,
    userRepository,
    notificationRepository,
  )

  return createGroupUseCase
}
