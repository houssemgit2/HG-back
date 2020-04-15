export class FormatModel {
  width = 0;
  height = 0;
  x = 0.5;
  y = 0.5;
  constructor(width, height, x = 0.5, y = 0.5) {
    this.width = width || 0;
    this.height = height || 0;
    this.x = x;
    this.y = y;
  }
}
// eslint-disable-next-line no-unused-vars
export function A4(index) {
  return new FormatModel(595.28, 841.89);
}
export function A5(index) {
  const width = 595.28;
  const height = 420.94;
  const templateFormat = new FormatModel(width, height);
  switch (index) {
    case 1:
      break;
    case 2:
      templateFormat.y = height;
      break;
    default:
      console.log('error');
  }
  return templateFormat;
}
export function A6(index) {
  const width = 297.64;
  const height = 420.94;
  const templateFormat = new FormatModel(width, height);
  if (index < 1 || index > 4) {
    throw new Error(`format.js index ${index} is not valid for the format A6`);
  }
  if (index === 3 || index === 4) {
    templateFormat.y = height;
  }
  if (index === 2 || index === 4) {
    templateFormat.x = width;
  }
  return templateFormat;
}
export function A7(index) {
  const width = 297.64;
  const height = 210.47;
  const templateFormat = new FormatModel(width, height);
  if (index < 1 || index > 8) {
    throw new Error(`format.js index ${index} is not valid for the format A7`);
  }
  if (index === 3 || index === 4 || index === 7 || index === 8) {
    templateFormat.x = width;
  }
  switch (index) {
    case 1:
    case 3:
      break;
    case 2:
    case 4:
      templateFormat.y = height;
      break;
    case 5:
    case 7:
      templateFormat.y = 2 * height;
      break;
    case 6:
    case 8:
      templateFormat.y = 3 * height;
      break;
    default:
      throw new Error(
        `format.js index ${index} is not valid for the format A7`,
      );
  }
  return templateFormat;
}
export function A8(index) {
  const width = 148.82;
  const height = 210.47;
  const templateFormat = new FormatModel(width, height);
  if (index < 1 || index > 16) {
    throw new Error(`format.js index ${index} is not valid for the format A8`);
  }
  switch (index) {
    case 1:
    case 3:
    case 9:
    case 11:
      break;
    case 2:
    case 4:
    case 10:
    case 12:
      templateFormat.x = width;
      break;
    case 5:
    case 7:
    case 13:
    case 15:
      templateFormat.x = 2 * width;
      break;
    case 6:
    case 8:
    case 14:
    case 16:
      templateFormat.x = 3 * width;
      break;
    default:
      throw new Error(
        `format.js index ${index} is not valid for the format A8`,
      );
  }
  switch (index) {
    case 1:
    case 2:
    case 5:
    case 6:
      break;
    case 3:
    case 4:
    case 7:
    case 8:
      templateFormat.y = height;
      break;
    case 9:
    case 10:
    case 13:
    case 14:
      templateFormat.y = 2 * height;
      break;
    case 11:
    case 12:
    case 15:
    case 16:
      templateFormat.y = 3 * height;
      break;
    default:
      throw new Error(
        'format.js index ${index} is not valid for the format A8',
      );
  }
  return templateFormat;
}
