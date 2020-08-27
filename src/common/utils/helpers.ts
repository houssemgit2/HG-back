import * as snakeCaseKeys from 'snakecase-keys';
import * as camelCaseKeys from 'camelcase-keys';
import { _ } from 'lodash';
import * as fs from 'fs';
import * as request from 'request-promise';
import { InternalServerErrorException } from '@nestjs/common';
import * as archiver from 'archiver';
import * as rimraf from 'rimraf';

export function convertToSnakeCase(result) {
  const { isObject, isArray } = _;
  if (isArray(result)) {
    return result.map(innerObj => snakeCaseKeys(innerObj));
  } else if (isObject(result)) {
    return snakeCaseKeys(result);
  } else {
    return result;
  }
}
export function convertToCamelCase(result) {
  const { isObject, isArray } = _;
  if (isArray(result)) {
    return result.map(innerObj => camelCaseKeys(innerObj));
  } else if (isObject(result)) {
    return camelCaseKeys(result);
  } else {
    return result;
  }
}

export async function createPromiseFile(
  filesPath: string,
  fileType: string,
  filesList: any,
  nameKey: string,
  urlKey: string,
) {
  try {
    await fs.mkdirSync(filesPath);
    const promises = filesList.map((item, index) => {
      return new Promise((resolve, reject) => {
        const filepath = `${filesPath}/${index}-${item[nameKey].replace(
          '/',
          ' ',
        )}.${fileType || item[urlKey].split('.').pop()}`;
        const file = fs.createWriteStream(filepath);
        request
          .get(`${item[urlKey]}`)
          .pipe(file)
          .on('finish', () => {
            resolve(filepath);
          })
          .on('error', error => {
            reject(error);
          });
      });
    });
    return promises;
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
}

export async function compressFiles(response, filesPath, zipName) {
  const output = fs.createWriteStream(`${filesPath}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });
  archive.directory(`${filesPath}/`, false);
  archive.pipe(output);
  // or write everything to disk
  output.on('close', () => {
    response.download(`${filesPath}.zip`, `${zipName}.zip`, err => {
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
