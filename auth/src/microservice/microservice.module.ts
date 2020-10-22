import { Module } from '@nestjs/common';
import { MicroserviceController } from './controllers/microservice.controller';
import { MicroserviceService } from './services/microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../db/repositories/user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxyFactory } from '@nestjs/microservices';

@Module({
  controllers: [MicroserviceController],
  providers: [
    MicroserviceService,
    {
      provide: 'CORE_MICROSERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const coreMicroserviceOptions = configService.get<ClientOptions>(
          'coreMicroserviceOptions'
        );
        return ClientProxyFactory.create(coreMicroserviceOptions);
      },
      inject: [ConfigService],
    },
  ],
  imports: [TypeOrmModule.forFeature([UserRepository]), ConfigModule],
})
export class MicroserviceModule {}
