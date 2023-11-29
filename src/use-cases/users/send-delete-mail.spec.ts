import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { usersErrorsConstants } from './errors/constants'
import { SendDeleteMailUseCase } from './send-delete-mail'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { InMemoryMailProvider } from '@/shared/providers/MailProvider/in-memory/in-memory-mail-provider'
import { MailProvider } from '@/shared/providers/MailProvider/mail-provider'

let usersRepository: UsersRepository
let mailProvider: MailProvider
let sut: SendDeleteMailUseCase

describe('Send Delete Mail Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    mailProvider = new InMemoryMailProvider()
    sut = new SendDeleteMailUseCase(usersRepository, mailProvider)
  })

  it('should be able to send delete mail', async () => {
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

    await sut.execute({ id: user.id, token: 'testToken', deleteData: true })
  })

  it('should not be able to send delete mail a non-existing account', async () => {
    await expect(
      sut.execute({ id: 'testId', token: 'testToken', deleteData: true }),
    ).rejects.toThrow(usersErrorsConstants.ACCOUNT_NOT_FOUND.message)
  })

  it('should not be able to send delete mail to a admin account', async () => {
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
      latitude: '-23.55052',
      longitude: '-46.633308',
      name: 'João da Silva',
      nick: 'joaosilva',
      password_hash: await hash(password, 6),
    })

    await expect(
      sut.execute({ id: user.id, token: 'testToken', deleteData: true }),
    ).rejects.toThrow(usersErrorsConstants.ADMIN_NOT_ALLOWED_ACTION.message)
  })
})
