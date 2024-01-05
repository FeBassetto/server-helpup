import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { EventType } from '@prisma/client'

import { makeUpdateEventUseCase } from '@/use-cases/event/factories/make-update-event'

export async function updateEvent(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sub } = request.user

  const eventTypeValues = Object.values(EventType).filter(
    (value) => typeof value === 'string',
  ) as [string, ...string[]]

  const updateBodySchema = z.object({
    title: z
      .string()
      .min(4, 'O título deve ter pelo menos 4 caracteres.')
      .max(60, 'O título não pode exceder 60 caracteres.')
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        'O título deve conter apenas caracteres alfanuméricos e espaços.',
      )
      .optional(),
    description: z
      .string()
      .min(4, 'A descrição deve ter pelo menos 4 caracteres.')
      .max(100, 'A descrição não pode exceder 100 caracteres.')
      .optional(),
    city: z
      .string()
      .min(2, 'A cidade deve ter pelo menos 2 caracteres.')
      .max(50, 'A cidade não pode exceder 50 caracteres.')
      .optional(),
    date: z
      .string()
      .refine((date) => new Date(date) >= new Date(), {
        message: 'A data não pode ser no passado.',
      })
      .optional(),
    street: z
      .string()
      .min(4, 'A rua deve ter pelo menos 4 caracteres.')
      .max(100, 'A rua não pode exceder 100 caracteres.')
      .optional(),
    type: z.enum(eventTypeValues).optional(),
    number: z.number().optional(),
  })

  const updateEventParamsSchema = z.object({
    eventId: z.string(),
  })

  const { city, description, title, date, street, type, number } =
    updateBodySchema.parse(request.body)

  const { eventId } = updateEventParamsSchema.parse(request.params)

  const eventData = {
    city,
    date,
    description,
    street,
    title,
    type: type as EventType,
    number,
  }

  const updateEventUseCase = makeUpdateEventUseCase()

  await updateEventUseCase.execute({ data: eventData, eventId, userId: sub })

  reply.send()
}
