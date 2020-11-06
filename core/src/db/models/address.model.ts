import { Column } from 'typeorm';

export class Address {
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zipCode: string;

  @Column('decimal', { nullable: true })
  lat: number;

  @Column('decimal', { nullable: true })
  lon: number;
}
