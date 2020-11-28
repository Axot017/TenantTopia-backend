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
  description: string;

  @Column('integer', { nullable: true })
  payerId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'payerId' })
  payer: Account;

  @ManyToOne(() => Flat, (flat) => flat.bills, { onDelete: 'CASCADE' })
  flat: Flat;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
