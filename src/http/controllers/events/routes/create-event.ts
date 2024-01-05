import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EventType } from '@prisma/client'

import { makeCreateEventUseCase } from '@/use-cases/event/factories/make-create-event'

export async function createEvent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const eventTypeValues = Object.values(EventType).filter(
    (value) => typeof value === 'string',
  ) as [string, ...string[]]

  const createEventUseCase = makeCreateEventUseCase()

  const createBodySchema = z.object({
    title: z
      .string()
      .min(4, 'O título deve ter pelo menos 4 caracteres.')
      .max(60, 'O título não pode exceder 60 caracteres.')
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        'O título deve conter apenas caracteres alfanuméricos e espaços.',
      ),
    description: z
      .string()
      .min(4, 'A descrição deve ter pelo menos 4 caracteres.')
      .max(100, 'A descrição não pode exceder 100 caracteres.'),
    city: z
      .string()
      .min(2, 'A cidade deve ter pelo menos 2 caracteres.')
      .max(50, 'A cidade não pode exceder 50 caracteres.'),
    date: z.string().refine((date) => new Date(date) >= new Date(), {
      message: 'A data não pode ser no passado.',
    }),
    street: z
      .string()
      .min(4, 'A rua deve ter pelo menos 4 caracteres.')
      .max(100, 'A rua não pode exceder 100 caracteres.'),
    type: z.enum(eventTypeValues),
    groupId: z.string().optional(),
    number: z.number(),
  })

  const { city, description, title, date, street, type, groupId, number } =
    createBodySchema.parse(request.body)

  const eventData = {
    adminId: { connect: { id: sub } },
    city,
    date,
    description,
    street,
    title,
    type: type as EventType,
    number,
    ...(groupId && { groupId: { connect: { id: groupId } } }),
  }

  await createEventUseCase.execute(eventData, sub)
  reply.send()
}
