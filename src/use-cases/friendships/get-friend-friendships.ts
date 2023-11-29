/* eslint-disable @typescript-eslint/no-unused-vars */
import { Friendship } from '@prisma/client'

import { FriendshipsRepository } from '@/repositories/friendships-repository'

interface GetFriendFriendshipsUseCaseRequest {
  userId: string
  friendId: string
}

export class GetFriendFriendshipsUseCase {
  constructor(private friendshipRepository: FriendshipsRepository) {}

  async execute({ friendId, userId }: GetFriendFriendshipsUseCaseRequest) {
    const isFriends = await this.friendshipRepository.getFriendshipByUsersId({
      userId1: userId,
      userId2: friendId,
    })

    let friendFriendShipList: Friendship[] = []

    if (isFriends) {
      friendFriendShipList =
        await this.friendshipRepository.getAllUserFriendships(friendId)
    }

    const friendFriendShipListFiltered = friendFriendShipList
      .filter((friendship) => {
        return friendship.userId1 !== userId && friendship.userId2 !== userId
      })
      .map(({ isAccepted, created_at, ...rest }) => rest)

    return { friendShips: friendFriendShipListFiltered, isFriends: !!isFriends }
  }
}
