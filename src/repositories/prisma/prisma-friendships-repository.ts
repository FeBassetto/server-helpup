import { Friendship, Prisma } from '@prisma/client'

import {
  FrendshipPayload,
  FriendshipsRepository,
} from '../friendships-repository'

import { prisma } from '@/lib/prisma'

export class PrismaFriendshipRepository implements FriendshipsRepository {
  async createFriendship({
    userId1,
    userId2,
  }: FrendshipPayload): Promise<Friendship> {
    return await prisma.friendship.create({
      data: {
        userId1,
        userId2,
      },
    })
  }

  async getFriendshipByUsersId({
    userId1,
    userId2,
  }: FrendshipPayload): Promise<Friendship | null> {
    return await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId1, userId2 },
          { userId1: userId2, userId2: userId1 },
        ],
      },
    })
  }

  async getFriendShipById(friendshipId: string): Promise<Friendship | null> {
    return await prisma.friendship.findUnique({
      where: { id: friendshipId },
    })
  }

  async getAllUserFriendships(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
        isAccepted: true,
      },
    })
  }

  async getAllUserFriendshipsRequest(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
      },
    })
  }

  async getFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: { userId2: userId, isAccepted: null },
    })
  }

  async getSendFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: { userId1: userId, isAccepted: null },
    })
  }

  async updateFriendshipById(
    data: Prisma.FriendshipUpdateInput,
    friendShipId: string,
  ): Promise<void> {
    await prisma.friendship.update({ where: { id: friendShipId }, data })
  }

  async deleteFriendshipById(friendshipId: string): Promise<void> {
    await prisma.friendship.delete({ where: { id: friendshipId } })
  }
}
