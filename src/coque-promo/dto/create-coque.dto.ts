import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Periods {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  month: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  year: number;
}

class ClusterId {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cluster_id: number;
}

export class CreateCoqueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true, always: true })
  @Type(() => Periods)
  periods: Periods[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ClusterId)
  clusters: ClusterId[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  filesName: string[];
}
