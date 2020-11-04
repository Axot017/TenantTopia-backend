import { ApiProperty } from '@nestjs/swagger';

export class EditAccountDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phoneNo: string;

  @ApiProperty()
  accountNo: string;
}
