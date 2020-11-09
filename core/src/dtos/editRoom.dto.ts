import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsEmail, IsOptional, IsString } from 'class-validator';

export class EditRoomDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsDecimal()
  cost: number;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  ownerEmail: string;
}
