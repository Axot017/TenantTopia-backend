import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
  @IsNotEmpty()
  clientSecret: string;
}
