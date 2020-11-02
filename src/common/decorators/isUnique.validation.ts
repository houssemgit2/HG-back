import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { getConnection } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class IsExistConstraint implements ValidatorConstraintInterface {
  repository: any;
  errIfExist: boolean;
  constructor(repository, errIfExist) {
    this.repository = repository;
    this.errIfExist = errIfExist;
  }
  async validate(value: number, args: ValidationArguments) {
    try {
      console.log(
        '------------------------------> we are looking if this id is exist',
        value,
      );
      const isExist = await getConnection()
        .createQueryBuilder()
        .select(this.repository.entityName) // table, Entity, key
        .from(this.repository.entity, this.repository.entityName)
        .where(
          `${this.repository.entityName}.${this.repository.key} = :value`,
          {
            value,
          },
        )
        .getOne();
      if (!this.errIfExist) return !!isExist; // return false when not found, throw error if not exist
      return !isExist; // return false if the desired element exist
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}

export function IsExist(
  validationOptions?: ValidationOptions,
  repository?: { entityName: string; entity: any; key: string },
  errIfExist = true,
) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new IsExistConstraint(repository, errIfExist),
    });
  };
}
