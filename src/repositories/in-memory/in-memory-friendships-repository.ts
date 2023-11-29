import { randomUUID } from 'crypto'

import { Friendship } from '@prisma/client'

import {
  FrendshipPayload,
  FriendshipsRepository,
} from '../friendships-repository'

export class InMemoryFriendshipRepository implements FriendshipsRepository {
  private friendships: Friendship[] = []

  async createFriendship({
    userId1,
    userId2,
  }: FrendshipPayload): Promise<void> {
    const newFriendship: Friendship = {
      id: randomUUID(),
      userId1,
      userId2,
      isAccepted: null,
      created_at: new Date(),
    }

    this.friendships.push(newFriendship)
  }

  async getFriendshipByUsersId({
    userId1,
    userId2,
  }: FrendshipPayload): Promise<Friendship | null> {
    return (
      this.friendships.find(
        (f) =>
          (f.userId1 === userId1 && f.userId2 === userId2) ||
          (f.userId1 === userId2 && f.userId2 === userId1),
      ) || null
    )
  }

  async getFriendShipById(friendshipId: string): Promise<Friendship | null> {
    return this.friendships.find((f) => f.id === friendshipId) || null
  }

  async getAllUserFriendships(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) =>
        (f.userId1 === userId || f.userId2 === userId) && f.isAccepted === true,
    )
  }

  async getFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.userId2 === userId && f.isAccepted === null,
    )
  }

  async getSendFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.userId1 === userId && f.isAccepted === null,
    )
  }

  async updateFriendshipById(
    data: Partial<Friendship>,
    friendshipId: string,
  ): Promise<void> {
    const friendshipIndex = this.friendships.findIndex(
      (f) => f.id === friendshipId,
    )

    if (friendshipIndex !== -1) {
      this.friendships[friendshipIndex] = {
        ...this.friendships[friendshipIndex],
        ...data,
      }
    }
  }

  async deleteFriendshipById(friendshipId: string): Promise<void> {
    const friendshipIndex = this.friendships.findIndex(
      (f) => f.id === friendshipId,
    )
    if (friendshipIndex >= 0) {
      this.friendships.splice(friendshipIndex, 1)
    }
  }
}
