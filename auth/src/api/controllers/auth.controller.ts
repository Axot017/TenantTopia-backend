import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from '../../dtos/authResponse.dto';
import { LoginDto } from '../../dtos/login.dto';
import { RefreshTokenDto } from '../../dtos/refreshToken.dto';
import { AuthService } from '../../services/auth.service';
import { ClientSecretGuard } from '../guards/clientSecret.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ type: AuthResponseDto, status: 200 })
  @UseGuards(ClientSecretGuard)
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @ApiResponse({ type: AuthResponseDto, status: 200 })
  @UseGuards(ClientSecretGuard)
  @Post('refresh')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
