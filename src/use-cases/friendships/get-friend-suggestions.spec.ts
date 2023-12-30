import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { usersErrorsConstants } from '../users/errors/constants'

import { GetFriendSuggestionsUseCase } from './get-friend-suggestions'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { InMemoryFriendshipRepository } from '@/repositories/in-memory/in-memory-friendships-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let friendshipRepository: FriendshipsRepository
let sut: GetFriendSuggestionsUseCase

describe('Get friend suggestions', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    friendshipRepository = new InMemoryFriendshipRepository()
    sut = new GetFriendSuggestionsUseCase(usersRepository, friendshipRepository)
  })

  it('should be able to get friend suggestions', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

    const me = await usersRepository.create({
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
      nick: 'felipe',
      password_hash: await hash(password, 6),
    })

    const friend = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55055',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'felipetest',
      password_hash: await hash(password, 6),
    })

    friendshipRepository.createFriendship({
      senderId: friend.id,
      receiverId: me.id,
      receiverName: me.name,
      senderName: friend.name,
    })

    const response = await sut.execute({ offset: 0, userId: me.id })

    expect(response[0].nick).toEqual('felipe')
  })

  it('should not be able to get friend suggestions', async () => {
    await expect(sut.execute({ offset: 0, userId: 'non-id' })).rejects.toThrow(
      usersErrorsConstants.ACCOUNT_NOT_FOUND.message,
    )
  })
})
