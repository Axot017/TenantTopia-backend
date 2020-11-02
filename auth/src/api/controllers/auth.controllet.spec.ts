import { ConfigService } from '@nestjs/config';
import configuration from '../../config/config';
import {
  AuthService,
  EMAIL_ALREADY_CONFIRMED,
  EMAIL_CONFIRMED,
  INVALID_VERIFICATION_CODE,
} from '../../services/auth.service';
import {
  inactiveUser,
  mockedUserRepository,
} from '../../__mocks__/user.repository.mock';
import { AuthController } from './auth.controller';
import { activeUser } from '../../__mocks__/user.repository.mock';
import { instance } from 'ts-mockito';
import { UnauthorizedException } from '@nestjs/common';

describe('Auth Controller', () => {
  let controller: AuthController;
  const config = configuration();

  beforeAll(() => {
    const configService = new ConfigService(config);
    const userRepository = instance(mockedUserRepository);
    const authService = new AuthService(userRepository, configService);
    controller = new AuthController(authService);
  });

  test('Login - success', async () => {
    const response = await controller.login({
      email: activeUser.email,
      password: 'test',
      clientSecret: '',
    });

    expect(response).toBeDefined;
  });

  test('Login - invalid user', async () => {
    try {
      await controller.login({
        email: 'invalid email',
        password: 'test',
        clientSecret: '',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect((e as UnauthorizedException).message).toEqual(
        'Invalid user or password'
      );
    }
  });

  test('Login - invalid password', async () => {
    try {
      await controller.login({
        email: activeUser.email,
        password: 'invalid password',
        clientSecret: '',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect((e as UnauthorizedException).message).toEqual(
        'Invalid user or password'
      );
    }
  });

  test('Login - inactive user', async () => {
    try {
      await controller.login({
        email: inactiveUser.email,
        password: 'test',
        clientSecret: '',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
      expect((e as UnauthorizedException).message).toEqual(
        'User not confirmed'
      );
    }
  });

  test('Refresh - success', async () => {
    const loginResponse = await controller.login({
      email: activeUser.email,
      password: 'test',
      clientSecret: '',
    });

    const refreshResponse = await controller.refreshToken({
      clientSecret: '',
      refreshToken: loginResponse.refreshToken,
    });

    expect(refreshResponse).toBeDefined();
  });

  test('Refresh - invalid token', async () => {
    try {
      await controller.refreshToken({
        clientSecret: '',
        refreshToken: 'invalid token',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  test('Verify account - success', async () => {
    try {
      const { message } = await controller.verifyEmail(
        inactiveUser.confirmationCode
      );
      expect(message).toEqual(EMAIL_CONFIRMED);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  test('Verify account - invalid code', async () => {
    try {
      const { message } = await controller.verifyEmail('Invalid code');
      expect(message).toEqual(INVALID_VERIFICATION_CODE);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });

  test('Verify account - already verified', async () => {
    try {
      const { message } = await controller.verifyEmail(
        activeUser.confirmationCode
      );
      expect(message).toEqual(EMAIL_ALREADY_CONFIRMED);
    } catch (e) {
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
