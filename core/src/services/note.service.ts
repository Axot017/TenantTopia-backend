import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Account } from '../db/models/account.model';
import { FlatRepository } from '../db/repositories/flat.repository';
import { NoteRepository } from '../db/repositories/note.repository';
import { CreateNoteDto } from '../dtos/createNote.dto';
import { UpdateNoteDto } from '../dtos/updateNote.dto';
import { Note } from '../db/models/note.model';
import { Flat } from '../db/models/flat.model';

@Injectable()
export class NoteService {
  constructor(
    private readonly flatRepository: FlatRepository,
    private readonly noteRepository: NoteRepository
  ) {}

  async getNotes(currentUser: Account): Promise<Array<Note>> {
    const usersFlat = await this.getFlat(currentUser);

    return this.noteRepository.getRecentNotes(usersFlat.id);
  }

  async createNote(
    currentUser: Account,
    noteDto: CreateNoteDto
  ): Promise<Note> {
    const usersFlat = await this.getFlat(currentUser);

    const note = { ...noteDto, flat: usersFlat, author: currentUser };

    const result = await this.noteRepository.save(note);

    delete result['flat'];

    return result;
  }

  async updateNote(
    noteDto: UpdateNoteDto,
    noteId: number,
    currentUser: Account
  ): Promise<Note> {
    const note = await this.getNote(noteId);

    this.validateOwner(note, currentUser);

    // 'updatedAt' is set explicitly to allow note bumps by empty PATCH
    note.updatedAt = new Date();

    return this.noteRepository.save({ ...note, ...noteDto });
  }

  async deleteNote(noteId: number, currentUser: Account): Promise<void> {
    const note = await this.getNote(noteId);

    this.validateOwner(note, currentUser);

    await this.noteRepository.remove(note);
  }

  private async getNote(noteId: number): Promise<Note> {
    const note = await this.noteRepository.findOne(noteId, {
      relations: ['author'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  private async getFlat(currentUser: Account): Promise<Flat> {
    const usersFlat = await this.flatRepository.getUsersFlatByUserId(
      currentUser.id
    );

    if (!usersFlat) {
      throw new NotFoundException('Users flat not found');
    }

    return usersFlat;
  }

  private validateOwner(note: Note, currentUser: Account): void {
    if (note.author.id != currentUser.id) {
      throw new ForbiddenException('Not an owner');
    }
  }
}
