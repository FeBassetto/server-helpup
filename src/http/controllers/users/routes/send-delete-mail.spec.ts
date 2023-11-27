import { hash } from 'bcryptjs'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository

describe('Send delete mail (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to send delete mail', async () => {
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

    const { statusCode: deleteStatusCode } = await request(app.server)
      .post('/api/users/delete-mail')
      .set('Authorization', `Bearer ${body.token}`)
      .send({ deleteData: true })

    expect(deleteStatusCode).toEqual(200)
  })
})
