import { app } from '@/app'
import { afterAll, beforeAll, describe, it } from 'vitest'
import request from 'supertest'

describe('Authenticate (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const user = await request(app.server).post('/api/users').send({
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

    console.log(user.body)
  })
})
