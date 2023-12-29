import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { UpdateUseCase } from './update'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { InMemoryStorage } from '@/shared/providers/StorageProvider/in-memory/in-memory-storage-provider'
import { StorageProvider } from '@/shared/providers/StorageProvider/storage-provider'

let usersRepository: UsersRepository
let storageProvider: StorageProvider
let sut: UpdateUseCase

describe('Update user data', () => {
  usersRepository = new InMemoryUsersRepository()
  storageProvider = new InMemoryStorage()
  sut = new UpdateUseCase(usersRepository, storageProvider)

  it('should be able to update user data', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'
    const newNick = 'newnick'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    const response = await sut.execute({
      data: {
        nick: newNick,
      },
      userId: user.id,
    })

    expect(response.nick).toEqual(newNick)
  })

  it('should be able to update user data', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    const response = await sut.execute({
      data: {
        city: 'Botucatu',
        neighborhood: 'Vila Casa Branca',
        number: 1444,
        street: 'braz de assis',
      },
      userId: user.id,
    })

    expect(response.latitude).toEqual(expect.any(Object))
  })

  it('should not to be able to update inexistent user data', async () => {
    await expect(
      sut.execute({
        data: {
          nick: 'nick',
        },
        userId: 'non-id',
      }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NOT_FOUND.message)
  })

  it('should not to be able to update user data with same nick', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'
    const nick = 'nick'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick,
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        data: {
          nick,
        },
        userId: user.id,
      }),
    ).rejects.toThrow(usersErrorsConstants.SAME_NICK.message)
  })

  it('should not to be able to update user data with existent nick', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'
    const nick = 'nick'

    await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick,
      password_hash: await hash(password, 6),
    })

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: `${nick}a`,
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        data: {
          nick,
        },
        userId: user.id,
      }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NICK_ALREADY_EXISTS.message)
  })

  it('should be able to update user data', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        data: {
          city: 'Botucatu',
        },
        userId: user.id,
      }),
    ).rejects.toThrow(usersErrorsConstants.UPDATE_GEO_MISSED_PARAMS.message)
  })
})
