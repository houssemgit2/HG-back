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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { LeafletService } from './leaflet.service';
import { AddLeafletDto } from './dto/add-leaflet.dto';
import { GetLeafletDto } from './dto/get-leaflet.dto';
import { Leaflet } from './../entities/Leaflet';

@ApiBearerAuth()
@ApiTags('leaflet')
@Controller('leaflet')
export class LeafletController {
  constructor(private leafletService: LeafletService) {}

  @ApiOperation({ summary: 'Add leaflet' })
  @ApiResponse({ status: 200, description: 'leaflet added successfully' })
  @Post()
  //@UseGuards(AuthGuard(), AdminGuard)
  create(@Body() leaflet: AddLeafletDto) {
    return this.leafletService.create(leaflet);
  }

  @ApiOperation({ summary: 'get All leaflets' })
  @ApiResponse({ status: 200, description: 'leaflets list' })
  @Get()
  //@UseGuards(AuthGuard(), AdminGuard)
  async findAll(@Query() filter: GetLeafletDto) {
    const leafletList: Leaflet[] = await this.leafletService.getAll(filter);
    return leafletList;
  }

  @ApiOperation({ summary: 'leaflet info' })
  @ApiResponse({ status: 200, description: 'Get the leaflet info by id' })
  @Get(':id')
  // @UseGuards(AuthGuard(), AdminGuard)
  async findOne(@Param('id') id: number) {
    return await this.leafletService.get(id);
  }

  @ApiOperation({ summary: 'Update Leaflet' })
  @ApiResponse({ status: 200, description: 'update the leaflet info' })
  @Put(':id')
  // @UseGuards(AuthGuard())
  async update(@Param('id') id: number, @Body() leaflet: AddLeafletDto) {
    return await this.leafletService.update(id, leaflet);
  }

  @Delete(':id')
  //@UseGuards(AuthGuard(), AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.leafletService.remove(id);
  }
}
