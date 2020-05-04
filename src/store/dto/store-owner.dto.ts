import {
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddStoreDto } from './add-store.dto';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { UserCredentialDto } from 'src/user/dto/user.dto';
import { IsArrayOfObject } from '../validatore/arrayValidator';

export class StoreOwnerDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  @IsObject()
  store: AddStoreDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  @IsNotEmpty()
  owner: UserCredentialDto;

  @ApiProperty({ isArray: true, type: StorePermissionDto })
  @IsArrayOfObject({
    message: 'permissions must be an array of permission',
  })
  public permissions: StorePermissionDto[];
}
