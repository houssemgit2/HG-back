import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddStoreDto } from './add-store.dto';
import { Type } from 'class-transformer';
import { AddOwnerDto } from './add-owner.dto';
import { StorePermissionDto } from './store-permission.dto';

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
  @ValidateNested({ each: true })
  @Type(() => StorePermissionDto)
  public permissions: StorePermissionDto[];
}
