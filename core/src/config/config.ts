/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transport } from '@nestjs/microservices';
import { dbConfig } from './dbConfig';

export default (): any => ({
  db: dbConfig[process.env.DB_TYPE || 'sqlite'],
  authMicroserviceOptions: {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'auth_queue',
    },
  },
});
