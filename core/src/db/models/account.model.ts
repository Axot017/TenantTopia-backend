import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Flat } from './flat.model';
import { Room } from './room.model';
import { Note } from './note.model';
import { Chore } from './chore.model';

@Entity()
export class Account {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Index()
  @Column()
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;

  @ApiProperty()
  @Column({ nullable: true })
  phoneNo: string;

  @ApiProperty()
  @Column({ nullable: true })
  accountNo: string;

  @ApiProperty()
  @Column({ nullable: true })
  avatar: string;

  @OneToOne(() => Flat, (flat) => flat.owner)
  flat: Flat;

  @OneToOne(() => Room, (room) => room.owner)
  room: Room;

  @OneToMany(() => Note, (note) => note.author)
  notes: Note[];

  @OneToMany(() => Chore, (chore) => chore.account)
  chores: Chore[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
