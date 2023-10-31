import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(
  async (instance, opts, next) => {
    instance.register(usersRoutes, { prefix: '/api' })

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

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // after
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
