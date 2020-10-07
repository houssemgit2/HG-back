import { InternalServerErrorException } from '@nestjs/common';

import * as snakeCaseKeys from 'snakecase-keys';

import * as camelCaseKeys from 'camelcase-keys';

import { _ } from 'lodash';

import * as fs from 'fs';

import * as request from 'request-promise';

import * as archiver from 'archiver';

import * as rimraf from 'rimraf';
import * as moment from 'moment';

export const isNotEmptyArray = (array: any): boolean =>
  array && Array.isArray(array) && !!array.length;

export function arrayEquals(arr1: any[], arr2: any[]): boolean {
  return (
    Array.isArray(arr1) &&
    Array.isArray(arr2) &&
    arr1.length === arr2.length &&
    arr1.every(val => arr2.includes(val))
  );
}
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
    response.download(`${filesPath}.zip`, `${zipName}.zip`, () => {
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
export function filterObjectProperty(object: object, keys: string[]): object {
  Object.keys(object).forEach(el => {
    if (!keys.includes(el)) delete object[el];
  });

  return object;
}
export function refreshDate(date: string, days: number) {
  return moment(
    moment(date)
      .endOf('month')
      .format('YYYY-MM-DD'),
    'YYYY-MM-DD',
  )
    .add(days, 'days')
    .format('YYYY-MM-DD');
}
