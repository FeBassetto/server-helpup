import fastify from 'fastify'
import { ZodError } from 'zod'

import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'

import { env } from './env'
import { pingRoutes } from './http/controllers/ping/routes'
import { usersRoutes } from './http/controllers/users/routes'
import { AppError } from './shared/errors/AppError'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(
  async (instance, opts, next) => {
    instance.register(pingRoutes)
    instance.register(usersRoutes, { prefix: '/users' })

    next()
  },
  { prefix: '/api' },
)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (error instanceof AppError) {
    return reply
      .status(error.code)
      .send({ error: true, message: error.message, type: error.type })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // after
  }

  return reply
    .status(500)
    .send({ message: 'Tivemos um erro interno, tente novamente mais tarde.' })
})
