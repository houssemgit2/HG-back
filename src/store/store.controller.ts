import { Controller, Get } from '@nestjs/common';

@Controller('store')
export class StoreController {
  @Get()
  index(): string {
    return 'store list';
  }
}
