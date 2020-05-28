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
  Res,
  NotFoundException,
  Header,
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
import { OrderUploadService } from './../order-upload/order-upload.service';
import * as fs from 'fs';
import * as archiver from 'archiver';
import * as rimraf from 'rimraf';

@ApiBearerAuth()
@ApiTags('leaflet')
@Controller('leaflet')
export class LeafletController {
  constructor(
    private leafletService: LeafletService,
    private readonly orderUploadService: OrderUploadService,
  ) {}

  @ApiOperation({ summary: 'Add leaflet' })
  @ApiResponse({ status: 200, description: 'leaflet added successfully' })
  @Post()
  @UseGuards(AuthGuard(), AdminGuard)
  create(@Body() leaflet: AddLeafletDto) {
    return this.leafletService.create(leaflet);
  }

  @ApiOperation({ summary: 'get All leaflets' })
  @ApiResponse({ status: 200, description: 'leaflets list' })
  @Get()
  @UseGuards(AuthGuard(), AdminGuard)
  async findAll(@Query() filter: GetLeafletDto) {
    const leafletList: Leaflet[] = await this.leafletService.getAll(filter);
    return leafletList;
  }

  @ApiOperation({ summary: 'leaflet info' })
  @ApiResponse({ status: 200, description: 'Get the leaflet info by id' })
  @Get(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  async findOne(@Param('id') id: number) {
    return await this.leafletService.get(id);
  }

  @ApiOperation({ summary: 'Update Leaflet' })
  @ApiResponse({ status: 200, description: 'update the leaflet info' })
  @Put(':id')
  @UseGuards(AuthGuard())
  async update(@Param('id') id: number, @Body() leaflet: AddLeafletDto) {
    return await this.leafletService.update(id, leaflet);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), AdminGuard)
  async remove(@Param('id') id: number) {
    return await this.leafletService.remove(id);
  }

  @Post('/order/:leafletId')
  @UseGuards(AuthGuard(), AdminGuard)
  async uploadOrder(
    @Param('leafletId') leafletId: number,
    @Req() request,
    @Res() response,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _this = this;
      this.orderUploadService.upload(request, response, async function(error) {
        if (error) {
          console.log('error', error);
          return response
            .status(404)
            .json(`Failed to upload order file: ${error}`);
        }

        const leaflet = await _this.leafletService.get(leafletId);
        if (!leaflet) {
          throw new NotFoundException('leaflet not found');
        }
        const updateLeaflet = {
          // eslint-disable-next-line @typescript-eslint/camelcase
          cond_el: leaflet.condEl,
          price: leaflet.price,
          lab: leaflet.lab,
          period: leaflet.period.calendarPeriod.toString(),
          year: leaflet.period.year.toString(),
          libelle: leaflet.libelle,
          // eslint-disable-next-line @typescript-eslint/camelcase
          url_order: request.files[0].location,
          gamme: leaflet.gamme,
          // eslint-disable-next-line @typescript-eslint/camelcase
          qte_lot: leaflet.qteLot,
          unit: leaflet.unit,
          contenance: leaflet.contenance,
        };
        await _this.leafletService.update(leafletId, updateLeaflet);
        return response.status(201).json(request.files[0]);
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json(`Failed to upload order file: ${error}`);
    }
  }

  @Post('/download-orders')
  @UseGuards(AuthGuard(), AdminGuard)
  @Header('Content-Type', 'Application/zip')
  async downloadOrders(@Body() body: any, @Res() response) {
    const filesPath = await this.leafletService.downloadOrders(body.ordersIDs);
    const output = fs.createWriteStream(`${filesPath}.zip`);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    });
    archive.directory(`${filesPath}/`, false);
    archive.pipe(output);
    // or write everything to disk
    output.on('close', () => {
      response.download(`${filesPath}.zip`, 'orders.zip', err => {
        rimraf.sync(filesPath);
        rimraf.sync(`${filesPath}.zip`);
      });
    });

    output.on('error', error => {
      console.log(error);
      return error;
    });
    archive.finalize();
  }
}
