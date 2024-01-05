import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository

describe('Confirm Email (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to confirm user', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: false,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    const secret = env.JWT_SECRET

    const token = jwt.sign(
      {
        isAdmin: user.is_admin,
        isConfirmed: user.is_confirmed,
        isConfirmMail: true,
      },
      secret,
      {
        subject: user.id.toString(),
        expiresIn: '1h',
      },
    )

    const { body } = await request(app.server)
      .post('/api/users/confirm-email')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(body.token).toEqual(expect.any(String))
  })
})
