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
    description: 'Production summary',
  })
  summary: Summary;

  @ApiProperty({
    description: 'Production concurrency',
  })
  concurrency: number;

  @ApiProperty({
    description: 'Product specs',
  })
  specs: string[];
}

export class StatusHttpResponse
  extends StatusResponse
  implements ProductionStatus {}
