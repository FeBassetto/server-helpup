import { Participant, Prisma, User } from '@prisma/client'

export interface GetGroupParticipantsParams {
  groupId: string
  query?: string
  orderBy?: 'asc' | 'desc'
  offset: number
}

export interface GetEventParticipantsParams {
  eventId: string
  query?: string
  orderBy?: 'asc' | 'desc'
  offset: number
}

interface PrismaParticipant extends Participant {
  user: User
}

export interface GetParticipantsResponse {
  pages: number
  participants: PrismaParticipant[]
  totalParticipants: number
}

export interface ParticipantRepository {
  register(data: Prisma.ParticipantCreateInput): Promise<void>

  getParticipantByGroupId(
    userId: string,
    groupId: string,
  ): Promise<Participant | null>
  getParticipantByEventId(
    userId: string,
    eventId: string,
  ): Promise<Participant | null>
  getGroupParticipants(
    data: GetGroupParticipantsParams,
  ): Promise<GetParticipantsResponse>
  getEventParticipants(
    data: GetEventParticipantsParams,
  ): Promise<GetParticipantsResponse>

  unregisterEvent(userId: string, eventId: string): Promise<void>
  unregisterGroup(userId: string, groupId: string): Promise<void>
}
