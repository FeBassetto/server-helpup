import { FriendshipsRepository } from '@/repositories/friendships-repository'

export class GetFriendshipInvitationsUseCase {
  constructor(private friendshipRepository: FriendshipsRepository) {}

  async execute(userId: string, offset: number, isSentInvites: boolean) {
    if (isSentInvites) {
      const friendshipSent =
        await this.friendshipRepository.getSendFriendshipInvitates(
          userId,
          offset,
        )

      const sentInvitations = friendshipSent.friendships.map((invitation) => {
        return {
          id: invitation.id,
          friendId: invitation.senderId,
          friendName: invitation.receiverName,
          created_at: invitation.created_at,
        }
      })

      return {
        invitations: sentInvitations,
        totalPages: friendshipSent.totalPages,
      }
    }

    const friendshipInvitations =
      await this.friendshipRepository.getFriendshipInvitates(userId, offset)

    const invitations = friendshipInvitations.friendships.map((invitation) => {
      return {
        id: invitation.id,
        friendId: invitation.senderId,
        friendName: invitation.senderName,
        created_at: invitation.created_at,
      }
    })

    return { invitations, totalPages: friendshipInvitations.totalPages }
  }
}
