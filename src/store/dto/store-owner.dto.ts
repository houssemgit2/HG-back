import {
  IsNotEmpty,
  IsObject,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddStoreDto } from './add-store.dto';
import { AuthCredentialDto } from 'src/auth/dto/auth-credential.dto';
export class StoreOwnerDto {
  @ApiProperty()
  @ValidateNested()
  store: AddStoreDto;

  @ApiProperty()
  @ValidateNested()
  owner: AuthCredentialDto;
}
