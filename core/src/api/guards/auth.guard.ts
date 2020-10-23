import {
  CanActivate,
  Injectable,
  ExecutionContext,
  Inject,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError } from 'rxjs/operators';
import { TimeoutError, throwError } from 'rxjs';
import { Account } from '../../db/models/account.model';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_MICROSERVICE_CLIENT')
    private readonly authClient: ClientProxy,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler()
    );

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token = req.get('authorization');

    if (!token) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const account = await this.authClient
      .send<Account>(
        {
          cmd: 'authenticate',
        },
        token
      )
      .pipe(
        timeout(5000),
        catchError((e) => {
          if (e instanceof TimeoutError) {
            return throwError(new RequestTimeoutException());
          } else {
            return throwError(new UnauthorizedException(e.message));
          }
        })
      )
      .toPromise();

    req.account = account;

    return true;
  }
}
