import { Test, TestingModule } from '@nestjs/testing';
import { MoneyMapControllerController } from './money-map-controller.controller';
import { MoneyMapServiceService } from '../money-map-service/money-map-service.service';

describe('MoneyMapControllerController', () => {
  let controller: MoneyMapControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoneyMapControllerController],
    }).compile();

    controller = module.get<MoneyMapControllerController>(MoneyMapControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
