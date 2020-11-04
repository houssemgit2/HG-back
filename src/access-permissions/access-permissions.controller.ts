import {
  Controller,
  Get,
  Post,
  UseGuards,
  Put,
  Query,
  Param,
  Body,
  UsePipes,
} from '@nestjs/common';
import { AccessPermissionsService } from './access-permissions.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { StorePermission } from '../entities/StorePermission';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { GetAccessPermissionDto } from './dto/list.dto';
import { CreateAccessPermissionDto } from './dto/create.dto';
import { UpdateAccessPermissionDto } from './dto/update.dto';
import { UserReq } from '../auth/get-user.decorator';
import { User } from '../entities/User';
import { RequiredGroupsValidationPipe } from '../common/pipes/requiredGroups.validation.pipe';

@ApiBearerAuth()
@ApiTags('Access-permissions')
@Controller('access-permissions')
export class AccessPermissionsController {
  constructor(
    private readonly accessPermissionsService: AccessPermissionsService,
  ) {}

  @ApiOperation({ summary: 'list  stores access permissions' })
  @ApiResponse({ status: 200, description: 'store access permissions list' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard(), AdminGuard)
  @UsePipes(
    new RequiredGroupsValidationPipe(
      ['perPage', 'page'],
      'withPagination',
      PaginationDto,
    ),
  )
  @Get()
  async list(@Query() filter: PaginationDto): Promise<StorePermission[]> {
    return await this.accessPermissionsService.listAll(filter);
  }

  @ApiOperation({ summary: 'Create a store access permissions' })
  @ApiResponse({
    status: 200,
    description: 'created store access permissions',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard(), AdminGuard)
  @Post()
  async create(
    @Body() storePermission: CreateAccessPermissionDto,
  ): Promise<any> {
    return await this.accessPermissionsService.create(storePermission);
  }

  @ApiOperation({ summary: 'get a store access permissions' })
  @ApiResponse({ status: 200, description: 'a store access permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard())
  @Get(':storeId')
  async get(
    @Param('storeId') storeId: number,
    @Query() filter: GetAccessPermissionDto,
  ): Promise<any[]> {
    return await this.accessPermissionsService.getByStore(
      filter.resource_id,
      storeId,
    );
    // .then(data=> data.map(item=>this.accessPermissionsService.accessPermissionV1Keys(item)))
  }

  @ApiOperation({ summary: 'update a store access permissions' })
  @ApiResponse({ status: 200, description: 'Updated store access permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard())
  @Put(':storeId')
  update(
    @Param('storeId') storeId: number,
    @Body() updateAccessPermissionDto: UpdateAccessPermissionDto,
    @UserReq() user: User,
  ): Promise<StorePermission> {
    if (!storeId) user.storeId;
    console.log(`
      ...                   
  .,ok000Oxc.     'oxo,  .' 
 ,kWMMMMMMMMXo;. ;KMWMX: lK,
,0MMMMMMMMMMMWNd'xMMMMMO;xWl
lWMMMMMMMMMMMMM0lOMMMMMKoOMo
cNMMMMMMMMMMMMMk:OMMMMM0lkWl
.dNMMMMMMMMMMKx; lWMMMWd.dN:
  ;kXWMMMMWKd'   .oXWXx. ;o.
    .;ccc:,.       .,.      
`);
    return this.accessPermissionsService.update(
      storeId,
      updateAccessPermissionDto,
    );
  }
}
