import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { StorePermissionDto } from 'src/store/dto/store-permission.dto';
import { IsArrayOfObject } from '../validatore/arrayValidator';
import { EditUserCredentialDto } from '../../user/dto/edit-user.dto';
import { EditStoreDto } from './edit-store.dto';

export class EditStoreOwnerDto {
  @ApiProperty()
  @ValidateNested({ each: true })
  store: EditStoreDto;

  @ApiProperty()
  @ValidateNested({ each: true })
  owner: EditUserCredentialDto;

  @ApiProperty({ isArray: true, type: StorePermissionDto, required: false })
  @IsArrayOfObject({
    message: 'permissions must be an array of permission',
  })
  public permissions: StorePermissionDto[];
}
