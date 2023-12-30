import { SocketStream } from '@fastify/websocket'
import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    connections: Map<string, SocketStream>
  }
}
