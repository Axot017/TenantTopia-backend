import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

export class Address {
  @ApiProperty()
  @Column({ nullable: true })
  address: string;

  @ApiProperty()
  @Column({ nullable: true })
  city: string;

  @ApiProperty()
  @Column({ nullable: true })
  zipCode: string;

  @ApiProperty()
  @Column('decimal', { nullable: true })
  lat: number;

  @ApiProperty()
  @Column('decimal', { nullable: true })
  lon: number;
}
