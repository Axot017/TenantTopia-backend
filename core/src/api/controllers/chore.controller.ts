import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Account } from '../../db/models/account.model';
import { Chore } from '../../db/models/chore.model';
import { CreateChoreDto } from '../../dtos/createChore.dto';
import { UpdateChoreDto } from '../../dtos/updateChore.dto';
import { MarkAsDoneChoreDto } from '../../dtos/markAsDoneChore.dto';
import { ChoreService } from '../../services/chore.service';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { ParseIntPipe } from '@nestjs/common';

@ApiTags('chores')
@Controller('chores')
export class ChoreController {
  constructor(private readonly choreService: ChoreService) {}

  @Post('')
  @ApiResponse({ status: 201 })
  addChore(
    @Body() addChoreDto: CreateChoreDto,
    @CurrentUser() currentUser: Account
  ): Promise<Chore> {
    return this.choreService.createChore(addChoreDto, currentUser);
  }

  @Get('')
  @ApiResponse({ type: () => Chore, status: 200, isArray: true })
  getChores(@CurrentUser() currentUser: Account): Promise<Chore[]> {
    return this.choreService.getChores(currentUser);
  }

  @Get('/user')
  @ApiResponse({ type: () => Chore, status: 200, isArray: true })
  getUserChores(@CurrentUser() currentUser: Account): Promise<Chore[]> {
    return this.choreService.getUserChores(currentUser);
  }

  @Patch(':id')
  @ApiResponse({ type: () => Chore, status: 200 })
  updateChore(
    @CurrentUser() currentUser: Account,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChoreDto: UpdateChoreDto
  ): Promise<Chore> {
    return this.choreService.updateChore(updateChoreDto, id, currentUser);
  }

  @Patch(':id/done')
  @ApiResponse({ type: () => Chore, status: 200 })
  markChoreAsDone(
    @CurrentUser() currentUser: Account,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChoreDto: MarkAsDoneChoreDto
  ): Promise<Chore> {
    return this.choreService.markChoreAsDone(updateChoreDto, id, currentUser);
  }

  @Delete(':id')
  @ApiResponse({ status: 204 })
  deleteChore(
    @CurrentUser() currentUser: Account,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    return this.choreService.deleteChore(id, currentUser);
  }
}
