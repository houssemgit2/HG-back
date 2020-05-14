import {
  IsNotEmpty,
  IsEmail,
  IsNumber,
  MaxLength,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUserAlreadyExist } from '../../decorators/isUnique.validation';
import { User } from '../../entities/User';
export class AddOwnerDto {
  // @ApiProperty()
  // @IsNumber()
  // @IsOptional()
  // sto_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  fst_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  lst_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsUserAlreadyExist(
    {
      message: `owner email  already exists. Choose another cip.`,
    },
    { entityName: 'user', entity: User, key: 'email' },
  )
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  address: string;

  @ApiPropertyOptional()
  @IsString()
  phone_num: string;
}
