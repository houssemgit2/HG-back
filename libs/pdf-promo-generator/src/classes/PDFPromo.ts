export class PDFPromo {
  copies;
  format;
  orientation;
  prmStartDate;
  prmEndDate;
  prmMention;
  type;
  prmDet;
  monge;
  leaflet;
  constructor({
    format,
    copies,
    type,
    orientation,
    prmStartDate,
    prmEndDate,
    prmMention,
    prmDet,
    monge,
    leaflet,
  }) {
    this.copies = copies;
    this.format = format;
    this.orientation = orientation;
    this.prmStartDate = prmStartDate;
    this.prmEndDate = prmEndDate;
    this.prmMention = prmMention;
    this.type = type;
    this.prmDet = prmDet;
    this.monge = monge;
    this.leaflet = leaflet;
  }
}
