import { Test, TestingModule } from '@nestjs/testing';
import { MoneyMapServiceService } from './money-map-service.service';

describe('MoneyMapServiceService', () => {
  let service: MoneyMapServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoneyMapServiceService],
    }).compile();

    service = module.get<MoneyMapServiceService>(MoneyMapServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
