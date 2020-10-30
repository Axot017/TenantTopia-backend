/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transport } from '@nestjs/microservices';
import { dbConfig } from './dbConfig';

export default (): any => ({
  clientSecret: process.env.CLIENT_SECRET || 'testClientSecret',
  privateKey: process.env.JWT_PRIVATE_KEY || 'testPrivateKey',
  baseUrl: process.env.BASE_URL || 'http://127.0.0.1:3100',
  accessTokenValidFor: parseInt(process.env.ACCESS_TOKEN_VALID_TIME) || 720000, // 12 min in ms
  refreshTokenValidFor:
    parseInt(process.env.REFRESH_TOKEN_VALID_TIME) || 604800000, // 7 days in ms
  db: dbConfig[process.env.DB_TYPE || 'sqlite'],
  coreMicroserviceOptions: {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'core_queue',
    },
  },
  messagingMicroserviceOptions: {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'messaging_queue',
    },
  },
});
