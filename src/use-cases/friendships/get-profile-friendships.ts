/* eslint-disable @typescript-eslint/no-unused-vars */
import { FriendshipsRepository } from '@/repositories/friendships-repository'

export class GetProfileFriendshipsUseCase {
  constructor(private friendshipRepository: FriendshipsRepository) {}

  async execute(userId: string) {
    const friendShips =
      await this.friendshipRepository.getAllUserFriendships(userId)

    const filteredFriendShips = friendShips.map(
      ({ isAccepted, ...rest }) => rest,
    )

    return filteredFriendShips
  }
}
