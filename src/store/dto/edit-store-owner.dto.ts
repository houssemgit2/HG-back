import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { EditUserCredentialDto } from '../../user/dto/edit-user.dto';
import { EditStoreDto } from './edit-store.dto';
import { Type } from 'class-transformer';

export class EditStoreOwnerDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  store: EditStoreDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  owner: EditUserCredentialDto;

  @ApiProperty({ isArray: true, type: StorePermissionDto, required: false })
  // @IsArrayOfObject({
  //   message: 'permissions must be an array of permission',
  // })
  @ValidateNested({ each: true })
  @Type(() => StorePermissionDto)
  public permissions: StorePermissionDto[];
}
