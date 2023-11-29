import { randomUUID } from 'crypto'

import { MultipartFile } from '@fastify/multipart'
import { Prisma } from '@prisma/client'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { StorageProvider } from '@/shared/providers/StorageProvider/storage-provider'

export interface UpdateUseCaseRequest {
  data: Prisma.UserUpdateInput
  userId: string
  file?: MultipartFile
}

export class UpdateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private storageProvider: StorageProvider,
  ) {}

  async execute({ data, userId, file }: UpdateUseCaseRequest) {
    const user = await this.usersRepository.findUserById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    let userImagePath = user.profile_url

    if (file) {
      const fileBuffer: Buffer = await file.toBuffer()
      const timestamp = new Date()
        .toISOString()
        .replace(/[:\-.Z]/g, '')
        .replace('T', '-')
      const uniqueFilename = `${timestamp}-${randomUUID()}`
      const mimetype = file.mimetype

      userImagePath = await this.storageProvider.uploadImage(
        fileBuffer,
        uniqueFilename,
        mimetype,
      )
    }

    const updatedUser = await this.usersRepository.updateUserById({
      data: {
        ...data,
        profile_url: userImagePath,
      },
      userId,
    })

    await this.storageProvider.deleteImage(user.profile_url)

    return updatedUser
  }
}
