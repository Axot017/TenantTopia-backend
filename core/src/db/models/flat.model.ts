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
  id: number;

  @Column({ nullable: true })
  descritpion: string;

  @Column(() => Address)
  address: Address;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @OneToOne(() => Account, (account) => account.flat)
  @JoinColumn()
  owner: Account;

  @OneToMany(() => Room, (room) => room.flat, { onDelete: 'CASCADE' })
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
