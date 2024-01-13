import { Friendship, Prisma } from '@prisma/client'

import { env } from '@/env'

import {
  FriendshipsRepository,
  FriendshipPayload,
  GetFriendshipPayload,
  FriendshipWithPagination,
  FriendshipWithUserDataAndPagination,
} from '../friendships-repository'

import { prisma } from '@/lib/prisma'

export class PrismaFriendshipRepository implements FriendshipsRepository {
  async getUserFriendShips(
    userId: string,
    offset: number,
    query: string,
  ): Promise<FriendshipWithUserDataAndPagination> {
    const limit = env.NUMBER_RESULTS

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            receiver: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { nick: { contains: query, mode: 'insensitive' } },
              ],
            },
            isAccepted: true,
          },
          {
            receiverId: userId,
            sender: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { nick: { contains: query, mode: 'insensitive' } },
              ],
            },
            isAccepted: true,
          },
        ],
      },
      skip: offset,
      take: limit,
      include: {
        sender: true,
        receiver: true,
      },
    })

    const totalFriendshipCount = await prisma.friendship.count({
      where: {
        OR: [
          {
            senderId: userId,
            receiver: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { nick: { contains: query, mode: 'insensitive' } },
              ],
            },
            isAccepted: true,
          },
          {
            receiverId: userId,
            sender: {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { nick: { contains: query, mode: 'insensitive' } },
              ],
            },
            isAccepted: true,
          },
        ],
      },
    })

    const totalPages = Math.ceil(totalFriendshipCount / limit)

    return { friendships, totalPages }
  }

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

  async getFriendshipInvitates(
    userId: string,
    offset: number,
  ): Promise<FriendshipWithPagination> {
    const limit = env.NUMBER_RESULTS

    const friendships = await prisma.friendship.findMany({
      where: { receiverId: userId, isAccepted: null },
      skip: offset,
      take: limit,
    })

    const totalFriendshipCount = await prisma.friendship.count({
      where: { receiverId: userId, isAccepted: null },
    })

    const totalPages = Math.ceil(totalFriendshipCount / limit)

    return { friendships, totalPages }
  }

  async getSendFriendshipInvitates(
    userId: string,
    offset: number,
  ): Promise<FriendshipWithPagination> {
    const limit = env.NUMBER_RESULTS

    const friendships = await prisma.friendship.findMany({
      where: { senderId: userId, isAccepted: null },
      skip: offset,
      take: limit,
    })

    const totalFriendshipCount = await prisma.friendship.count({
      where: { senderId: userId, isAccepted: null },
    })

    const totalPages = Math.ceil(totalFriendshipCount / limit)

    return { friendships, totalPages }
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
