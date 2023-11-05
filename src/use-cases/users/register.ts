import { UsersRepository } from '@/repositories/users-repository'
import { getGeoLocation } from '@/utils/get-geo-location'
import { hash } from 'bcryptjs'
import { AppError } from '../../shared/errors/AppError'
import { usersErrorsConstants } from './errors/constants'

interface RegisterUseCaseRequest {
  cep: string
  city: string
  description: string
  email: string
  name: string
  neighborhood: string
  nick: string
  password: string
  street: string
  number: number
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    cep,
    city,
    description,
    email,
    name,
    neighborhood,
    nick,
    password,
    street,
    number,
  }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const { lat, lon } = await getGeoLocation({
      city,
      neighborhood,
      number,
      street,
    })

    const userAlreadyExists = await this.usersRepository.findUserByEmailOrNick({
      email,
      nick,
    })

    if (userAlreadyExists) {
      if (userAlreadyExists.email === email) {
        throw new AppError(usersErrorsConstants.ACCOUNT_EMAIL_ALREADY_EXISTS)
      }

      throw new AppError(usersErrorsConstants.ACCOUNT_NICK_ALREADY_EXISTS)
    }

    const newUser = await this.usersRepository.create({
      cep,
      city,
      description,
      email,
      latitude: lat,
      longitude: lon,
      name,
      nick,
      password_hash,
    })

    return newUser
  }
}
