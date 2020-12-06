import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateChoreDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  icon: string;

  @IsBoolean()
  @ApiProperty()
  repeats: boolean;

  @IsInt()
  @ApiProperty()
  accountId: number;
}
