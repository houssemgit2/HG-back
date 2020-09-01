import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SelectService } from './select.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Product } from '../entities/Product';
import { AddProductDto } from './dto/addProduct.dto';
import { GetProductDto } from './dto/get-product.dto';
import { GetGammeDto } from './dto/get-gamme.dto';
import { Gamme } from '../entities/Gamme';
import { OperationType } from '../entities/OperationType';
import { OptionalNameDto } from './dto/optional-name.dto';
import { EligibilityCaRangeType } from '../entities/EligibilityCaRangeType';
import { EmplacementType } from '../entities/EmplacementType';
import { RemunerationBaseType } from 'src/entities/RemunerationBaseType';
import { EqualConditionType } from '../entities/EqualConditionType';
import { RemunerationCaAnnualPlateType } from '../entities/RemunerationCaAnnualPlateType';
import { RemunerationCaAnnualTargetType } from '../entities/RemunerationCaAnnualTargetType';
import { RemunerationFixedType } from '../entities/RemunerationFixedType';
import { RepaymentCircuitType } from '../entities/RepaymentCircuitType';
import { DocumentProvideType } from '../entities/DocumentProvideType';
import { EligibilityFrancoType } from '../entities/EligibilityFrancoType';
import { DiscountDto } from './dto/discount.dto';
import { RemunerationDto } from './dto/remuneration.dto';

@ApiBearerAuth()
@Controller('')
export class SelectController {
  constructor(private readonly appService: SelectService) {}

  @ApiTags('Select list')
  @Get('/products')
  async getProduct(@Query() query: GetProductDto): Promise<Product[]> {
    return await this.appService.getProduct(query);
  }

  @ApiTags('Select list')
  @Post('/products')
  async addProduct(@Body() body: AddProductDto): Promise<any> {
    return await this.appService.addProduct(body);
  }

  @ApiTags('Select list')
  @Get('/gamme')
  async getGamme(@Query() query: GetGammeDto): Promise<Gamme[]> {
    return await this.appService.getGamme(query);
  }

  @ApiTags('Select list')
  @Get('/laboratories')
  async getLabos(@Query('name') name?: string): Promise<any[]> {
    return await this.appService.getLabos(name);
  }

  @ApiTags('Select list')
  @Get('/operations-types')
  async getOpTypes(@Query() query: OptionalNameDto): Promise<any[]> {
    return await this.appService.GetByName(
      {
        entityTarget: OperationType,
        name: 'OperationType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/units')
  async getUnit(@Query() query: OptionalNameDto) {
    return `can't find the unit table `;
    // await this.appService.GetByName(
    //       {
    //         entityTarget: Uni,
    //         name: 'OperationType',
    //       },
    //       query.name,
    //     );
  }
  @ApiTags('Select list')
  @Get('/eligibility-ca')
  async getEligibilityCa(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: EligibilityCaRangeType,
        name: 'EligibilityCaRangeType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/emplacements')
  async getEmplacement(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: EmplacementType,
        name: 'EmplacementType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/remunerations')
  async getRemunerationUnit(@Query() query: RemunerationDto) {
    return await this.appService.GetByName(
      {
        entityTarget: RemunerationBaseType,
        name: 'RemunerationBaseType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/comparison-types')
  async getEqualCondition(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: EqualConditionType,
        name: 'EqualConditionType',
      },
      query.name,
    );
  }
  @ApiTags('Select list')
  @Get('/ca-annuelle')
  async getCaAnnuell(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: RemunerationCaAnnualPlateType,
        name: 'RemunerationCaAnnualPlateType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/ca-target')
  async getCaTarget(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: RemunerationCaAnnualTargetType,
        name: 'RemunerationCaAnnualTargetType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/fixed-amount-condition')
  async getFixedAmount(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: RemunerationFixedType,
        name: 'RemunerationFixedType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/repayment-circuits')
  async getRepaymentCircuits(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: RepaymentCircuitType,
        name: 'RepaymentCircuitType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/proof-types')
  async getProofDocs(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: DocumentProvideType,
        name: 'DocumentProvideType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/franco-type')
  async getFranco(@Query() query: OptionalNameDto) {
    return await this.appService.GetByName(
      {
        entityTarget: EligibilityFrancoType,
        name: 'EligibilityFrancoType',
      },
      query.name,
    );
  }

  @ApiTags('Select list')
  @Get('/discounts')
  async getDiscount(@Query() query: DiscountDto) {
    return await this.appService.getDiscount(query);
  }
}
