import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.model';
import { Address } from './address.model';
import { Bill } from './bill.model';
import { Charge } from './charge.model';
import { Room } from './room.model';
import { Note } from './note.model';

@Entity()
export class Flat {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column(() => Address)
  address: Address;

  @ApiProperty()
  @Column({ default: false })
  isConfirmed: boolean;

  @ApiProperty()
  @Column('text', { array: true, nullable: true, default: '{}' })
  images: string[];

  @OneToOne(() => Account, (account) => account.flat)
  @JoinColumn()
  owner: Account;

  @ApiProperty()
  @OneToMany(() => Room, (room) => room.flat)
  rooms: Room[];

  @ApiProperty()
  @OneToMany(() => Note, (note) => note.flat)
  notes: Note[];

  @OneToMany(() => Charge, (charge) => charge.flat)
  charges: Charge[];

  @OneToMany(() => Bill, (bill) => bill.flat)
  bills: Bill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
