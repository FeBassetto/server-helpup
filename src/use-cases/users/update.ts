/* eslint-disable @typescript-eslint/no-unused-vars */
import { randomUUID } from 'crypto'

import { MultipartFile } from '@fastify/multipart'
import { Prisma } from '@prisma/client'

import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'
import { StorageProvider } from '@/shared/providers/StorageProvider/storage-provider'
import { getGeoLocation } from '@/utils/get-geo-location'

interface UpdateData {
  name?: string
  nick?: string
  description?: string
  cep?: string
  neighborhood?: string
  street?: string
  city?: string
  number?: number
}

export interface UpdateUseCaseRequest {
  data: UpdateData
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

    const { city, neighborhood, number, street, nick } = data

    if (nick) {
      if (nick === user.nick) {
        throw new AppError(usersErrorsConstants.SAME_NICK)
      }

      const existsNick = await this.usersRepository.findUserByNick(nick)

      if (existsNick) {
        throw new AppError(usersErrorsConstants.ACCOUNT_NICK_ALREADY_EXISTS)
      }
    }

    let userImagePath = user.profile_url
    let latitude = user.latitude
    let longitude = user.longitude

    if (
      !(city && neighborhood && number && street) &&
      !(
        city === undefined &&
        neighborhood === undefined &&
        number === undefined &&
        street === undefined
      )
    ) {
      throw new AppError(usersErrorsConstants.UPDATE_GEO_MISSED_PARAMS)
    }

    if (city && neighborhood && number && street) {
      const { lat, lon } = await getGeoLocation({
        city,
        neighborhood,
        number,
        street,
      })

      latitude = lat
      longitude = lon
    }

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

    const {
      neighborhood: neighborhoodContent,
      street: streetContent,
      number: numberContent,
      ...dataWithoutNeighborhood
    } = data

    const updatedData: Prisma.UserUpdateInput = {
      ...dataWithoutNeighborhood,
      profile_url: userImagePath,
      latitude,
      longitude,
    }

    if (nick) {
      updatedData.nick = nick.toLowerCase()
    }

    console.log(updatedData)

    const updatedUser = await this.usersRepository.updateUserById({
      data: updatedData,
      userId,
    })

    await this.storageProvider.deleteImage(user.profile_url)

    const {
      password_hash,
      is_admin,
      is_confirmed,
      is_deleted,
      ...updatedUserReturn
    } = updatedUser

    return updatedUserReturn
  }
}
