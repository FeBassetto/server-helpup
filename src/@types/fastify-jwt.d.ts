import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      isAdmin: boolean
      isConfirmed: boolean
      isDeleted: boolean
    }
  }
}
