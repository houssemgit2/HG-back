import {
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsDefined,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddStoreDto } from './add-store.dto';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { IsArrayOfObject } from '../validatore/arrayValidator';
import { Type } from 'class-transformer';
import { AddOwnerDto } from './add-owner.dto';

export class StoreOwnerDto {
         @ApiProperty()
         @ValidateNested({ each: true, always: true })
         @Type(() => AddStoreDto)
         public store: AddStoreDto;

         @ApiProperty()
         @ValidateNested({ each: true })
         @Type(() => AddOwnerDto)
         public owner: AddOwnerDto;

         @ApiProperty({ isArray: true, type: StorePermissionDto })
         // @IsArrayOfObject(
         //      {
         //     message: 'permissions must be an array of permission',
         //   },
         // )
         @ValidateNested({ each: true })
         @Type(() => StorePermissionDto)
         public permissions: StorePermissionDto[];
       }
