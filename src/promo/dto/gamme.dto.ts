import { ValidateIf, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsUserAlreadyExist } from 'src/common/decorators/isUnique.validation';
import { Gamme } from '../../entities/Gamme';

export class GammeDto {
  @ValidateIf(o => o.id || !o.name)
  @IsNotEmpty()
  @IsNumber()
  @IsUserAlreadyExist(
    { message: 'gamme id not found, use the name instead to create it' },
    { entityName: 'Gamme', entity: Gamme, key: 'id' },
    false,
  )
  id: number;

  @ValidateIf(o => !o.id)
  @IsNotEmpty()
  @IsString()
  name: string;
}
