import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsPositive } from 'class-validator';

export class AddBillDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsDefined()
  description: string;
}
