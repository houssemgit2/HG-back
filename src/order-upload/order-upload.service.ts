import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import * as mime from 'mime-types';

// const AWS_S3_BUCKET_NAME = process.env.BUCKET

const s3 = new AWS.S3();

@Injectable()
export class OrderUploadService {
  upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET || 'healthy-group-v2',
      acl: 'public-read',
      key: function(request, file, cb) {
        const ext = mime.extension(file.mimetype);
        cb(
          null,
          `${
            process.env.NODE_ENV
          }/leaflet-order/${Date.now().toString()}.${ext}`,
        );
      },
    }),
  });
}
