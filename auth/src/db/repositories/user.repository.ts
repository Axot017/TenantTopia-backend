import { EntityRepository, Repository } from 'typeorm';
import { User } from '../models/user.model';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findOneByEmail(email: string): Promise<User> {
    return this.findOne({ where: { email } });
  }

  findOneById(userId: number): Promise<User> {
    return this.findOne({ where: { userId } });
  }

  findOneByConfirmationCode(confirmationCode: string): Promise<User> {
    return this.findOne({ where: { confirmationCode } });
  }
}
