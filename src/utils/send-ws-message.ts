import { FastifyInstance } from 'fastify'

export function sendWsMessage(
  app: FastifyInstance,
  userId: string,
  message: string,
) {
  const connection = app.connections.get(userId)
  if (connection) {
    connection.socket.send(message)
  }
}
