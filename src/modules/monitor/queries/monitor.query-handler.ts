import { Injectable } from '@nestjs/common';
import { ProduceProductService } from '@modules/production/commands/produce-product/produce-product.service';
import { ProductionStatus } from '@src/interface-adapters/interfaces/production/production-status.interface';

@Injectable()
export class MonitorQueryHandler {
  constructor(private readonly generateAccountService: ProduceProductService) {}

  getAccountGenerationStatus(): ProductionStatus {
    if (!this.generateAccountService.isAvailable()) {
      return {} as ProductionStatus;
    }
    return {
      summary: this.generateAccountService.getSummary(),
      concurrency: this.generateAccountService.getConcurrency(),
      specs: this.generateAccountService.getSpecs(),
    };
  }
}
