import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { RegisterUseCase } from './register'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should not be able to register a existing user email', async () => {
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
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        email,
        cep: '18608333',
        city: 'Botucatu',
        description: 'Uma breve descrição sobre o usuário.',
        name: 'João da Silva',
        nick: 'felipe',
        neighborhood: 'Vila Casa Branca',
        number: 1444,
        password,
        street: 'Rua Braz de Assis',
      }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_EMAIL_ALREADY_EXISTS.message)
  })

  it('should not be able to register a existing user nick', async () => {
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
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({
        email: `teste${email}`,
        cep: '18608333',
        city: 'Botucatu',
        description: 'Uma breve descrição sobre o usuário.',
        name: 'João da Silva',
        nick: 'joaosilva',
        neighborhood: 'Vila Casa Branca',
        number: 1444,
        password,
        street: 'Rua Braz de Assis',
      }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NICK_ALREADY_EXISTS.message)
  })

  it('should be able to register a user', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

    const user = await sut.execute({
      email,
      cep: '18608333',
      city: 'Botucatu',
      description: 'Uma breve descrição sobre o usuário.',
      name: 'João da Silva',
      nick: 'joaosilva',
      neighborhood: 'Vila Casa Branca',
      number: 1444,
      password,
      street: 'Rua Braz de Assis',
    })

    expect(user.password_hash).toEqual(expect.any(String))
  })
})
