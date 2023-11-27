import { FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeDeleteUseCase } from '@/use-cases/users/factories/make-delete-use-case'

export async function deleteRoute(request: FastifyRequest) {
  const { sub } = request.user

  const registerBodySchema = z.object({
    deleteData: z.boolean({
      required_error: 'O campo deleteData deve ser um valor booleano.',
    }),
  })

  const { deleteData } = registerBodySchema.parse(request.body)

  const deleteUseCase = makeDeleteUseCase()

  await deleteUseCase.execute({ deleteData, id: sub })
}
