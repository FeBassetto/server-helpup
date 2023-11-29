import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { ResendConfirmationUseCase } from './resend-confirmation'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: ResendConfirmationUseCase

describe('Resend Confirmation Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ResendConfirmationUseCase(usersRepository)
  })

  it('should be able to resend confirmation code', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha'

    await usersRepository.create({
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

    const user = await sut.execute(email)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to resend confirmation code without an account', async () => {
    const email = 'felipebtu9@gmail.com'

    await expect(sut.execute(email)).rejects.toThrow(
      usersErrorsConstants.ACCOUNT_NOT_FOUND.message,
    )
  })

  it('should not be able to resend confirmation code with a deleted account', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha'

    await usersRepository.create({
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

    await expect(sut.execute(email)).rejects.toThrow(
      usersErrorsConstants.DELETED_USER.message,
    )
  })

  it('should not be able to resend confirmation code with a already confirmed account', async () => {
    const email = 'felipebtu9@gmail.com'
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

    await expect(sut.execute(email)).rejects.toThrow(
      usersErrorsConstants.ACCOUNT_ALREADY_IS_CONFIRMED.message,
    )
  })

  it('should not be able to resend confirmation code 3 times in 30 minutes', async () => {
    const email = 'felipebtu9@gmail.com'
    const password = 'senha'

    await usersRepository.create({
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

    await sut.execute(email)
    await sut.execute(email)

    await expect(sut.execute(email)).rejects.toThrow(
      usersErrorsConstants.MANY_ATTEMPTS.message,
    )
  })

  it('should be able to resend confirmation code after 40 minutes', async () => {
    vi.useFakeTimers()
    const email = 'felipebtu9@gmail.com'
    const password = 'senha'

    await usersRepository.create({
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

    await sut.execute(email)
    await sut.execute(email)

    vi.advanceTimersByTime(40 * 60 * 1000) // 40 minutes

    const user = await sut.execute(email)

    expect(user.id).toEqual(expect.any(String))
  })
})
