import {
  IsNotEmpty,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddStoreDto } from './add-store.dto';
import { UserCredentialDto } from 'src/auth/dto/user-credential.dto';
export class StoreOwnerDto {
  @ApiProperty()
  @ValidateNested()
  store: AddStoreDto;

  @ApiProperty()
  @ValidateNested()
  owner: UserCredentialDto;
}
