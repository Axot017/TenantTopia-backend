import { EntityRepository, Repository } from 'typeorm';
import { Note } from '../models/note.model';

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {
  getRecentNotes(flatId: number): Promise<Array<Note>> {
    const monthBack = new Date();
    monthBack.setMonth(monthBack.getMonth() - 1);

    return this.createQueryBuilder('note')
      .innerJoin('note.flat', 'flat')
      .leftJoinAndSelect('note.author', 'author')
      .where('flat.id = :flatId', { flatId: flatId })
      .andWhere('note.updatedAt > :monthBack', {
        monthBack: monthBack.toLocaleDateString(),
      })
      .getMany();
  }
}
