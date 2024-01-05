import { Friendship, Prisma } from '@prisma/client'

import {
  FriendshipsRepository,
  FriendshipPayload,
  GetFriendshipPayload,
} from '../friendships-repository'

import { prisma } from '@/lib/prisma'

export class PrismaFriendshipRepository implements FriendshipsRepository {
  async createFriendship({
    senderId,
    receiverId,
    receiverName,
    senderName,
  }: FriendshipPayload): Promise<Friendship> {
    return await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        receiverName,
        senderName,
      },
    })
  }

  async getFriendshipByUsersId({
    userId,
    friendId,
  }: GetFriendshipPayload): Promise<Friendship | null> {
    return await prisma.friendship.findFirst({
      where: {
        OR: [
          { receiverId: userId, senderId: friendId },
          { receiverId: friendId, senderId: userId },
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
        OR: [{ senderId: userId }, { receiverId: userId }],
        isAccepted: true,
      },
    })
  }

  async getAllUserFriendshipsRequest(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
    })
  }

  async getFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: { receiverId: userId, isAccepted: null },
    })
  }

  async getSendFriendshipInvitates(userId: string): Promise<Friendship[]> {
    return await prisma.friendship.findMany({
      where: { senderId: userId, isAccepted: null },
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
