import {
  IsNotEmpty,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddStoreDto } from './add-store.dto';
import { UserCredentialDto } from 'src/auth/dto/user-credential.dto';
import { StorePermissionDto } from 'src/auth/dto/store-permission.dto';
export class StoreOwnerDto {
  @ApiProperty()
  @ValidateNested()
  store: AddStoreDto;

  @ApiProperty()
  @ValidateNested()
  owner: UserCredentialDto;

  @ApiProperty()
  @ValidateNested()
  @IsArray()
  permission: StorePermissionDto[];
}
