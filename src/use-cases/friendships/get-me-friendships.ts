import { FriendshipsRepository } from '@/repositories/friendships-repository'

export class GetMeFriendshipsUseCase {
  constructor(private friendshipRepository: FriendshipsRepository) {}

  async execute(userId: string, offset: number, query: string = '') {
    const friendships = await this.friendshipRepository.getUserFriendShips(
      userId,
      offset,
      query,
    )

    const friends = friendships.friendships.map((friendship) => {
      const friend =
        friendship.senderId === userId ? friendship.receiver : friendship.sender
      const { name, nick, id, profile_url } = friend
      return { name, nick, id, profile_url }
    })

    return { friends, totalPages: friendships.totalPages }
  }
}
