/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Account } from '../../db/models/account.model';
import { CreateNoteDto } from '../../dtos/createNote.dto';
import { UpdateNoteDto } from '../../dtos/updateNote.dto';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Note } from '../../db/models/note.model';
import { NoteService } from '../../services/note.service';

@ApiTags('notes')
@Controller('flat/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  @ApiResponse({ type: () => Note, isArray: true, status: 200 })
  getNotes(@CurrentUser() currentUser: Account): Promise<Array<Note>> {
    return this.noteService.getNotes(currentUser);
  }

  @Post()
  @ApiResponse({ type: () => Note, status: 201 })
  createNote(
    @CurrentUser() currentUser: Account,
    @Body() createNoteDto: CreateNoteDto
  ): Promise<Note> {
    return this.noteService.createNote(currentUser, createNoteDto);
  }

  @Patch(':id')
  @ApiResponse({ type: () => Note, status: 200 })
  updateNote(
    @CurrentUser() currentUser: Account,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto
  ): Promise<Note> {
    return this.noteService.updateNote(updateNoteDto, id, currentUser);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  deleteNote(
    @CurrentUser() currentUser: Account,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.noteService.deleteNote(id, currentUser);
  }
}
