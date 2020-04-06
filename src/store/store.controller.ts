import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Delete,
  Put,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetStoreDto } from './dto/get-store.dto';
import { AddStoreDto } from './dto/add-store.dto';

@Controller('store')
export class StoreController {
  @Post()
  create(@Body() store: AddStoreDto) {
    return 'This action add new store';
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@Req() req: any) {
    return `This action returns all store ${req.user.id} ${req.user.userRoleId}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: AddStoreDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
