import { hash } from 'bcryptjs'
import request from 'supertest'
import { describe, afterAll, beforeAll, beforeEach, expect, it } from 'vitest'

import { app } from '@/app'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { PrismaFriendshipRepository } from '@/repositories/prisma/prisma-friendships-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let friendShipsRepository: FriendshipsRepository

describe('Send Friend Suggestions (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
    friendShipsRepository = new PrismaFriendshipRepository()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to send friend suggestions', async () => {
    const email = 'felipebtu9@gmail.com'
    const otherEmail = 'teste@gmail.com'
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

    const otherUser = await usersRepository.create({
      email: otherEmail,
      cep: '87654321',
      city: 'Rio de Janeiro',
      description: 'Outra breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'Maria Oliveira',
      nick: 'mariaoliveira',
      password_hash: await hash(password, 6),
    })

    const friendShip = await friendShipsRepository.createFriendship({
      userId1: user.id,
      userId2: otherUser.id,
    })

    await friendShipsRepository.updateFriendshipById(
      { isAccepted: true },
      friendShip.id,
    )

    const { body: tokenBody } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    const token = tokenBody.token

    const { statusCode } = await request(app.server)
      .delete(`/api/friendships/undo-friendship/${friendShip.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(statusCode).toEqual(204)
  })
})
