import { AddLeafletPeriodDto } from './dto/add-leaflet-period.dto';
import { GetLeafletPeriodDto } from './dto/get-leaflet-period.dto';
import { LefletPeriodService } from './leflet-period.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ReqWithUser } from '../auth/interface/user.interface';
import { UserReq } from '../auth/get-user.decorator';
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
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from 'src/entities/User';

@ApiBearerAuth()
@ApiTags('leaflet-period')
@Controller('leaflet-period')
export class LefletPeriodController {
  constructor(private lefletPeriodService: LefletPeriodService) {}

  @ApiOperation({ summary: 'Add leflet period' })
  @ApiResponse({ status: 200, description: 'leflet period added successfully' })
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  async create(@Body() addLeafletPeriodDto: AddLeafletPeriodDto): Promise<any> {
    return this.lefletPeriodService.create(addLeafletPeriodDto);
  }

  @ApiOperation({ summary: 'get All leaflet period' })
  @ApiResponse({ status: 200, description: 'leaflet period list' })
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@UserReq() user: User, @Query() filter: GetLeafletPeriodDto) {
    return await this.lefletPeriodService.getAll(filter, user);
  }

  @ApiOperation({ summary: 'Leaflet period info' })
  @ApiResponse({
    status: 200,
    description: 'Get the leaflet Period info by id',
  })
  @Get(':id')
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: number) {
    return await this.lefletPeriodService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async remove(@Param('id') id: number) {
    return await this.lefletPeriodService.delete(id);
  }
}
