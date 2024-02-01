/* eslint-disable @typescript-eslint/no-unused-vars */
import { usersErrorsConstants } from '../users/errors/constants'

import { FriendshipsRepository } from '@/repositories/friendships-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface GetFriendSuggestionsUseCaseRequest {
  userId: string
  offset: number
  query?: string
}

export class GetFriendSuggestionsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private friendshipsRepository: FriendshipsRepository,
  ) {}

  async execute({ offset, userId, query }: GetFriendSuggestionsUseCaseRequest) {
    const user = await this.usersRepository.getUserDataById(userId)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    let ignoreIdList: Array<string> = [user.id]

    const userFriendShips =
      await this.friendshipsRepository.getAllUserFriendshipsRequest(userId)

    userFriendShips.forEach((friendship) => {
      ignoreIdList.push(friendship.senderId, friendship.receiverId)
    })

    ignoreIdList = [...new Set(ignoreIdList)]

    const friendSuggestions = await this.usersRepository.getFriendSuggestions({
      ignoreIdList,
      latitude: Number(user.latitude),
      longitude: Number(user.longitude),
      offset,
      query,
    })

    const sanitizedSuggestions = friendSuggestions.users.map(
      ({
        password_hash,
        latitude,
        longitude,
        is_admin,
        is_confirmed,
        is_deleted,
        cep,
        created_at,
        ...rest
      }) => rest,
    )

    return {
      friends: sanitizedSuggestions,
      totalPages: friendSuggestions.totalPages,
    }
  }
}
