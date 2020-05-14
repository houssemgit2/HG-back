import {
  Controller,
  Get,
  UseGuards,
  Param,
  Delete,
  Put,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from './dto/pagination.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { StoreService } from './store.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { StoreOwnerDto } from './dto/store-owner.dto';
import { Store } from 'src/entities/Store';
import { EditStoreOwnerDto } from './dto/edit-store-owner.dto';

@ApiBearerAuth()
@ApiTags('Store')
@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @ApiOperation({ summary: 'Add store' })
  @ApiResponse({ status: 200, description: 'store added successfully' })
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  create(@Body() body: StoreOwnerDto): Promise<Store> {
    const { owner, store, permissions } = body;
    return this.storeService.createOne(store, owner, permissions);
  }

  @ApiOperation({ summary: 'get All store' })
  @ApiResponse({ status: 200, description: 'store list' })
  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
  async findAll(@Query() filter: PaginationDto): Promise<Store[]> {
    // return filter;
    const storeList: Store[] = await this.storeService.getAllStore(filter);
    //console.log(storeList);
    return storeList;
  }

  @ApiOperation({ summary: 'Store info' })
  @ApiResponse({ status: 200, description: 'Get the store info by id' })
  @Get(':id')
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: number): Promise<Store> {
    return await this.storeService.getStore(id);
  }

  @ApiOperation({ summary: 'Update Store' })
  @ApiResponse({ status: 200, description: 'update the store info' })
  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: number,
    @Body() body: EditStoreOwnerDto,
  ): Promise<Store> {
    const { store, owner, permissions } = body;
    return await this.storeService.updateStore(id, store, owner, permissions);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: number) {
    return await this.storeService.removeStore(id);
  }
}
