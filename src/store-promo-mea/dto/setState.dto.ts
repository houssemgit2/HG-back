import { IsNotEmpty, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
const PromoMeaStateEnum = ['CONFIRMED', 'REJECTED'];
export class SetStateDto {
  @ApiProperty({
    required: true,
    enum: PromoMeaStateEnum,
  })
  @IsEnum(PromoMeaStateEnum)
  @IsNotEmpty()
  public state:
    | 'TO_JUSTIFY'
    | 'PENDING'
    | 'CONFIRMED'
    | 'REJECTED'
    | 'NOT_JUSTIFIED'
    | 'OPERATION_REFUSED';

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  public store_id: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  public reason: number;
}
