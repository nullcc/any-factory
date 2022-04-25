import { Injectable } from '@nestjs/common';
import { ProduceProductService } from '@modules/production/commands/produce-product/produce-product.service';
import { ProductionStatus } from '@src/interface-adapters/interfaces/production/production-status.interface';

@Injectable()
export class MonitorQueryHandler {
  constructor(private readonly produceProductService: ProduceProductService) {}

  getProductionStatus(): ProductionStatus {
    if (!this.produceProductService.isAvailable()) {
      return {} as ProductionStatus;
    }
    return {
      summary: this.produceProductService.getSummary(),
      concurrency: this.produceProductService.getConcurrency(),
      specs: this.produceProductService.getSpecs(),
    };
  }
}
