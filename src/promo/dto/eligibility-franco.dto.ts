import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IsExist } from '../../common/decorators/isUnique.validation';
import { EligibilityFrancoType } from '../../entities/EligibilityFrancoType';
export class EligibilityFrancoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsExist(
    { message: 'eligibility_franco_type_id not found' },
    {
      entityName: 'EligibilityFrancoType',
      entity: EligibilityFrancoType,
      key: 'id',
    },
    false,
  )
  eligibility_franco_type_id: number;
}
