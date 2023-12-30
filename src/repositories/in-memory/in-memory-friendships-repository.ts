import { randomUUID } from 'crypto'

import { Friendship } from '@prisma/client'

import {
  FrendshipPayload,
  FriendshipsRepository,
} from '../friendships-repository'

export class InMemoryFriendshipRepository implements FriendshipsRepository {
  private friendships: Friendship[] = []

  async createFriendship({
    senderId,
    receiverId,
    receiverName,
    senderName,
  }: FrendshipPayload): Promise<Friendship> {
    const newFriendship: Friendship = {
      id: randomUUID(),
      senderId,
      receiverId,
      isAccepted: null,
      created_at: new Date(),
      receiverName,
      senderName,
    }

    this.friendships.push(newFriendship)

    return newFriendship
  }

  async getFriendshipByUsersId({
    senderId,
    receiverId,
  }: FrendshipPayload): Promise<Friendship | null> {
    return (
      this.friendships.find(
        (f) =>
          (f.senderId === senderId && f.receiverId === receiverId) ||
          (f.senderId === receiverId && f.receiverId === senderId),
      ) || null
    )
  }

  async getFriendShipById(friendshipId: string): Promise<Friendship | null> {
    return this.friendships.find((f) => f.id === friendshipId) || null
  }

  async getAllUserFriendships(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) =>
        (f.senderId === userId || f.receiverId === userId) &&
        f.isAccepted === true,
    )
  }

  async getAllUserFriendshipsRequest(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.senderId === userId || f.receiverId === userId,
    )
  }

  async getFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.receiverId === userId && f.isAccepted === null,
    )
  }

  async getSendFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return this.friendships.filter(
      (f) => f.senderId === userId && f.isAccepted === null,
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
