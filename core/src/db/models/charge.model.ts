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
import { Room } from './room.model';

@Entity()
export class Charge {
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

  @Column('integer', { nullable: true })
  flatOwnerId: number;

  @Column('integer', { nullable: true })
  roomOwnerId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'flatOwnerId' })
  flatOwner: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'roomOwnerId' })
  roomOwner: Account;

  @ManyToOne(() => Flat, { onDelete: 'CASCADE' })
  flat: Flat;

  @OneToOne(() => Room, (room) => room.charge, { onDelete: 'CASCADE' })
  @JoinColumn()
  room: Room;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
