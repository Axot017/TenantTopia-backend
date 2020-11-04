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
import { Room } from './room.model';

@Entity()
export class Flat {
  @PrimaryGeneratedColumn()
  int: number;

  @Column({ nullable: true })
  descritpion: string;

  @Column(() => Address)
  address: Address;

  @Column('text', { array: true })
  images: string[];

  @OneToOne(() => Account, (account) => account.flat)
  @JoinColumn()
  owner: Account;

  @OneToMany(() => Room, (room) => room.flat)
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
