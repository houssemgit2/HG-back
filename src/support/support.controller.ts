import {
  Controller,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserReq } from '../auth/get-user.decorator';
import { User } from '../entities/User';
import { AuthGuard } from '@nestjs/passport';
import { SupportDto } from './dto/sensSupport.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../config/multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiMultiFile } from '../common/decorators/api-multi-file.decorator';
const multerOptionsSupport: MulterOptions = multerOptions(
  null,
  `${__dirname}/../uploads/support-file/`,
);

@ApiBearerAuth()
@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}
 
 @ApiConsumes('multipart/form-data')
  @Post('/')
  //   @UseInterceptors(FilesInterceptor('coque', 10, multerOptionsS3))
  @UseInterceptors(FilesInterceptor('support', 10, multerOptionsSupport))
  @ApiMultiFile('support')
  @UseGuards(AuthGuard())
  async sendSupport(
    @UploadedFiles() files,
    @Req() req: any,
    @UserReq() user: User,
    @Query() support: SupportDto,
  ) {
    await this.supportService.sendSupport(support, user.email);
    return user.email;
  }
}
