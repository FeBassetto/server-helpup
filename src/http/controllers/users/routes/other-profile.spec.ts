import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository

describe('Other Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get other profile', async () => {
    const email = 'felipebtu9@gmail.com'
    const otherEmail = 'teste@gmail.com'
    const password = 'senha123'

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
      latitude: '-22.9068',
      longitude: '-43.1729',
      name: 'Maria Oliveira',
      nick: 'mariaoliveira',
      password_hash: await hash(password, 6),
    })

    const { body } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    const token = body.token

    const { body: profileBody } = await request(app.server)
      .get(`/api/users/profile/${otherUser.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(profileBody.user.data.city).toEqual(otherUser.city)
  })
})
