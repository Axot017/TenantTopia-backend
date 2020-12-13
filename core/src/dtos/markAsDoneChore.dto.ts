import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class MarkAsDoneChoreDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  done: boolean;
}
