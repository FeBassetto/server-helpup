import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { GetUserProfileUseCase } from './get-user-profile'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: GetUserProfileUseCase

describe('Get data Use Case', () => {
  usersRepository = new InMemoryUsersRepository()
  sut = new GetUserProfileUseCase(usersRepository)

  it('should be able to get user data', async () => {
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
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    const userSut = await sut.execute(user.id)

    expect(userSut.id).toEqual(expect.any(String))
  })

  it('should not be able to get non-existing user data', async () => {
    await expect(sut.execute('testId')).rejects.toThrow(
      usersErrorsConstants.ACCOUNT_NOT_FOUND.message,
    )
  })
})
