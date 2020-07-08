/* eslint-disable @typescript-eslint/camelcase */
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
  UsePipes,
  Param,
  UploadedFile,
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
import { JSONArrayValidation } from '../common/pipes/json-array.pipe';
import { ApiMultiFile } from 'src/common/decorators/api-multi-file.decorator';
import { ApiFile } from '../common/decorators/api-file.decorator';
import { ListMeaDto } from './dto/list-coque.dto';
import { UserReq } from '../auth/get-user.decorator';
import { User } from '../entities/User';
import { UpdateCoqueDto } from './dto/update.dto';
import { CoqueExistenceDto } from './dto/coqueId.dto';
import { GetFilesDto } from './dto/list-files.dto';
import { query } from 'winston';

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
  async getCoquePromo(@Query() filter: ListMeaDto, @UserReq() user: User) {
    if (user.userRoleId !== 1) {
      filter.coque_status = true;
      filter.file_status = true;

      filter.clusters = [];
      filter.clusters.push({ cluster_id: user.store.clusterId });
    }
    return await this.coquePromoService.listAll(filter);
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({
    status: 400,
    description: 'verify you upload files with names',
  })
  @ApiConsumes('multipart/form-data')
  @Post('/')
  @UsePipes(new JSONArrayValidation())
  @UseInterceptors(FilesInterceptor('coque', 10, multerOptionsS3))
  @ApiMultiFile('coque')
  @UseGuards(AuthGuard(), AdminGuard)
  async createCoquePromo(
    @UploadedFile() files,
    @Query() coque: CreateCoqueDto,
  ) {
    return await this.coquePromoService.addCoque(coque, files);
  }

  @ApiOperation({ summary: 'UPDATE COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put('/:coqueId')
  @ApiConsumes('multipart/form-data')
  @UsePipes(new JSONArrayValidation())
  @UseInterceptors(FilesInterceptor('coque', 10, multerOptionsS3))
  @ApiMultiFile('coque')
  @UseGuards(AuthGuard(), AdminGuard)
  async updateCoque(
    @Query() coque: UpdateCoqueDto,
    @Param() coqueCred: CoqueExistenceDto,
    @UploadedFiles() files,
  ) {
    return await this.coquePromoService.updateCoque(
      coqueCred.coqueId,
      coque,
      files,
    );
  }

  @ApiOperation({ summary: 'delete COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete('/:coqueId')
  @UseGuards(AuthGuard(), AdminGuard)
  async deleteCoque(@Param() coqueCred: CoqueExistenceDto) {
    return await this.coquePromoService.delete(coqueCred.coqueId);
  }

  @ApiOperation({ summary: 'LIST COQUE PROMO Files' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('/:coqueId/files')
  @UseGuards(AuthGuard())
  async listCoqueFiles(
    @Param() coqueCred: CoqueExistenceDto,
    @Query() filter: GetFilesDto,
    @UserReq() user: User,
  ) {
    return await this.coquePromoService.listFiles(
      coqueCred.coqueId,
      filter,
      user,
    );
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('/:coqueId/files')
  @ApiConsumes('multipart/form-data')
  @UsePipes(new JSONArrayValidation())
  @UseInterceptors(FileInterceptor('coque', multerOptionsS3))
  @ApiFile('coque')
  @UseGuards(AuthGuard(), AdminGuard)
  async addCoqueFile(
    @Param() coqueCred: CoqueExistenceDto,
    @UploadedFile() file,
    @Query('fileName') fileName: string,
  ) {
    return this.coquePromoService.addFile(coqueCred.coqueId, {
      fileUrl: file.key,
      name: fileName,
    });
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put('/:coqueId/files/fileId')
  @UseGuards(AuthGuard())
  async updateCoqueFile(@Param() coqueCred: CoqueExistenceDto) {
    return 'updateCoqueFile';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete('/:coqueId/files/fileId')
  @UseGuards(AuthGuard())
  async deleteCoqueFile(@Param() coqueCred: CoqueExistenceDto) {
    return await this.coquePromoService.deleteFiles(coqueCred.fileId);
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
