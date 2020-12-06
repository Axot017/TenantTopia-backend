import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from './account.model';
import { Flat } from './flat.model';

@Entity()
export class Chore {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  title: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;

  @Column({ nullable: true })
  @ApiProperty()
  icon: string;

  @Column()
  @ApiProperty()
  repeats: boolean;

  @Column({ default: false })
  @ApiProperty()
  done: boolean;

  @ManyToOne(() => Account)
  @ApiProperty({ type: () => Account })
  account: Account;

  @ManyToOne(() => Flat, (flat) => flat.chores, { onDelete: 'CASCADE' })
  flat: Flat;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
