import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { mock, when, objectContaining } from 'ts-mockito';
import { activeUser, inactiveUser } from './user.repository.mock';

export const mockedCoreClientProxy = mock(ClientProxy);

when(
  mockedCoreClientProxy.send(
    objectContaining({ cmd: 'getAccountById' }),
    activeUser.userId
  )
).thenReturn(of(activeUser));

when(
  mockedCoreClientProxy.send(
    objectContaining({ cmd: 'getAccountById' }),
    inactiveUser.userId
  )
).thenReturn(of(inactiveUser));
