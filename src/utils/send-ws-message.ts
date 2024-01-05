import { FastifyInstance } from 'fastify'

export function sendWsMessages(
  app: FastifyInstance,
  userIds: string[],
  message: string,
) {
  userIds.forEach((userId) => {
    const connection = app.connections.get(userId)
    if (connection) {
      connection.socket.send(message)
    }
  })
}
