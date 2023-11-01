import { UsersRepository } from '@/repositories/users-repository'
import { getGeoLocation } from '@/utils/get-geo-location'
import axios from 'axios'
import { hash } from 'bcryptjs'
import { AppError } from './errors/AppError'

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

    const userAlreadyExists = await this.usersRepository.findUserByEmailAndNick(
      { email, nick },
    )

    if (userAlreadyExists) {
      throw new AppError({
        code: 400,
        message: 'Já existe um usuário cadastrado com este email',
      })
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
