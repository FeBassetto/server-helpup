import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateUseCase } from '@/use-cases/users/factories/make-update-use-case'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { sub } = request.user

  await request.saveRequestFiles()

  const updateBodySchema = z.object({
    name: z.string().min(2).max(100).optional(),
    nick: z.string().min(3).max(30).optional(),
    description: z.string().max(200).optional(),
    cep: z
      .string()
      .regex(/^\d{8}$/)
      .optional(),
    neighborhood: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    number: z.number().int().optional(),
    file: z.any().optional(),
  })

  const { file, ...data } = updateBodySchema.parse(request.body)

  const updateUseCase = makeUpdateUseCase()

  const updateData = file ? { data, userId: sub, file } : { data, userId: sub }

  const user = await updateUseCase.execute(updateData)

  reply.send(user)
}
