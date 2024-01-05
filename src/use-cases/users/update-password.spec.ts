import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { UpdatePasswordUseCase } from './update-password'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: UpdatePasswordUseCase

describe('Update password', () => {
  usersRepository = new InMemoryUsersRepository()
  sut = new UpdatePasswordUseCase(usersRepository)

  it('should be able to update user password', async () => {
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

    await sut.execute({
      password: 'newPassword',
      userId: user.id,
    })
  })

  it('should not be able to update nonexistent user password', async () => {
    await expect(
      sut.execute({
        password: 'newPassword',
        userId: 'teste',
      }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NOT_FOUND.message)
  })

  it('should not be able to update user password if it is the same', async () => {
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
      sut.execute({
        password,
        userId: user.id,
      }),
    ).rejects.toThrow(usersErrorsConstants.SAME_PASSWORD.message)
  })
})
