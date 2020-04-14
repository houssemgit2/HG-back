import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import 'moment/src/locale/fr-fr';
@Injectable()
export class PdfPromoGeneratorService {
  constructor() {
    moment.locale('fr-fr');
  }
}
