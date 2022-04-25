import { ApiProperty } from '@nestjs/swagger';
import { Summary } from '@modules/production/domain/entities/scheduler.entity';
import { ProductionStatus } from '@src/interface-adapters/interfaces/production/production-status.interface';

export class StatusResponse implements ProductionStatus {
  constructor(status: ProductionStatus) {
    this.summary = status.summary;
    this.concurrency = status.concurrency;
    this.specs = status.specs;
  }

  @ApiProperty({
    description: 'Account generation summary',
  })
  summary: Summary;

  @ApiProperty({
    description: 'Account generation concurrency',
  })
  concurrency: number;

  @ApiProperty({
    description: 'Account generation specs',
  })
  specs: string[];
}

export class StatusHttpResponse
  extends StatusResponse
  implements ProductionStatus {}
