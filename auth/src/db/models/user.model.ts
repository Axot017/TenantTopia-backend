import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  userId: number;

  @Index()
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ generated: 'uuid' })
  confirmationCode: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
