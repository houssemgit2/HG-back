import * as snakeCaseKeys from 'snakecase-keys';
import { _ } from 'lodash';

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
