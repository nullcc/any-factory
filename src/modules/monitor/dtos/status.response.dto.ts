import { ApiProperty } from '@nestjs/swagger';
import { ProductionStatus, Summary, Spec } from '@src/interface-adapters/interfaces/production/production-status.interface';

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
  specs: Spec[];
}

export class StatusHttpResponse
  extends StatusResponse
  implements ProductionStatus {}
