import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { AuthenticateUseCase } from './authenticate'
import { usersErrorsConstants } from './errors/constants'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

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

    const user = await sut.execute({
      email,
      password,
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate without account', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

    await expect(
      sut.execute({
        email,
        password,
      }),
    ).rejects.toThrow(usersErrorsConstants.INVALID_CREDENTIALS.message)
  })

  it('should not be able to authenticate with the account without it being confirmed', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

    await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: false,
      is_deleted: false,
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        email,
        password,
      }),
    ).rejects.toThrow(usersErrorsConstants.UNCONFIRMED_EMAIL.message)
  })

  it('should not be able to authenticate with deleted account', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

    await usersRepository.create({
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
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        email,
        password,
      }),
    ).rejects.toThrow(usersErrorsConstants.DELETED_USER.message)
  })

  it('should not be able to authenticate with invalid credentials', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

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

    await expect(
      sut.execute({
        email,
        password: `${password}-error`,
      }),
    ).rejects.toThrow(usersErrorsConstants.INVALID_CREDENTIALS.message)
  })
})
