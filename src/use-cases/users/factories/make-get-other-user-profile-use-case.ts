import { GetOtherUserProfileUseCase } from '../get-other-user-profile'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetOtherUserProfileUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const getOtherUserProfileUseCase = new GetOtherUserProfileUseCase(
    usersRepository,
  )

  return getOtherUserProfileUseCase
}
