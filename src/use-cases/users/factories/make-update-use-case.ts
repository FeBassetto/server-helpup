import { UpdateUseCase } from '../update'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AwsS3 } from '@/shared/providers/StorageProvider/implementations/aws-s3'

export function makeUpdateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const storageProvider = new AwsS3()

  const updateUseCase = new UpdateUseCase(usersRepository, storageProvider)

  return updateUseCase
}
