import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../db/models/user.model';
import { UserRepository } from '../db/repositories/user.repository';
import { AuthResponseDto } from '../dtos/authResponse.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';

export const EMAIL_CONFIRMED = 'Email confirmed!';
export const EMAIL_ALREADY_CONFIRMED = 'Email confirmed!';
export const INVALID_VERIFICATION_CODE = 'Invalid verification code!';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid user or password');
    }

    if (!user.isConfirmed) {
      throw new UnauthorizedException('User not confirmed');
    }

    if (!compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid user or password');
    }

    return this.generateTokens(user);
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    const privateKey = this.configService.get<string>('privateKey');

    let user: User;

    try {
      const tokenPayload = verify(refreshTokenDto.refreshToken, privateKey) as {
        userId: number;
      };

      user = await this.userRepository.findOneById(tokenPayload.userId);
    } catch (e) {
      throw new UnauthorizedException();
    }

    if (!user) {
      throw new ConflictException('User already deleted');
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: User): AuthResponseDto {
    const privateKey = this.configService.get<string>('privateKey');
    const accessTokenExpiresIn = this.configService.get<number>(
      'accessTokenValidFor'
    );
    const refreshTokenExpiresIn = this.configService.get<number>(
      'refreshTokenValidFor'
    );

    const accessToken = sign({ userId: user.userId }, privateKey, {
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = sign(
      { userId: user.userId, accessToken },
      privateKey,
      {
        expiresIn: refreshTokenExpiresIn,
      }
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresIn,
      accessTokenExpiresIn,
    };
  }

  async verifyEmail(code: string): Promise<string> {
    const user = await this.userRepository.findOneByConfirmationCode(code);

    if (!user) {
      return INVALID_VERIFICATION_CODE;
    } else if (user.isConfirmed) {
      return EMAIL_ALREADY_CONFIRMED;
    }

    user.isConfirmed = true;

    await this.userRepository.save(user);

    return EMAIL_CONFIRMED;
  }
}
