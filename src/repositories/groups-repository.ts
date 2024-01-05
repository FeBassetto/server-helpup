import { Group, Prisma } from '@prisma/client'

export interface GroupRepository {
  create(data: Prisma.GroupCreateInput): Promise<Group>

  getById(groupId: string): Promise<Group | null>
  getGroupsByUserId(userId: string): Promise<Group[]>
  getByTitle(title: string): Promise<Group | null>

  update(groupId: string, data: Prisma.GroupUpdateInput): Promise<Group>

  delete(groupId: string): Promise<void>
}
