import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.model';
import { Flat } from './flat.model';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: false})
  isAvailable: boolean;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('text', { array: true })
  images: string[];

  @ManyToOne(() => Flat, (flat) => flat.rooms)
  flat: Flat;

  @OneToOne(() => Account, (account) => account.room)
  @JoinColumn()
  owner: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
