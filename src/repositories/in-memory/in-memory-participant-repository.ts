import { Participant, Prisma } from '@prisma/client'

import {
  GetEventParticipantsParams,
  GetGroupParticipantsParams,
  GetParticipantsResponse,
  ParticipantRepository,
} from '../participant-repository'

export class InMemoryParticipantRepository implements ParticipantRepository {
  private participants: Participant[] = []

  async register(data: Prisma.ParticipantCreateInput): Promise<void> {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: data.user.connect?.id || '',
      group_id: data.group?.connect?.id || null,
      event_id: data.event?.connect?.id || null,
    } as Participant

    this.participants.push(newParticipant)
  }

  async getGroupParticipants({
    groupId,
    offset = 0,
    orderBy = 'asc',
    query = '',
  }: GetGroupParticipantsParams): Promise<GetParticipantsResponse> {
    const filteredParticipants = this.participants.filter(
      (p) =>
        p.group_id === groupId &&
        (p.user.name.includes(query) || p.user.nick.includes(query)),
    )

    if (orderBy === 'desc') {
      filteredParticipants.sort((a, b) =>
        b.user.name.localeCompare(a.user.name),
      )
    } else {
      filteredParticipants.sort((a, b) =>
        a.user.name.localeCompare(b.user.name),
      )
    }

    const totalParticipants = filteredParticipants.length
    const pageSize = 6
    const pages = Math.ceil(totalParticipants / pageSize)

    return {
      pages,
      participants: filteredParticipants.slice(offset, offset + pageSize),
      totalParticipants,
    }
  }

  async getEventParticipants({
    eventId,
    offset = 0,
    orderBy = 'asc',
    query = '',
  }: GetEventParticipantsParams): Promise<GetParticipantsResponse> {
    const filteredParticipants = this.participants.filter(
      (p) =>
        p.event_id === eventId &&
        (p.user.name.includes(query) || p.user.nick.includes(query)),
    )

    if (orderBy === 'desc') {
      filteredParticipants.sort((a, b) =>
        b.user.name.localeCompare(a.user.name),
      )
    } else {
      filteredParticipants.sort((a, b) =>
        a.user.name.localeCompare(b.user.name),
      )
    }

    const totalParticipants = filteredParticipants.length
    const pageSize = 6
    const pages = Math.ceil(totalParticipants / pageSize)

    return {
      pages,
      participants: filteredParticipants.slice(offset, offset + pageSize),
      totalParticipants,
    }
  }

  async unregisterEvent(userId: string, eventId: string): Promise<void> {
    this.participants = this.participants.filter(
      (participant) =>
        !(participant.user_id === userId && participant.event_id === eventId),
    )
  }

  async unregisterGroup(userId: string, groupId: string): Promise<void> {
    this.participants = this.participants.filter(
      (participant) =>
        !(participant.user_id === userId && participant.group_id === groupId),
    )
  }
}
