import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  InternalServerErrorException,
} from '@nestjs/common';
import { Gamme } from 'src/entities/Gamme';
import { Product } from 'src/entities/Product';
import { getConnection } from 'typeorm';

@Injectable()
export class PromoTransformPipe implements PipeTransform<any> {
  async transform(value: any, { type }: ArgumentMetadata) {
    if (type === 'body') {
      if (value.gamme) {
        value.gammeId =
          value.gamme.id ||
          (await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Gamme)
            .values({ name: value.gamme.name })
            .execute()
            .then(data => data.raw.insertId)
            .catch(e => {
              throw new InternalServerErrorException(e);
            }));
        delete value.gamme;
      }
      if (value.new_products && value.new_products.length) {
        for (const element of value.new_products) {
          const id = await this.saveProduct({
            gammeId: value.gammeId,
            name: element,
          });
          value.product_ids.push(id);
        }
      }
      if (value.product) {
        const product: any = {
          gammeId: value.gammeId,
          measureValue: value.measure_value,
          isLot: value.is_lot,
        };
        if (product.quantityLot) product.quantityLot = value.quantity_lot;
        if (product.measureTypeId)
          product.measureTypeId = value.measure_type_id;
        if (product.ean) product.ean = value.product.ean;

        let productId: number;
        if (!value.product.id)
          productId = await this.saveProduct({
            name: value.product.name,
            ...product,
          });
        else {
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
        }

        value.productIds = [productId];
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
