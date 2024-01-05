import { FriendshipsRepository } from '@/repositories/friendships-repository'

export class GetFriendshipInvitationsUseCase {
  constructor(private friendshipRepository: FriendshipsRepository) {}

  async execute(userId: string) {
    const [friendshipInvitations, friendshipSent] = await Promise.all([
      this.friendshipRepository.getFriendshipInvitates(userId),
      this.friendshipRepository.getSendFriendshipInvitates(userId),
    ])

    const invitations = friendshipInvitations.map((invitation) => {
      return {
        id: invitation.id,
        friendId: invitation.senderId,
        friendName: invitation.senderName,
        created_at: invitation.created_at,
      }
    })

    const sentInvitations = friendshipSent.map((invitation) => {
      return {
        id: invitation.id,
        friendId: invitation.senderId,
        friendName: invitation.receiverName,
        created_at: invitation.created_at,
      }
    })

    return { invitations, sentInvitations }
  }
}
