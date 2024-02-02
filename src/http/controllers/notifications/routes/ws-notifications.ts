import { FastifyInstance, FastifyRequest } from 'fastify'

import { SocketStream } from '@fastify/websocket'

export async function wsNotifications(
  this: FastifyInstance,
  connection: SocketStream,
  req: FastifyRequest,
) {
  const { sub } = req.user
  console.log('chegou')

  this.connections.set(sub, connection)

  connection.socket.on('open', () => {
    connection.socket.send('Connected to WS')
  })

  connection.socket.on('close', () => {
    connection.socket.send('Disconnected to WS')
    this.connections.delete(sub)
  })
}
