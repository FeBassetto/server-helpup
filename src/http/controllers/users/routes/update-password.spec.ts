import { hash } from 'bcryptjs'
import request from 'supertest'
import { describe, afterAll, beforeAll, beforeEach, expect, it } from 'vitest'

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

  it('should be able to update user password', async () => {
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
      latitude: '-23.55052',
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

    const token = body.token

    const { statusCode } = await request(app.server)
      .patch('/api/users/password')
      .send({
        password: 'Mudar123@',
        confirm_password: 'Mudar123@',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(statusCode).toEqual(200)
  })

  it('should not be able to update user password with invalid params', async () => {
    const email = 'felipebtu99@gmail.com'
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
      nick: 'joaosilva9',
      password_hash: await hash(password, 6),
    })

    const { body } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    const token = body.token

    const { body: updateResponse } = await request(app.server)
      .patch('/api/users/password')
      .send({
        password: 'Mudar123@',
        confirm_password: 'Mudar123@2',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(updateResponse.type).toEqual('PASSWORD_NOT_SAME')
  })
})
