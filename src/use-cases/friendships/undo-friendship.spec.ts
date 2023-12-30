import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { friendshipErrorsConstants } from './errors/constants'
import { UndoFriendshipUseCase } from './undo-friendship'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { InMemoryFriendshipRepository } from '@/repositories/in-memory/in-memory-friendships-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let friendshipRepository: FriendshipsRepository
let sut: UndoFriendshipUseCase

describe('Get friend friendships', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    friendshipRepository = new InMemoryFriendshipRepository()
    sut = new UndoFriendshipUseCase(friendshipRepository)
  })

  it('should be able to undo friendships', async () => {
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
      senderId: me.id,
      receiverId: friend.id,
      receiverName: friend.name,
      senderName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: true },
      friendship.id,
    )

    await sut.execute({ friendshipId: friendship.id, userId: me.id })
  })

  it('should not be able to undo friendships if not exists', async () => {
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

    await expect(
      sut.execute({ friendshipId: 'non-exists', userId: me.id }),
    ).rejects.toThrow(friendshipErrorsConstants.FRIENDSHIP_NOT_EXISTS.message)
  })

  it('should not be able to undo friendships if not yours', async () => {
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

    const secondaryFriend = await usersRepository.create({
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
      nick: 'felipe2',
      password_hash: await hash(password, 6),
    })

    const friendship = await friendshipRepository.createFriendship({
      senderId: secondaryFriend.id,
      receiverId: friend.id,
      receiverName: friend.name,
      senderName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: true },
      friendship.id,
    )

    await expect(
      sut.execute({ friendshipId: friendship.id, userId: me.id }),
    ).rejects.toThrow(friendshipErrorsConstants.ACTION_NOT_ALLOWED.message)
  })

  it('should not be able to undo friendships if not exists', async () => {
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
      senderId: friend.id,
      receiverId: me.id,
      senderName: friend.name,
      receiverName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: false },
      friendship.id,
    )

    await expect(
      sut.execute({ friendshipId: friendship.id, userId: me.id }),
    ).rejects.toThrow(friendshipErrorsConstants.ACTION_NOT_ALLOWED.message)
  })

  it('should not be able to undo friendships if not exists', async () => {
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
      senderId: me.id,
      receiverId: friend.id,
      receiverName: friend.name,
      senderName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: false },
      friendship.id,
    )

    await expect(
      sut.execute({ friendshipId: friendship.id, userId: me.id }),
    ).rejects.toThrow(friendshipErrorsConstants.ACTION_NOT_ALLOWED.message)
  })
})
