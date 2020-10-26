/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transport } from '@nestjs/microservices';
import { dbConfig } from './dbConfig';

export default (): any => ({
  clientSecret: process.env.CLIENT_SECRET || 'testClientSecret',
  privateKey: process.env.JWT_PRIVATE_KEY || 'testPrivateKey',
  accessTokenValidFor: parseInt(process.env.ACCESS_TOKEN_VALID_TIME) || 720000, // 12 min in ms
  refreshTokenValidFor:
    parseInt(process.env.REFRESH_TOKEN_VALID_TIME) || 604800000, // 7 days in ms
  db: dbConfig,
  coreMicroserviceOptions: {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'core_queue',
    },
  },
});
