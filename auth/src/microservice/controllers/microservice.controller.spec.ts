import { ConfigService } from '@nestjs/config';
import configuration from '../../config/config';
import {
  activeUser,
  mockedUserRepository,
} from '../../__mocks__/user.repository.mock';
import { instance } from 'ts-mockito';
import { MicroserviceController } from './microservice.controller';
import { MicroserviceService } from '../services/microservice.service';
import { mockedCoreClientProxy } from '../../__mocks__/coreClientProxy.mock';
import { mockedMessagingClientProxy } from '../../__mocks__/messagingClientProxy.mock';

describe('Auth Controller', () => {
  let controller: MicroserviceController;
  const config = configuration();

  beforeAll(() => {
    const userRepository = instance(mockedUserRepository);
    const configService = new ConfigService(config);
    const coreClientProxy = instance(mockedCoreClientProxy);
    const messagingClientProxy = instance(mockedMessagingClientProxy);
    const microserviceService = new MicroserviceService(
      userRepository,
      configService,
      coreClientProxy,
      messagingClientProxy
    );
    controller = new MicroserviceController(microserviceService);
  });

  test('Create User - success', async () => {
    const response = await controller.createUser(activeUser);
    expect(response).toEqual(activeUser);
  });
});
