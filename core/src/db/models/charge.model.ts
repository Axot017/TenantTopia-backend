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
import { Room } from './room.model';

@Entity()
export class Charge {
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
  @ApiProperty({
    description:
      'Positive if flat owner need to give back money to room owner' +
      ' and negative if room owner need to give back money to flat owner',
  })
  amount: number;

  @Column('integer')
  flatOwnerId: number;

  @Column('integer')
  roomOwnerId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'flatOwnerId' })
  @ApiProperty({ type: () => Account })
  flatOwner: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'roomOwnerId' })
  @ApiProperty({ type: () => Account })
  roomOwner: Account;

  @ManyToOne(() => Flat, { onDelete: 'CASCADE' })
  flat: Flat;

  @OneToOne(() => Room, (room) => room.charge, { onDelete: 'CASCADE' })
  @JoinColumn()
  room: Room;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
