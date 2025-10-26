import { Controller, Get } from '@nestjs/common'
import { MoneyMapService } from '../money-map.service' // adjust path if needed

@Controller('money-map-controller')
export class MoneyMapControllerController {
  constructor(private readonly moneyMapService: MoneyMapService) {}

  @Get()
  authenticate(): string {
    // use the service, e.g. this.moneyMapService.someMethod()
    return 'ok'
  }
}
