import { anything, mock, when } from 'ts-mockito';
import { User } from '../db/models/user.model';
import { UserRepository } from '../db/repositories/user.repository';

export const activeUser: User = {
  email: 'test@test.com',
  userId: 1,
  password: '$2b$10$sQCYm0K1E90zHqFPsIillOj3apspW104TYhm9TKx1d468JF0XiVQW', // "test"
  isConfirmed: true,
  confirmationCode: 'confirmationCode',
} as User;

export const inactiveUser: User = {
  email: 'test2@test.com',
  userId: 2,
  password: '$2b$10$sQCYm0K1E90zHqFPsIillOj3apspW104TYhm9TKx1d468JF0XiVQW', // "test"
  isConfirmed: false,
  confirmationCode: 'confirmationCode',
} as User;

export const mockedUserRepository: UserRepository = mock<UserRepository>();

when(mockedUserRepository.findOneByEmail(activeUser.email)).thenResolve(
  activeUser
);

when(mockedUserRepository.findOneByEmail(inactiveUser.email)).thenResolve(
  inactiveUser
);

when(mockedUserRepository.findOneById(activeUser.userId)).thenResolve(
  activeUser
);

when(mockedUserRepository.findOneById(inactiveUser.userId)).thenResolve(
  inactiveUser
);

when(
  mockedUserRepository.findOneByConfirmationCode(activeUser.confirmationCode)
).thenResolve(activeUser);

when(
  mockedUserRepository.findOneByConfirmationCode(inactiveUser.confirmationCode)
).thenResolve(inactiveUser);

when(mockedUserRepository.save(anything())).thenResolve(activeUser);
