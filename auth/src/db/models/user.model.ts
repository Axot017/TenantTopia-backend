import {
  Column,
  CreateDateColumn,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ default: true }) //TODO: change to false when email confirmation will be ready
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
