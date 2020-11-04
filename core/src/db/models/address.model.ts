import { Column } from 'typeorm';

export class Address {
  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  zipCode: string;

  @Column('decimal')
  lat: number;

  @Column('decimal')
  lon: number;
}
