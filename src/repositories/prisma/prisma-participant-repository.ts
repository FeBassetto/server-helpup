import { Participant, Prisma } from '@prisma/client'

import { env } from '@/env'

import {
  GetEventParticipantsParams,
  GetGroupParticipantsParams,
  GetParticipantsResponse,
  ParticipantRepository,
} from '../participant-repository'

import { prisma } from '@/lib/prisma'

export class PrismaParticipantRepository implements ParticipantRepository {
  async getParticipantByEventId(
    userId: string,
    eventId: string,
  ): Promise<Participant | null> {
    return await prisma.participant.findFirst({
      where: { user_id: userId, event_id: eventId },
    })
  }

  async getParticipantByGroupId(
    userId: string,
    groupId: string,
  ): Promise<Participant | null> {
    return await prisma.participant.findFirst({
      where: { user_id: userId, group_id: groupId },
    })
  }

  async register(data: Prisma.ParticipantCreateInput): Promise<void> {
    await prisma.participant.create({ data })
  }

  async getGroupParticipants({
    groupId,
    offset = 0,
    orderBy = 'asc',
    query = '',
  }: GetGroupParticipantsParams): Promise<GetParticipantsResponse> {
    const participants = await prisma.participant.findMany({
      where: {
        group_id: groupId,
        user: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { nick: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
      skip: offset,
      take: env.RESULTS_PARTICIPANTS_NUMBER,
      orderBy: {
        user: {
          name: orderBy,
        },
      },
      include: {
        user: true,
      },
    })

    const totalParticipants = await prisma.participant.count({
      where: { group_id: groupId },
    })

    const pageSize = env.RESULTS_PARTICIPANTS_NUMBER
    const pages = Math.ceil(totalParticipants / pageSize)

    return {
      pages,
      participants,
      totalParticipants,
    }
  }

  async getEventParticipants({
    eventId,
    offset = 0,
    orderBy = 'asc',
    query = '',
  }: GetEventParticipantsParams): Promise<GetParticipantsResponse> {
    console.log(env.RESULTS_PARTICIPANTS_NUMBER)

    const participants = await prisma.participant.findMany({
      where: {
        event_id: eventId,
        user: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { nick: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
      skip: offset,
      take: env.RESULTS_PARTICIPANTS_NUMBER,
      orderBy: {
        user: {
          name: orderBy,
        },
      },
      include: {
        user: true,
      },
    })

    const totalParticipants = await prisma.participant.count({
      where: { event_id: eventId },
    })

    const pageSize = env.RESULTS_PARTICIPANTS_NUMBER
    const pages = Math.ceil(totalParticipants / pageSize)

    return {
      pages,
      participants,
      totalParticipants,
    }
  }

  async unregisterEvent(userId: string, eventId: string): Promise<void> {
    await prisma.participant.deleteMany({
      where: {
        user_id: userId,
        event_id: eventId,
      },
    })
  }

  async unregisterGroup(userId: string, groupId: string): Promise<void> {
    await prisma.participant.deleteMany({
      where: {
        user_id: userId,
        group_id: groupId,
      },
    })
  }
}
