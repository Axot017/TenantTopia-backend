import { ConfigService } from '@nestjs/config';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoginDto } from '../../dtos/login.dto';
import { RefreshTokenDto } from '../../dtos/refreshToken.dto';

@Injectable()
export class ClientSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const body = context.switchToHttp().getRequest().body as
      | LoginDto
      | RefreshTokenDto;

    return body.clientSecret === this.configService.get<string>('clientSecret');
  }
}
