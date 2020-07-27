import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExist } from '../../common/decorators/isUnique.validation';
import { Store } from '../../entities/Store';
export class AddStoreDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsUserAlreadyExist(
    {
      message: `Store cip  already exists. Choose another cip.`,
    },
    { entityName: 'store', entity: Store, key: 'cip' },
  )
  public cip: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public clu_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  public descr: string;
}
