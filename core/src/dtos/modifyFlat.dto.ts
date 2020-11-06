import { IsString } from 'class-validator';
import { Address } from '../db/models/address.model';

export class ModifyFlatDto {
  @IsString()
  description: string;

  address: Address;
}
