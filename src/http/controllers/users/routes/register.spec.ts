import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Register (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register a new user', async () => {
    const { statusCode } = await request(app.server).post('/api/users').send({
      name: 'Felipe Bassetto',
      nick: 'Bassetto',
      description: 'A short description of the user.',
      email: 'felipebtu9@gmail.com',
      password: 'Mudar123',
      cep: '18608333',
      neighborhood: 'Vila Casa Branca',
      street: 'Rua Braz de Assis',
      city: 'Botucatu',
      number: 1444,
    })

    expect(statusCode).toEqual(201)
  })
})
