import { usersErrorsConstants } from './errors/constants'

import { UsersRepository } from '@/repositories/users-repository'
import { AppError } from '@/shared/errors/AppError'

interface DeleteUseClassRequest {
  id: string
  deleteData: boolean
}

export class DeleteUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ deleteData, id }: DeleteUseClassRequest) {
    const user = await this.usersRepository.findUserById(id)

    if (!user) {
      throw new AppError(usersErrorsConstants.ACCOUNT_NOT_FOUND)
    }

    if (user.is_admin) {
      throw new AppError(usersErrorsConstants.ADMIN_NOT_ALLOWED_ACTION)
    }

    if (deleteData) {
      return await this.usersRepository.deleteUserDataById(id)
    } else {
      return await this.usersRepository.deleteUserStatusById(id)
    }
  }
}
