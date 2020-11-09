import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ default: false })
  isAvailable: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  description: string;

  @ApiProperty()
  @Column('decimal', { nullable: true })
  cost: number;

  @ApiProperty()
  @Column('text', { array: true, nullable: true, default: '{}' })
  images: string[];

  @ManyToOne(() => Flat, (flat) => flat.rooms, { onDelete: 'CASCADE' })
  flat: Flat;

  @OneToOne(() => Account, (account) => account.room)
  @JoinColumn()
  owner: Account;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
