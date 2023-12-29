import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { friendshipErrorsConstants } from './errors/constants'
import { UpdateFriendshipUseCase } from './update-friendship'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { InMemoryFriendshipRepository } from '@/repositories/in-memory/in-memory-friendships-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let friendshipRepository: FriendshipsRepository
let sut: UpdateFriendshipUseCase

describe('Update friendships', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    friendshipRepository = new InMemoryFriendshipRepository()
    sut = new UpdateFriendshipUseCase(friendshipRepository)
  })

  it('should be able to update friendships', async () => {
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

    const friend = await usersRepository.create({
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

    const friendship = await friendshipRepository.createFriendship({
      userId1: friend.id,
      userId2: me.id,
    })

    await sut.execute({
      accept: true,
      friendshipId: friendship.id,
      userId: me.id,
    })
  })

  it('should not be able to update friendships if not exists', async () => {
    await expect(
      sut.execute({
        accept: true,
        friendshipId: 'non-existing',
        userId: 'non-existing',
      }),
    ).rejects.toThrow(friendshipErrorsConstants.FRIENDSHIP_NOT_EXISTS.message)
  })

  it('should be able to update friendships', async () => {
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

    const friend = await usersRepository.create({
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

    const otherFriend = await usersRepository.create({
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

    const friendship = await friendshipRepository.createFriendship({
      userId1: friend.id,
      userId2: otherFriend.id,
    })

    await expect(
      sut.execute({
        accept: true,
        friendshipId: friendship.id,
        userId: me.id,
      }),
    ).rejects.toThrow(friendshipErrorsConstants.ACTION_NOT_ALLOWED.message)
  })

  it('should not be able to update friendship if you send friendship', async () => {
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

    const friend = await usersRepository.create({
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

    const friendship = await friendshipRepository.createFriendship({
      userId1: me.id,
      userId2: friend.id,
    })

    await expect(
      sut.execute({
        accept: true,
        friendshipId: friendship.id,
        userId: me.id,
      }),
    ).rejects.toThrow(friendshipErrorsConstants.ACTION_NOT_ALLOWED.message)
  })

  it('should not be able to update friendship if already is accept', async () => {
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

    const friend = await usersRepository.create({
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

    const friendship = await friendshipRepository.createFriendship({
      userId1: friend.id,
      userId2: me.id,
    })

    await sut.execute({
      accept: true,
      friendshipId: friendship.id,
      userId: me.id,
    })

    await expect(
      sut.execute({
        accept: true,
        friendshipId: friendship.id,
        userId: me.id,
      }),
    ).rejects.toThrow(
      friendshipErrorsConstants.FRIENDSHIP_STATUS_ALREADY_UPDATED.message,
    )
  })
})
