import { randomUUID } from 'node:crypto'

import { Group, Prisma } from '@prisma/client'

import { GroupRepository } from '../groups-repository'

export class InMemoryGroupRepository implements GroupRepository {
  private groups: Group[] = []

  async create(data: Prisma.GroupCreateInput): Promise<Group> {
    const newGroup: Group = {
      id: randomUUID(),
      title: data.title,
      description: data.description,
      admin_id: data.adminId as string,
      created_at: new Date(),
      city: data.city,
    }

    this.groups.push(newGroup)
    return newGroup
  }

  async getById(groupId: string): Promise<Group | null> {
    return this.groups.find((group) => group.id === groupId) || null
  }

  async getGroupsByUserId(userId: string): Promise<Group[]> {
    return this.groups.filter((group) => group.admin_id === userId)
  }

  async getByTitle(title: string): Promise<Group | null> {
    return this.groups.find((group) => group.title === title) || null
  }

  async update(groupId: string, data: Prisma.GroupUpdateInput): Promise<Group> {
    const index = this.groups.findIndex((group) => group.id === groupId)
    if (index === -1) {
      throw new Error('Group not found')
    }

    const groupToUpdate = this.groups[index]

    if (typeof data.title === 'string') {
      groupToUpdate.title = data.title
    }
    if (typeof data.description === 'string') {
      groupToUpdate.description = data.description
    }

    this.groups[index] = groupToUpdate
    return groupToUpdate
  }

  async delete(groupId: string): Promise<void> {
    const index = this.groups.findIndex((group) => group.id === groupId)
    if (index === -1) {
      throw new Error('Group not found')
    }
    this.groups.splice(index, 1)
  }
}
