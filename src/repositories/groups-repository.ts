import { Group, Prisma } from '@prisma/client'

export interface GroupQuery {
  title: string
  orderBy?: 'asc' | 'desc'
  offset: number
}
export interface GroupsQuery {
  lat: number
  long: number
  query: GroupQuery
}

export interface GetGroupsByDistanceAndQueryResponse {
  groups: Group[]
  totalPages: number
  totalGroups: number
}

export interface GroupRepository {
  create(data: Prisma.GroupCreateInput): Promise<Group>

  getById(groupId: string): Promise<Group | null>
  getGroupsByUserId(
    userId: string,
    offset?: number,
    query?: string,
  ): Promise<{ groups: Group[]; totalPages: number }>
  getByTitle(title: string): Promise<Group | null>

  getGroupsByDistanceAndQuery(
    data: GroupsQuery,
  ): Promise<GetGroupsByDistanceAndQueryResponse>

  update(groupId: string, data: Prisma.GroupUpdateInput): Promise<Group>

  delete(groupId: string): Promise<void>
}
