import {
  Req,
  Res,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import * as multer from 'multer';

import * as AWS from 'aws-sdk';

import { getConnection } from 'typeorm';

import moment = require('moment');

import * as url from 'url';

import { meaS3MulterOptions } from 'src/config/multer';
import { PROMO_STATE } from 'src/config/enum-types';

import { StorePromoMea } from '../entities/StorePromoMea';

@Injectable()
export class MeaUploadService {
  // async fileUpload(@Req() req, @Res() res, promoId: number, storeId: number) {
  //   try {
  //     let location: string;
  //     const result = await this.upload(req, res, async function(error) {
  //       if (error) {
  //         console.log(error);
  //         return res.status(404).json(`Failed to upload image file: ${error}`);
  //       }
  //       location = req.files[0].location;
  //       const parsed = url.parse(location, true);
  //       location = parsed.path;
  //       await getConnection()
  //         .createQueryBuilder()
  //         .update(StorePromoMea)
  //         .set({
  //           urlPicture: location,
  //           stateId: 2,
  //           uploadedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
  //         })
  //         .where('promo_id = :promoId AND store_id =:storeId', {
  //           promoId,
  //           storeId,
  //         })
  //         .execute();
  //     });
  //     return result;
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json(`Failed to upload image file: ${error}`);
  //   }
  // }
  async afterUpload(
    id: number,
    storeId: number,
    urlPicture: string,
    urlSellsListing: string,
  ) {
    try {
      const uploadedAt = moment().format();
      return await getConnection()
        .createQueryBuilder()
        .update(StorePromoMea)
        .set({
          urlPicture,
          urlSellsListing,
          stateId: 2,
          uploadedAt,
        })
        .where('promo_id = :promoId AND store_id =:storeId', {
          promoId: id,
          storeId,
        })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException(
        `Can't update promo state after upload, ${e}`,
      );
    }
  }
  imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  };
  sheetFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(xlsx|xlsm|xlsb|xls|xla|xlml|ods|csv)$/)) {
      return callback(new Error('Only sheets files are allowed!'), false);
    }
    callback(null, true);
  };

  upload = multer(meaS3MulterOptions).array('justif', 1); // TODO to remove if uplaod by decorator works well
}
