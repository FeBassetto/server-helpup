import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { DeleteUseCase } from './delete'
import { usersErrorsConstants } from './errors/constants'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'

let usersRepository: UsersRepository
let sut: DeleteUseCase

describe('Delete Account Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUseCase(usersRepository)
  })

  it('should be able to delete a account', async () => {
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
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await sut.execute({ deleteData: true, id: user.id })

    const deletedUser = await usersRepository.findUserById(user.id)

    expect(deletedUser).toEqual(null)
  })

  it('should be able to delete a status account', async () => {
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
      latitude: '-23.550520',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await sut.execute({ deleteData: false, id: user.id })

    const deletedUser = await usersRepository.findUserById(user.id)

    expect(deletedUser?.is_deleted).toEqual(true)
  })

  it('should not be able to delete a non-existing account', async () => {
    await expect(
      sut.execute({ deleteData: false, id: 'randomuuid' }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NOT_FOUND.message)
  })

  it('should not be able to delete a admin account', async () => {
    const email = 'johndoe@example.com'
    const password = 'senha'

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
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({ deleteData: false, id: user.id }),
    ).rejects.toThrow(usersErrorsConstants.ADMIN_NOT_ALLOWED_ACTION.message)
  })
})
