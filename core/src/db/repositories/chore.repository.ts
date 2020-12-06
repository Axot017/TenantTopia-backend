import { EntityRepository, Repository } from 'typeorm';
import { Chore } from '../models/chore.model';

@EntityRepository(Chore)
export class ChoreRepository extends Repository<Chore> {}
