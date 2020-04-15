export function extractDecimals(price) {
  return (price % 1).toFixed(4).slice(2, 4);
}
export function calcEcoPerUnit(price, contenance, unit, physicalLot) {
  if (!price || !contenance || !unit) {
    return null;
  }
  let totalContenance = contenance;
  if (physicalLot && physicalLot > 1) {
    totalContenance *= physicalLot;
  }
  let newUnit;
  switch (unit.toLowerCase()) {
    case 'ml':
      newUnit = 'L';
      break;
    case 'g':
      newUnit = 'Kg';
      break;
    default:
      return '';
  }
  return `${((price / totalContenance) * 1000).toFixed(2)}€/${newUnit}`;
}
export function transformDeterminant(originalPrn) {
  if (!originalPrn) return 1;
  switch (originalPrn.toLowerCase()) {
    case `l'`:
      return "D'UN(E)";
    case 'le':
      return "D'UN";
    case 'la':
      return "D'UNE";
    case 'les':
      return 'DES';
    default:
      return 1;
  }
}

export function contenancePerMes(contenance, unit, physicalLot, display?) {
  // used to hide countenance when the product in the lot offers when the unit equals "unité"
  if (
    typeof display !== 'undefined' &&
    display === false &&
    unit.toLowerCase() === 'unité'
  ) {
    return '';
  }
  if (
    contenance === 1 &&
    (unit.toLowerCase() === 'unité' || unit.toLowerCase() === 'boite') &&
    physicalLot
  ) {
    return `LOT DE ${physicalLot}`;
  }
  let actualContenance = contenance;
  let prefix = '';
  let suffix = unit.toUpperCase();
  if (physicalLot && physicalLot > 1) {
    /* actualContenance = (actualContenance / physicalLot).toFixed(0); */
    prefix = `${physicalLot} x`;
  }
  if (unit.toLowerCase() === 'ml' && actualContenance >= 1000) {
    actualContenance = contenance / 1000;
    if (Number.isInteger(actualContenance)) {
      actualContenance = actualContenance.toFixed(0);
    } else {
      actualContenance = actualContenance.toFixed(4).slice(0, -2);
    }
    suffix = 'L';
  }
  if (
    unit.toLowerCase() !== 'ml' &&
    unit.toLowerCase() !== 'g' &&
    actualContenance > 1
  ) {
    suffix += 'S';
  }
  return `${prefix} ${actualContenance} ${suffix}`;
}

export function wordWrap(str, cols) {
  let formatedString;
  const wordsArray = str.split(' ');
  // eslint-disable-next-line prefer-destructuring
  formatedString = wordsArray[0];
  const res = [];
  for (let i = 1; i < wordsArray.length; i++) {
    if (wordsArray[i].length > cols) {
      res.push(formatedString);
      formatedString = wordsArray[i];
    } else if (formatedString.length + wordsArray[i].length > cols) {
      res.push(formatedString);
      formatedString = wordsArray[i];
    } else {
      formatedString += ` ${wordsArray[i]}`;
    }
  }
  res.push(formatedString);
  return res;
}

// extracts the PDFPromo number from the PDFPromo format
export function extractPDFPromoFormatNum(PDFPromoFormat) {
  return PDFPromoFormat ? parseInt(PDFPromoFormat.slice(-1), 10) : -1;
}

// Sorts the PDFPromos based on their format
export function sortPDFPromos(PDFPromos) {
  return PDFPromos.sort(
    (PDFPromo1, PDFPromo2) =>
      extractPDFPromoFormatNum(PDFPromo1.format) -
      extractPDFPromoFormatNum(PDFPromo2.format),
  );
}

// Calculates next PDFPromo index
export function calculateNextPDFPromoIndex(
  currentPDFPromo,
  nextPDFPromo,
  currentIndex,
) {
  // console.log(currentPDFPromo, nextPDFPromo, currentIndex);
  if (!currentPDFPromo || !currentPDFPromo.format || !currentIndex) {
    // console.log("CalculateNextPDFPromoIndex: Error missing parameters ");
    return 1;
  }
  if (!nextPDFPromo || !nextPDFPromo.format) {
    return 1;
  }
  if (
    extractPDFPromoFormatNum(nextPDFPromo.format) <
    extractPDFPromoFormatNum(currentPDFPromo.format)
  ) {
    console.log(
      'generate.js: Fatal Error, PDFPromos array not properly sorted',
    );
    throw new Error(
      'generate.js: Fatal Error, PDFPromos array not properly sorted',
    );
  }

  return (
    currentIndex *
      2 **
        (extractPDFPromoFormatNum(nextPDFPromo.format) -
          extractPDFPromoFormatNum(currentPDFPromo.format)) +
    1
  );
}
