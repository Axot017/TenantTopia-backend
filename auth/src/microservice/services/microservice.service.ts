/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { verify } from 'jsonwebtoken';
import { User } from '../../db/models/user.model';
import { UserRepository } from '../../db/repositories/user.repository';
import { CreateUserDto } from '../dtos/createUser.dto';
import { timeout, catchError } from 'rxjs/operators';
import { throwError, TimeoutError } from 'rxjs';
import { hash } from 'bcrypt';
import { resolve } from 'url';

@Injectable()
export class MicroserviceService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    @Inject('CORE_MICROSERVICE_CLIENT')
    private readonly coreClient: ClientProxy,
    @Inject('MESSAGING_MICROSERVICE_CLIENT')
    private readonly messagingClient: ClientProxy
  ) {}

  async validateToken(authenticationHeader: string): Promise<any> {
    if (!authenticationHeader.startsWith('Bearer ')) {
      throw new RpcException('Missing "Bearer " before token');
    }

    const token = authenticationHeader.replace('Bearer ', '');
    const privateKey = this.configService.get<string>('privateKey');

    let userId: number;
    try {
      const tokenPayload = verify(token, privateKey) as { userId: number };
      userId = tokenPayload.userId;
    } catch (e) {
      throw new RpcException('Invalid token');
    }

    return this.coreClient
      .send({ cmd: 'getAccountById' }, userId)
      .pipe(
        timeout(5000),
        catchError((e) => {
          if (e instanceof TimeoutError) {
            return throwError(new RpcException('timeout'));
          } else {
            return throwError(new RpcException(e.message));
          }
        })
      )
      .toPromise();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(createUserDto.password, 10);
    const user: User = {
      userId: createUserDto.userId,
      email: createUserDto.email,
      password: hashedPassword,
    } as User;

    await this.userRepository.save(user);

    const savedUser = await this.userRepository.findOneByEmail(
      createUserDto.email
    );

    const baseUrl = this.configService.get<string>('baseUrl');
    const confirmationUrl = resolve(
      resolve(baseUrl, '/auth/verify/'),
      savedUser.confirmationCode
    );

    Logger.log(`Confirmation url for ${savedUser.email} - ${confirmationUrl}`);

    this.messagingClient.emit(
      { cmd: 'sendVerificationEmail' },
      {
        email: savedUser.email,
        confirmationUrl,
      }
    );

    return savedUser;
  }
}
