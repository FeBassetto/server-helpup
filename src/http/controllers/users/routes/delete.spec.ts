import { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository

describe('Delete Account (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    usersRepository = new PrismaUsersRepository()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to delete a account', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
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

    const secret = env.JWT_SECRET

    const token = jwt.sign(
      {
        isAdmin: user.is_admin,
        isConfirmed: user.is_confirmed,
        isDeleted: user.is_deleted,
        isDeleteMail: true,
      },
      secret,
      {
        subject: user.id.toString(),
        expiresIn: '1h',
      },
    )

    const { statusCode: deleteStatusCode } = await request(app.server)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ deleteData: true })

    expect(deleteStatusCode).toEqual(200)

    const { statusCode } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    expect(statusCode).toEqual(401)
  })

  it('should be able to delete a status account', async () => {
    const email = 'deleteStatus@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
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
      nick: 'deleteStatus',
      password_hash: await hash(password, 6),
    })

    const secret = env.JWT_SECRET

    const token = jwt.sign(
      {
        isAdmin: user.is_admin,
        isConfirmed: user.is_confirmed,
        isDeleted: user.is_deleted,
        isDeleteMail: true,
      },
      secret,
      {
        subject: user.id.toString(),
        expiresIn: '1h',
      },
    )

    const { statusCode: deleteStatusCode } = await request(app.server)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ deleteData: false })

    expect(deleteStatusCode).toEqual(200)

    const { statusCode } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    expect(statusCode).toEqual(403)
  })

  it('should not be able to delete a admin account', async () => {
    const email = 'felipebtu9teste@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: true,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'teste',
      password_hash: await hash(password, 6),
    })

    const secret = env.JWT_SECRET

    const token = jwt.sign(
      {
        isAdmin: user.is_admin,
        isConfirmed: user.is_confirmed,
        isDeleted: user.is_deleted,
        isDeleteMail: true,
      },
      secret,
      {
        subject: user.id.toString(),
        expiresIn: '1h',
      },
    )

    const { statusCode: deleteStatusCode } = await request(app.server)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ deleteData: false })

    expect(deleteStatusCode).toEqual(403)

    const { statusCode } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    expect(statusCode).toEqual(200)
  })

  it('should be able to delete a status account', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
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

    const secret = env.JWT_SECRET

    const token = jwt.sign(
      {
        isAdmin: user.is_admin,
        isConfirmed: user.is_confirmed,
        isDeleted: user.is_deleted,
        isDeleteMail: true,
      },
      secret,
      {
        subject: user.id.toString(),
        expiresIn: '1h',
      },
    )

    const { statusCode: deleteStatusCode } = await request(app.server)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ deleteData: false })

    expect(deleteStatusCode).toEqual(200)

    const { statusCode } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    expect(statusCode).toEqual(403)
  })

  it('should not be able to delete a already deleted account', async () => {
    const email = 'teste@gmail.com'
    const password = 'senha123'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: true,
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'teste2',
      password_hash: await hash(password, 6),
    })

    const secret = env.JWT_SECRET

    const token = jwt.sign(
      {
        isAdmin: user.is_admin,
        isConfirmed: user.is_confirmed,
        isDeleted: user.is_deleted,
        isDeleteMail: true,
      },
      secret,
      {
        subject: user.id.toString(),
        expiresIn: '1h',
      },
    )

    const { statusCode: deleteStatusCode } = await request(app.server)
      .delete('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ deleteData: false })

    expect(deleteStatusCode).toEqual(403)

    const { statusCode } = await request(app.server)
      .post('/api/users/sessions')
      .send({
        email,
        password,
      })

    expect(statusCode).toEqual(403)
  })
})
