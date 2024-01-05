import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { GetOtherUserProfileUseCase } from './get-other-user-profile'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: GetOtherUserProfileUseCase

describe('Get other user profile', () => {
  usersRepository = new InMemoryUsersRepository()
  sut = new GetOtherUserProfileUseCase(usersRepository)

  it('should be able to get other user profile', async () => {
    const email = 'felipebtu9@gmail.com'
    const otherEmail = 'teste@gmail.com'
    const password = 'senha123'

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

    const otherUser = await usersRepository.create({
      email: otherEmail,
      cep: '87654321',
      city: 'Rio de Janeiro',
      description: 'Outra breve descrição sobre o usuário.',
      is_admin: false,
      is_confirmed: true,
      is_deleted: false,
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'Maria Oliveira',
      nick: 'mariaoliveira',
      password_hash: await hash(password, 6),
    })

    const response = await sut.execute({ id: user.id, userId: otherUser.id })

    expect(response.id).toEqual(expect.any(String))
  })

  it('should not be able to get same user profile', async () => {
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
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(sut.execute({ id: user.id, userId: user.id })).rejects.toThrow(
      usersErrorsConstants.GET_SAME_ACCOUNT_DATA.message,
    )
  })

  it('should not be able to get user profile without account', async () => {
    await expect(
      sut.execute({ id: 'test', userId: 'test123' }),
    ).rejects.toThrow(usersErrorsConstants.ACTION_NOT_ALLOWED.message)
  })

  it('should not be able to get nonexistent user profile', async () => {
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
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({ id: user.id, userId: 'test123' }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NOT_FOUND.message)
  })
})
