import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository

describe('Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get profile', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'

    await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    const { body } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    const { body: profileBody } = await request(app.server)
      .get('/api/users')
      .set('Authorization', `Bearer ${body.token}`)
      .send()

    const expectedProperties = [
      'id',
      'name',
      'nick',
      'description',
      'profile_url',
      'email',
      'city',
      'longitude',
      'latitude',
      'cep',
      'created_at',
    ]

    expectedProperties.forEach((property) => {
      expect(profileBody.user).toHaveProperty(property)
    })
  })
})
