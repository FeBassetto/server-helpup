/* eslint-disable @typescript-eslint/no-unused-vars */
import { Friendship } from '@prisma/client'

import {
  FriendshipWithUserDataAndPagination,
  FriendshipsRepository,
} from '@/repositories/friendships-repository'

interface GetFriendFriendshipsUseCaseRequest {
  userId: string
  friendId: string
  offset: number
  query?: string
}

export class GetFriendFriendshipsUseCase {
  constructor(private friendshipRepository: FriendshipsRepository) {}

  async execute({
    friendId,
    userId,
    offset,
    query,
  }: GetFriendFriendshipsUseCaseRequest) {
    const isFriends = await this.friendshipRepository.getFriendshipByUsersId({
      userId,
      friendId,
    })

    let friendFriendShipList: FriendshipWithUserDataAndPagination = {
      friendships: [],
      totalPages: 0,
    }

    if (isFriends?.isAccepted) {
      friendFriendShipList = await this.friendshipRepository.getUserFriendShips(
        friendId,
        offset,
        query || '',
      )
    }

    const friendFriendShipListFiltered = friendFriendShipList.friendships
      .filter((friendship) => {
        return (
          friendship.senderId !== userId && friendship.receiverId !== userId
        )
      })
      .map(({ isAccepted, created_at, ...rest }) => rest)

    return {
      friendShips: friendFriendShipListFiltered,
      isFriends: isFriends?.isAccepted === null ? false : isFriends?.isAccepted,
      totalPages: friendFriendShipList.totalPages,
    }
  }
}
