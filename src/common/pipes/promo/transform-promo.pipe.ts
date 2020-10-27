import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  InternalServerErrorException,
} from '@nestjs/common';
import { Gamme } from 'src/entities/Gamme';
import { Product } from 'src/entities/Product';
import { getConnection } from 'typeorm';
import { Brand } from '../../../entities/Brand';

@Injectable()
export class PromoTransformPipe implements PipeTransform<any> {
  async transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'body') {
      if (value.gamme) {
        if (value.gamme.id) value.gammeId = value.gamme.id;
        else {
          const brands: Brand[] = await getConnection()
            .createQueryBuilder()
            .select('brand')
            .from(Brand, 'brand')
            .where('brand.laboratory_id =:id', { id: value.laboratory_id })
            .execute();
          value.gammeId = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Gamme)
            .values({ name: value.gamme.name, brandId: brands[0]?.id }) // TODO barndID must be dunamic
            .execute()
            .then(data => data.raw.insertId)
            .catch(e => {
              throw new InternalServerErrorException(e);
            });
          delete value.gamme;
        }
      }
      if (value.new_products && value.new_products.length) {
        if (!value.product_ids) value['product_ids'] = [];
        for (const element of value.new_products) {
          const id = await this.saveProduct({
            gammeId: value.gammeId,
            name: element,
          });
          if (value.product_ids) value.product_ids.push(id);
          else console.log('no product_ids to push new product on it');
        }
      }
      if (value.product) {
        const product: any = {
          gammeId: value.gammeId,
          measureValue: value.measure_value,
          isLot: value.is_lot,
        };
        if (value.quantityLot) product.quantityLot = value.quantity_lot;
        if (value.measureTypeId) product.measureTypeId = value.measure_type_id;
        if (value.product.ean) product.ean = value.product.ean;

        let productId: number;
        if (!value.product.id)
          productId = await this.saveProduct({
            name: value.product.name,
            ...product,
          });
        else if (product.measureValue || product.measureTypeId) {
          productId = value.product.id;
          await getConnection()
            .createQueryBuilder()
            .update(Product)
            .set(product)
            .where('id =:id', { id: productId })
            .execute()
            .catch(e => {
              console.log('error during update');
              throw new InternalServerErrorException(e);
            });
        } else productId = value.product.id;

        value['product_ids'] = [productId];
        delete value.product;
      }
    }
    return value;
  }

  saveProduct(product: any) {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(product)
      .execute()
      .then(data => data.raw.insertId)
      .catch(e => {
        throw new InternalServerErrorException(e);
      });
  }
}
