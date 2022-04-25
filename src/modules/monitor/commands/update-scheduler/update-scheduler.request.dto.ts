import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray } from 'class-validator';
import { UpdateScheduler } from '@src/interface-adapters/interfaces/production/update.scheduler.interface';

export class UpdateSchedulerRequest implements UpdateScheduler {
  @ApiProperty({
    description: 'Concurrency of production task',
    required: false,
  })
  @IsNumber()
  readonly concurrency: number;

  @ApiProperty({
    description: 'Added specs',
    required: false,
  })
  @IsArray()
  readonly specs: string[];
}

export class UpdateSchedulerHttpRequest
  extends UpdateSchedulerRequest
  implements UpdateScheduler {}
