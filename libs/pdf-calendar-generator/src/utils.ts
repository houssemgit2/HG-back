const displayedColumns = [
  'ID',
  'laboratoire',
  'lab',
  'gamme',
  'ean',
  'cond_el',
  'det_mec',
  'achat_vente',
  'detail_compe',
  'circ_rev',
  'per_cont_comp',
];
const headers = [
  { text: 'ID', style: 'tableHeader', alignment: 'center' },
  { text: 'LABORATOIRE', style: 'tableHeader', alignment: 'center' },
  { text: 'MARQUE', style: 'tableHeader', alignment: 'center' },
  { text: 'GAMME/PRODUIT', style: 'tableHeader', alignment: 'center' },
  { text: 'EAN', style: 'tableHeader', alignment: 'center' },
  {
    text: "CONDITIONS D'ELIGIBILITÉ",
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'DÉTAIL DU MÉCANIQUE',
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: "À L'ACHAT/LISTING DE VENTES",
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'DÉTAILS COMPENSATION',
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'CIRCUIT DE REVERSEMENT',
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'PERSONNE À CONTACTER',
    style: 'tableHeader',
    alignment: 'center',
  },
];

const displayedColumnsMEA = [
  'ID',
  'laboratoire',
  'lab',
  'gamme',
  'lot_phys',
  'contenance',
  'ean',
  'zone_mis',
  'det_mis',
  'det_ren',
  'circuit_vers',
  'justif',
  'per_cont_mise',
  'macro_type',
  'micro_type',
  'price',
  'cond_el',
  'achat_vente',
  'det_mec',
  'detail_compe',
  'circ_rev',
  'per_cont_comp',
];
const headersMEA = [
  { text: 'ID', style: 'tableHeader', alignment: 'center' },
  { text: 'LABORATOIRE', style: 'tableHeader', alignment: 'center' },
  { text: 'MARQUE', style: 'tableHeader', alignment: 'center' },
  { text: 'GAMME/PRODUIT', style: 'tableHeader', alignment: 'center' },
  { text: 'LOT', style: 'tableHeader', alignment: 'center' },
  { text: 'CONTENANCE', style: 'tableHeader', alignment: 'center' },
  { text: 'EAN', style: 'tableHeader', alignment: 'center' },
  { text: 'ZONE DE MISE EN AVANT', style: 'tableHeader', alignment: 'center' },
  { text: 'DETAIL MISE EN AVANT', style: 'tableHeader', alignment: 'center' },
  { text: 'DETAIL DE RÉMUNÉRATION', style: 'tableHeader', alignment: 'center' },
  { text: 'CIRCUIT DE VERSEMENT', style: 'tableHeader', alignment: 'center' },
  { text: 'JUSTIFICATIF', style: 'tableHeader', alignment: 'center' },
  {
    text: 'PERSONNE À CONTACTER(MISE AV)',
    style: 'tableHeader',
    alignment: 'center',
  },
  { text: 'MACRO TYPE', style: 'tableHeader', alignment: 'center' },
  { text: 'MICRO TYPE', style: 'tableHeader', alignment: 'center' },
  { text: 'PRIX', style: 'tableHeader', alignment: 'center' },
  {
    text: "CONDITIONS D'ELIGIBILITÉ",
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: "À L'ACHAT/LISTING DE VENTES",
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'DÉTAIL DU MÉCANIQUE',
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'DÉTAILS COMPENSATION',
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'CIRCUIT DE REVERSEMENT',
    style: 'tableHeader',
    alignment: 'center',
  },
  {
    text: 'PERSONNE À CONTACTER',
    style: 'tableHeader',
    alignment: 'center',
  },
];
const PROMO_TYPES = {
  Remise_en_eur_sur_1_produit: val => `${val || ''}€ sur PRODUIT`,
  Remise_en_eur_sur_1_gamme: val => `${val || ''}€ sur GAMME`,
  Remise_en_pour_sur_1_produit: val => `${val || ''}%  PRODUIT`,
  Remise_en_pour_sur_1_gamme: val => `${val || ''}%  GAMME`,
  Remise_en_pour_sur_le_2eme_produit: val => `${val || ''}% SUR 2 ÈME PROD`,
  // eslint-disable-next-line no-unused-vars
  '2eme_produit_offert': val => `2 ÈME OFFERT`,
  Remise_en_pour_sur_le_2eme_produit_différent: val =>
    `${val || ''}% SUR 2ÈME DIFF`,
  '2eme_produit_différent_offert': val => `${val || ''}2ÈME DIFF OFF`,
  // eslint-disable-next-line no-unused-vars
  '3eme_produit_offert': val => `3ÈME OFF`,
  Prix_degressif: val => `PRIX DIGR (${val}€)`,
  Nouveau_prix_fixe: val => `PRIX FIXE (${val}€)`,
  Remise_Global: val => `REM GLOBAL (${val}€)`,
  Generic: val => `SUR ACHAT ${val || ''}`,
  Remise_en_pour_sur_le_2eme_gamme: val => `${val || ''}% SUR 2 ÈME GAM`,
  Prix_en_baisse: val => `PRIX BAIS (${val}€)`,
};
export function serializePromosValues(promos, opType) {
  let actualColumns = displayedColumns;
  let actualHeaders = headers;
  if (opType.toLowerCase().indexOf('mea') !== -1) {
    actualColumns = displayedColumnsMEA;
    actualHeaders = headersMEA;
    console.log(actualColumns);
    console.log(actualHeaders);
  } else {
    if (opType === 'OP ACHAT') {
      actualHeaders.splice(7, 4);
      actualColumns.splice(7, 4);
    }
    if (opType === 'CHALLENGE EQUIPE') {
      actualHeaders.splice(6, 1);
      actualColumns.splice(6, 1);
    }
  }

  const res = promos.map((promo, index) =>
    actualColumns.map(key => {
      if (key === 'macro_type')
        return `${promo.dataValues.macro_type}  ${formatPromoType(
          promo.dataValues.micro_type,
          promo.dataValues.price,
        )}`;
      if (key === 'gamme')
        return `${promo.dataValues.gamme} ${
          promo.dataValues.libelle ? '-' + promo.dataValues.libelle : ''
        }`;
      if (key === 'contenance')
        return `${promo.dataValues.contenance} ( ${promo.dataValues.mes_unit})`;
      if (key === 'contenance')
        return `${
          promo.dataValues.lot_phys
            ? 'OUI (' + promo.dataValues.qte_lot + ')'
            : 'NON'
        })`;
      return promo.dataValues[key];
    }),
  );
  res.splice(0, 0, actualHeaders);

  return res;
}
function formatPromoType(microType, val) {
  if (typeof PROMO_TYPES[microType] !== 'function') {
    return PROMO_TYPES.Generic(val);
  }
  return PROMO_TYPES[microType](val);
}
