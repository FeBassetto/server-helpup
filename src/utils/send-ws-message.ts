import { FastifyInstance } from 'fastify'

export function sendWsMessages(
  app: FastifyInstance,
  userIds: string[],
  message: string,
  title: string,
) {
  userIds.forEach((userId) => {
    const connection = app.connections.get(userId)
    if (connection) {
      connection.socket.send(`{title: ${title}, message: ${message}}`)
    }
  })
}
