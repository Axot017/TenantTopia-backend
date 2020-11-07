import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { Account } from '../../db/models/account.model';
import { Flat } from '../../db/models/flat.model';
import { ModifyFlatDto } from '../../dtos/modifyFlat.dto';
import { FlatService } from '../../services/flat.service';
import { CurrentUser } from '../decorators/currentUser.decorator';

@Controller('flat')
export class FlatController {
  constructor(private readonly flatService: FlatService) {}

  @Post()
  createFlat(
    modifyFlatDto: ModifyFlatDto,
    @CurrentUser()
    currentUser: Account
  ): Promise<Flat> {
    return this.flatService.createFlat(currentUser, modifyFlatDto);
  }

  @Patch()
  updateFlat(
    modifyFlatDto: ModifyFlatDto,
    @CurrentUser()
    currentUser: Account
  ): Promise<Flat> {
    return this.flatService.updateFlat(currentUser, modifyFlatDto);
  }

  @Post('finalize')
  finalizeFlatCreation(@CurrentUser() currentUser: Account): Promise<void> {
    return this.flatService.finalizeFlatCreation(currentUser);
  }

  @Get()
  getFlat(
    @Query('includeUnconfirmed') includeUnconfirmed: boolean,
    @CurrentUser() currentUser: Account
  ): Promise<Flat> {
    return this.flatService.getFlat(includeUnconfirmed, currentUser);
  }

  @Delete()
  deleteFlat(@CurrentUser() currentUser: Account): Promise<void> {
    return this.flatService.deleteFlat(currentUser);
  }
}
