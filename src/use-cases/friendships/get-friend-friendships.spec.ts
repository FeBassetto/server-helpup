import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { GetFriendFriendshipsUseCase } from './get-friend-friendships'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { InMemoryFriendshipRepository } from '@/repositories/in-memory/in-memory-friendships-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let friendshipRepository: FriendshipsRepository
let sut: GetFriendFriendshipsUseCase

describe('Get friend friendships', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    friendshipRepository = new InMemoryFriendshipRepository()
    sut = new GetFriendFriendshipsUseCase(friendshipRepository)
  })

  it('should be able to get friend friendships', async () => {
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

    await friendshipRepository.updateFriendshipById(
      { isAccepted: true },
      friendship.id,
    )

    const response = await sut.execute({ friendId: friend.id, userId: me.id })

    expect(response.isFriends).toEqual(true)
  })
})
