import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxyFactory } from '@nestjs/microservices';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'AUTH_MICROSERVICE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const authMicroserviceOptions = configService.get<ClientOptions>(
          'authMicroserviceOptions'
        );
        return ClientProxyFactory.create(authMicroserviceOptions);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['AUTH_MICROSERVICE_CLIENT'],
})
export class AuthClientModule {}
