import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { ConfirmEmailUseCase } from './confirm-email'
import { usersErrorsConstants } from './errors/constants'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: ConfirmEmailUseCase

describe('Confirm Email Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ConfirmEmailUseCase(usersRepository)
  })

  it('should be able to confirm user by email', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

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

    const confirmedUser = await sut.execute(user.id)

    expect(confirmedUser.is_confirmed).toEqual(true)
  })

  it('should not be able to confirm user without account', async () => {
    await expect(sut.execute('randomid')).rejects.toThrow(
      usersErrorsConstants.ACCOUNT_NOT_FOUND.message,
    )
  })

  it('should not be able to confirm deleted user', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

    const user = await usersRepository.create({
      email,
      cep: '12345678',
      city: 'São Paulo',
      description: 'Uma breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: false,
      is_deleted: true,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(sut.execute(user.id)).rejects.toThrow(
      usersErrorsConstants.DELETED_USER.message,
    )
  })

  it('should not be able to confirm an already confirmed account', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

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

    await expect(sut.execute(user.id)).rejects.toThrow(
      usersErrorsConstants.ACCOUNT_ALREADY_IS_CONFIRMED.message,
    )
  })
})
