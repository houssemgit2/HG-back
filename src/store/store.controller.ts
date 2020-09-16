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
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { StoreService } from './store.service';
import { InjectEventEmitter } from 'nest-emitter';
import { MyEventEmitter } from './store.events';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { StoreOwnerDto } from './dto/store-owner.dto';
import { Store } from '../entities/Store';
import { EditStoreOwnerDto } from './dto/edit-store-owner.dto';
import { RequiredGroupsValidationPipe } from '../common/pipes/requiredGroups.validation.pipe';

@ApiBearerAuth()
@ApiTags('Store')
@Controller('stores')
export class StoreController {
  constructor(
    private storeService: StoreService,
    @InjectEventEmitter() private readonly emitter: MyEventEmitter,
  ) {}

  @ApiOperation({ summary: 'Add store' })
  @ApiResponse({ status: 200, description: 'store added successfully' })
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  async create(@Body() body: StoreOwnerDto): Promise<Store> {
    const { owner, store, permissions } = body;
    const addedStore = await this.storeService
      .createOne(store, owner, permissions)
      .then(newStore => {
        this.emitter.emit('storeCreated', newStore.clusterId, newStore.cip);
        return this.storeService.storeV1Key(newStore);
      });
    // console.log('-*-*-*-*-*-*-*-*-*>', addedStore);
    return addedStore;
  }

  @ApiOperation({ summary: 'get All store' })
  @ApiResponse({ status: 200, description: 'store list' })
  @Get()
  @UsePipes(
    new RequiredGroupsValidationPipe(
      ['perPage', 'page'],
      'withPagination',
      PaginationDto,
    ),
  )
  @UseGuards(AuthGuard(), AdminGuard)
  async findAll(@Query() filter: PaginationDto): Promise<any> {
    // return filter;
    const storeList = await this.storeService.getAllStore(filter);
    return storeList;
  }

  @ApiOperation({ summary: 'Store info' })
  @ApiResponse({ status: 200, description: 'Get the store info by id' })
  @Get(':cip')
  @UseGuards(AuthGuard())
  async findOne(@Param('cip') cip: number): Promise<any> {
    if (!cip) return cip;
    return await this.storeService.getStore(cip);
  }

  @ApiOperation({ summary: 'Update Store' })
  @ApiResponse({ status: 200, description: 'update the store info' })
  @Put(':cip')
  @UseGuards(AuthGuard())
  async update(
    @Param('cip') cip: number,
    @Body() body: EditStoreOwnerDto,
  ): Promise<Store> {
    const { store, owner, permissions } = body;
    return await this.storeService.updateStore(cip, store, owner, permissions);
  }

  @Delete(':cip')
  @UseGuards(AuthGuard())
  async remove(@Param('cip') cip: number) {
    return await this.storeService.removeStore(cip);
  }
}
