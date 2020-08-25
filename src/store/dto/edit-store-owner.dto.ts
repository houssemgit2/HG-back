import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EditUserCredentialDto } from '../../user/dto/edit-user.dto';
import { EditStoreDto } from './edit-store.dto';
import { Type } from 'class-transformer';
import { StorePermissionDto } from './store-permission.dto';

export class EditStoreOwnerDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  store: EditStoreDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  owner: EditUserCredentialDto;

  @ApiProperty({ isArray: true, type: StorePermissionDto, required: false })
  @ValidateNested({ each: true })
  @Type(() => StorePermissionDto)
  public permissions: StorePermissionDto[];
}
