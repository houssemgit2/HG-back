import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import moment = require('moment');

// Multer upload options
const s3 = new AWS.S3();

export const multerOptions = (
  allowedType, // = /\/(jpg|jpeg|png|gif)$/,
  uploadPath,
) => ({
  fileFilter: (req: any, file: any, cb: any) => {
    if (!allowedType || file.originalname.match(allowedType)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          `Unsupported file type ${extname(file.originalname)}`,
        ),
        false,
      );
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: (req: any, file: any, cb: any) => {
      // const uploadPath =
      //   process.env.UPLOADS_FOLDER || `${__dirname}/../uploads/`;
      // Create folder if doesn't exist
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      cb(null, uploadPath);
    },
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});
export const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.xlsx`);
  },
});
export const s3MulterOptions = (
  allowedType, // = /\/(jpg|jpeg|png|gif)$/,
  key,
) => ({
  // fileFilter: (req: any, file: any, cb: any) => {
  //   if (file.originalname.match(allowedType)) {
  //     cb(null, true);
  //   } else {
  //     cb(
  //       new BadRequestException(
  //         `Unsupported file type ${extname(file.originalname)}`,
  //       ),
  //       false,
  //     );
  //   }
  // },
  // Storage properties
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET || 'healthy-group-v2',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const ext = mime.extension(file.mimetype);
      cb(
        null,
        `${process.env.NODE_ENV}/${key}/${Date.now().toString()}.${ext}`,
      );
    },
  }),
});
export const meaS3MulterOptions: MulterOptions = {
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET || 'healthy-group-v2',
    acl: 'public-read',
    key: function(request, file, cb) {
      console.log('-------------------from meaS3MulterOptions');
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
        false,
      );
    }
    cb(null, true);
  },
};
