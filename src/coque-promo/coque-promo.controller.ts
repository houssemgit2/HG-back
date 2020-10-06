/* eslint-disable @typescript-eslint/camelcase */
import {
  Controller,
  Post,
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
  Req,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Logger, Res } from '@nestjs/common';

import { s3MulterOptions } from 'src/common/multer';
import { ApiMultiFile } from 'src/common/decorators/api-multi-file.decorator';
import { compressFiles } from 'src/common/utils/helpers';

import { UserReq } from '../auth/get-user.decorator';
import { User } from '../entities/User';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiFile } from '../common/decorators/api-file.decorator';
import { JSONArrayValidation } from '../common/pipes/json-array.pipe';
import { JsonValidationPipe } from '../common/pipes/json.pipe';
import { ValidationPipe } from '../common/pipes/validation.pipe';

import { CoquePromoService } from './coque-promo.service';

import { CoqueFileIdDto } from './dto/coqueFileId.dto';
import { CoqueIdDto } from './dto/coqueId.dto';
import { CreateCoqueDto } from './dto/create-coque.dto';
import { ListMeaDto } from './dto/list-coque.dto';
import { GetFilesDto } from './dto/list-files.dto';
import { UpdateCoqueFileDto } from './dto/update-file.dto';
import { UpdateCoqueDto } from './dto/update.dto';

const multerOptionsS3: MulterOptions = s3MulterOptions(null, `coque-promo`);
@ApiBearerAuth()
@ApiTags('Coque-promo')
@Controller('coque-promo')
export class CoquePromoController {
  constructor(private coquePromoService: CoquePromoService) {}
  logger = new Logger('coque coontroller');
  @ApiOperation({ summary: 'COQUE PROMO LIST' })
  @ApiResponse({ status: 200, description: 'list all coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('/')
  @UsePipes(new JSONArrayValidation())
  @UsePipes(new JsonValidationPipe())
  @UseGuards(AuthGuard())
  async getCoquePromo(@Query() filter: ListMeaDto, @UserReq() user: User) {
    // TODO fix this dto name
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
  @ApiConsumes('multipart/form-data')
  @Post('/')
  @UsePipes(new JSONArrayValidation())
  @UseInterceptors(FilesInterceptor('coque', 10, multerOptionsS3))
  @ApiMultiFile('coque')
  @UseGuards(AuthGuard(), AdminGuard)
  async createCoquePromo(
    @UploadedFiles() files,
    @Query() coque: CreateCoqueDto,
    @Req() req: any,
  ) {
    console.log(req);
    return await this.coquePromoService.addCoque(coque, req.files);
  }

  @ApiOperation({ summary: 'UPDATE COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Put('/:coqueId')
  @ApiConsumes('multipart/form-data')
  @UsePipes(new JsonValidationPipe())
  @UsePipes(new JSONArrayValidation())
  @UseInterceptors(FilesInterceptor('coque', 10, multerOptionsS3))
  @ApiMultiFile('coque')
  @UseGuards(AuthGuard(), AdminGuard)
  async updateCoque(
    @Query() coque: UpdateCoqueDto,
    @Param() coqueCred: CoqueIdDto,
    @UploadedFiles() files,
  ) {
    console.log('files test');
    console.log(files);
    return await this.coquePromoService.updateCoque(
      coqueCred.coqueId,
      coque,
      files,
    );
  }

  @ApiOperation({ summary: 'Get one COQUE' })
  @ApiResponse({ status: 200, description: 'coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('/:coqueId')
  @UseGuards(AuthGuard())
  async getCoqueById(@Param() coqueCred: CoqueIdDto, @UserReq() user: User) {
    return await this.coquePromoService.getCoque(coqueCred.coqueId, user);
  }
  @ApiOperation({ summary: 'delete COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete('/:coqueId')
  @UseGuards(AuthGuard(), AdminGuard)
  async deleteCoque(@Param() coqueCred: CoqueIdDto) {
    return await this.coquePromoService.delete(coqueCred.coqueId);
  }

  @ApiOperation({ summary: 'LIST COQUE PROMO Files' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('/:coqueId/files')
  @UseGuards(AuthGuard())
  async listCoqueFiles(
    @Param() coqueCred: CoqueIdDto,
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
    @Param() coqueCred: CoqueIdDto,
    @UploadedFile() file,
    @Query('fileName') fileName: string,
  ) {
    return this.coquePromoService.addFile(coqueCred.coqueId, {
      fileUrl: file.key,
      name: fileName,
    });
  }

  @ApiFile('coque')
  @ApiOperation({ summary: 'NEW COQUE PROMO File' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UsePipes(new ValidationPipe())
  @Put('/:coqueId/files/:fileId')
  @UseGuards(AuthGuard(), AdminGuard)
  async updateCoqueFile(
    @Param() coqueCred: CoqueFileIdDto,
    @Query() query: UpdateCoqueFileDto,
  ) {
    const updated = await this.coquePromoService.editCoqueFile(
      coqueCred,
      query,
    );
    return updated.raw.changedRows
      ? 'file updated successfully'
      : 'file status/name not affected';
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Delete('/:coqueId/files/:fileId')
  @UseGuards(AuthGuard())
  async deleteCoqueFile(@Param() coqueCred: CoqueFileIdDto) {
    return await this.coquePromoService.deleteFiles(coqueCred.fileId);
  }

  @ApiOperation({ summary: 'NEW COQUE PROMO' })
  @ApiResponse({ status: 200, description: 'the created coque promo' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Post('/:coqueId/files/downloads')
  @UseGuards(AuthGuard())
  async downloadsCoqueFile(
    @Body() filter: GetFilesDto,
    @Param() coqueCred: CoqueIdDto,
    @UserReq() user: User,
    @Res() response,
  ) {
    const path = await this.coquePromoService.downloadFiles(
      coqueCred.coqueId,
      filter,
      user,
    );
    compressFiles(response, path, 'coque');
  }
}
