import { ClientProxy } from '@nestjs/microservices';
import { anything, mock, when } from 'ts-mockito';

export const mockedMessagingClientProxy = mock(ClientProxy);

when(mockedMessagingClientProxy.emit(anything(), anything())).thenReturn();
