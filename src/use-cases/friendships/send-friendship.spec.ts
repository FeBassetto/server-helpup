import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { usersErrorsConstants } from '../users/errors/constants'

import { friendshipErrorsConstants } from './errors/constants'
import { SendFriendshipUseCase } from './send-friendship'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { InMemoryFriendshipRepository } from '@/repositories/in-memory/in-memory-friendships-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let friendshipRepository: FriendshipsRepository
let sut: SendFriendshipUseCase

describe('Send friendships', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    friendshipRepository = new InMemoryFriendshipRepository()
    sut = new SendFriendshipUseCase(usersRepository, friendshipRepository)
  })

  it('should be able to send friendship', async () => {
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

    await sut.execute({ senderId: me.id, receiverId: friend.id })
  })

  it('should not be able to send friendship with inexistent id', async () => {
    await expect(
      sut.execute({ senderId: 'non-id', receiverId: 'non-id' }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NOT_FOUND.message)
  })

  it('should not be able to send friendship with inexistent friend id', async () => {
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
      sut.execute({ senderId: me.id, receiverId: 'non-id' }),
    ).rejects.toThrow(friendshipErrorsConstants.FRIENDSHIP_NOT_ALLOWED.message)
  })

  it('should not be able to send friendship to already friend', async () => {
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

    const friendShip = await friendshipRepository.createFriendship({
      senderId: me.id,
      receiverId: friend.id,
      receiverName: friend.name,
      senderName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: true },
      friendShip.id,
    )

    await expect(
      sut.execute({ senderId: me.id, receiverId: friend.id }),
    ).rejects.toThrow(
      friendshipErrorsConstants.FRIENDSHIP_ALREADY_EXISTS.message,
    )
  })

  it('should not be able to send friendship if already reject friendship', async () => {
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

    const friendShip = await friendshipRepository.createFriendship({
      senderId: me.id,
      receiverId: friend.id,
      receiverName: friend.name,
      senderName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: false },
      friendShip.id,
    )

    await expect(
      sut.execute({ senderId: me.id, receiverId: friend.id }),
    ).rejects.toThrow(friendshipErrorsConstants.FRIENDSHIP_NOT_ACCEPT.message)
  })

  it('should not be able to send friendship if already sended', async () => {
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

    await friendshipRepository.createFriendship({
      senderId: me.id,
      receiverId: friend.id,
      receiverName: friend.name,
      senderName: me.name,
    })

    await expect(
      sut.execute({ senderId: me.id, receiverId: friend.id }),
    ).rejects.toThrow(friendshipErrorsConstants.FRIENDSHIP_ALREADY_SENT.message)
  })

  it('should be able to send friendship if you have been rejected the invitation', async () => {
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

    const friendShip = await friendshipRepository.createFriendship({
      senderId: friend.id,
      receiverId: me.id,
      senderName: friend.name,
      receiverName: me.name,
    })

    await friendshipRepository.updateFriendshipById(
      { isAccepted: false },
      friendShip.id,
    )

    await sut.execute({ senderId: me.id, receiverId: friend.id })
  })
})
