import {
  Req,
  Res,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as mime from 'mime-types';
import { StorePromoMea } from '../entities/StorePromoMea';
import { getConnection } from 'typeorm';
import moment = require('moment');
import * as url from 'url';

const AWS_S3_BUCKET_NAME = process.env.BUCKET || 'healthy-group-v2';

const s3 = new AWS.S3();

@Injectable()
export class MeaUploadService {
  async fileUpload(@Req() req, @Res() res, promoId: number, storeId: number) {
    try {
      let location: string;
      const result = await this.upload(req, res, async function(error) {
        if (error) {
          console.log(error);
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        location = req.files[0].location;
        const parsed = url.parse(location, true);
        location = parsed.path;
        await getConnection()
          .createQueryBuilder()
          .update(StorePromoMea)
          .set({
            urlPicture: location,
            state: 'PENDING',
            uploadedAt: moment().format('YYYY-MM-DD hh:mm:ss'),
          })
          .where('promo_id = :promoId AND store_id =:storeId', {
            promoId,
            storeId,
          })
          .execute();
      });
      return result;
    } catch (error) {
      console.log(error);
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }
  async afterUpload(
    id: number,
    storeId: number,
    urlPicture: string,
    urlSellsListing: string,
  ) {
    try {
      return await getConnection()
        .createQueryBuilder()
        .update(StorePromoMea)
        .set({
          urlPicture,
          urlSellsListing,
          state: 'PENDING',
          uploadedAt: Date.now(),
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
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET || 'healthy-group-v2',
      acl: 'public-read',
      key: function(request, file, cb) {
        const ext = mime.extension(file.mimetype);
        cb(
          null,
          `${process.env.NODE_ENV}/mea/${moment().year()}/${moment().month() +
            1}/${request.user.storeId}/${
            request.params.id
          }_${Date.now().toString()}.${ext}`,
        );
      },
    }),
    fileFilter: (req, file, cb) => {
      let fileTypesRegEx: any;
      if (req.path.includes('xl'))
        fileTypesRegEx = /xls|xlsx|xlsm|xml|xlt|xltx|csv/;
      else fileTypesRegEx = /jpeg|jpg|png/;
      if (!fileTypesRegEx.test(file.mimetype)) {
        return cb(
          new Error(
            `Only ${fileTypesRegEx} are allowed, and you uploaded a ${file.mimetype} file.`,
          ),
        );
      }
      cb(null, true);
    },
  }).array('justif', 1);
}
