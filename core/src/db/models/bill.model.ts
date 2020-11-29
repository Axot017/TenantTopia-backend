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
export class Bill {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column('decimal', {
    default: 0.0,
    transformer: {
      to(value) {
        return value;
      },
      from(value) {
        return parseFloat(value);
      },
    },
  })
  amount: number;

  @Column()
  @ApiProperty()
  description: string;

  @Column('integer')
  payerId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'payerId' })
  @ApiProperty({ type: () => Account })
  payer: Account;

  @ManyToOne(() => Flat, (flat) => flat.bills, { onDelete: 'CASCADE' })
  flat: Flat;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
