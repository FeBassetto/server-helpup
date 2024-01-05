import '@fastify/jwt'

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      sub: string
      isAdmin: boolean
      isConfirmed: boolean
      isDeleted: boolean
      isDeleteMail?: boolean
      isConfirmMail?: boolean
    }
  }
}
