import {
  Controller,
  Get,
  Post,
  UseGuards,
  Put,
  Query,
  Param,
  Body,
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
import { PaginationDto } from 'src/store/dto/pagination.dto';
import { GetAccessPermissionDto } from './dto/list.dto';
import { CreateAccessPermissionDto } from './dto/create.dto';
import { UpdateAccessPermissionDto } from './dto/update.dto';
// import { ReqWithUser } from 'src/auth/interface/user.interface';

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
  ): Promise<StorePermission[]> {
    return await this.accessPermissionsService.getByStore(
      filter.resource_id,
      storeId,
    );
  }

  // todo is why we didn't use the storeId from the Req.user
  @ApiOperation({ summary: 'update a store access permissions' })
  @ApiResponse({ status: 200, description: 'updated store access permissions' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(AuthGuard())
  @Put(':storeId')
  update(
    @Param('storeId') storeId: number,
    @Body() updateAccessPermissionDto: UpdateAccessPermissionDto,
    // @Req() request: ReqWithUser,
  ): Promise<StorePermission> {
    // console.log(request);
    return this.accessPermissionsService.update(
      storeId,
      updateAccessPermissionDto,
    );
  }
}
