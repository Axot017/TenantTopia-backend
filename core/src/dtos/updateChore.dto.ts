import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class UpdateChoreDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  icon: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  repeats: boolean;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  accountId: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  done: boolean;
}
