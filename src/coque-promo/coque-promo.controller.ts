import {
  Controller,
  Post,
  Header,
  Get,
  UseGuards,
  Put,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/guards/admin.guard';
import { CoquePromoService } from './coque-promo.service';
import { CreateCoqueDto } from './dto/create-coque.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { s3MulterOptions } from 'src/config/multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const multerOptionsS3: MulterOptions = s3MulterOptions(null, `coque-promo`);
@ApiBearerAuth()
@ApiTags('Coque-promo')
@Controller('coque-promo')
export class CoquePromoController {
  constructor(private coquePromoService: CoquePromoService) {}
  @ApiOperation({ summary: 'COQUE PROMO LIST' })
  @ApiResponse({ status: 200, description: 'list all coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('/')
  @UseGuards(AuthGuard())
  async getCoquePromo() {
    return await this.coquePromoService.listAll();
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiConsumes('multipart/form-data')
  @Post('/')
  @UseInterceptors(FilesInterceptor('coque', 100, multerOptionsS3))
  @UseGuards(AuthGuard(), AdminGuard)
  async createCoquePromo(
    @UploadedFiles() files,
    @Query() coque: CreateCoqueDto,
  ) {
    console.log(coque.clusters);
    console.log(coque.periods);
    return await this.coquePromoService.addCoque(coque, files);
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put('/:coqueId')
  @UseGuards(AuthGuard(), AdminGuard)
  async updateCoque() {
    return await this.coquePromoService.updateCoque();
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete('/:coqueId')
  @UseGuards(AuthGuard(), AdminGuard)
  async deleteCoque() {
    return 'deleteCoque';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('/:coqueId/files')
  @UseGuards(AuthGuard())
  async listCoqueFiles() {
    return 'listCoqueFiles';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('/:coqueId/files')
  @UseGuards(AuthGuard())
  async addCoqueFile() {
    return 'addCoqueFile';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put('/:coqueId/files/fileId')
  @UseGuards(AuthGuard())
  async updateCoqueFile() {
    return 'updateCoqueFile';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete('/:coqueId/files/fileId')
  @UseGuards(AuthGuard())
  async deleteCoqueFile() {
    return 'deleteCoqueFile';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('/:coqueId/files/downloads')
  @UseGuards(AuthGuard())
  async downloadsCoqueFile() {
    return 'downloadsCoqueFile';
  }
}
