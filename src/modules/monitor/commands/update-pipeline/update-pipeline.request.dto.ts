import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray } from 'class-validator';
import { UpdatePipeline } from '@src/interface-adapters/interfaces/production/update.pipeline.interface';

export class UpdatePipelineRequest implements UpdatePipeline {
  @ApiProperty({
    description: 'Concurrency of pipeline',
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

export class UpdatePipelineHttpRequest
  extends UpdatePipelineRequest
  implements UpdatePipeline {}
