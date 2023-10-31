import { prisma } from '@/lib/prisma'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/hello-world', async (request, reply) => {
    // const teste = await prisma.user.findMany({})

    // console.log(teste)

    return reply.status(201).send('Hello World! 2')
  })
}
