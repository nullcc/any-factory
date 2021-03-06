import { Injectable, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { ConfigService } from 'nestjs-config';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler.base';
import { ProduceProductCommand } from './produce-product.command';
import { PipelineEntity } from '@modules/production/domain/entities/pipeline.entity';
import { Production } from '@modules/production/domain/value-objects/production.value-object';
import { Spec } from '@modules/production/domain/value-objects/spec.value-object';
import { Concurrency } from '@modules/production/domain/value-objects/concurrency.value-object';
import { Summary } from '@modules/production/domain/value-objects/summary.value-object';
import { produceProductServiceLoggerSymbol } from '@modules/production/providers/production.providers';

@Injectable()
@CommandHandler(ProduceProductCommand)
export class ProduceProductService extends CommandHandlerBase {
  private pipelineEntity: PipelineEntity;
  private isRunning = false;

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(produceProductServiceLoggerSymbol)
    private readonly logger: Logger,
    private readonly config: ConfigService,
  ) {
    super();
  }

  async handle(
    command: ProduceProductCommand,
  ): Promise<Result<boolean, Error>> {
    const specServer = this.config.get('app.specServer');
    const production = new Production({
      specs: command.specs.map((spec) => {
        const [name, count] = spec.split(':');
        return new Spec({
          name,
          count: isNaN(parseInt(count)) ? 1 : parseInt(count),
        });
      }),
      concurrency: new Concurrency({
        n: command.concurrency,
      }),
    });
    this.logger.log(`Spec server: ${specServer}`);
    this.logger.log(
      `Produces products: ${JSON.stringify(production.getRawProps(), null, 2)}`,
    );
    const result = PipelineEntity.create({ production: production });
    return result.unwrap(
      async (pipeline) => {
        this.isRunning = true;
        this.pipelineEntity = pipeline;
        await this.pipelineEntity.run();
        return Result.ok(true);
      },
      async (error) => {
        return Result.err(error);
      },
    );
  }

  isAvailable(): boolean {
    return this.isRunning;
  }

  getConcurrency(): number {
    return this.pipelineEntity.getConcurrency();
  }

  setConcurrency(value: number) {
    this.logger.log(`Sets concurrency to: ${value}`);
    const newConcurrency = new Concurrency({
      n: value,
    });
    this.pipelineEntity.setConcurrency(newConcurrency);
  }

  addSpecs(specs: string[]) {
    this.logger.log(`Adds specs: ${specs}`);
    const additionalSpecs = specs.map((spec) => {
      const [name, count] = spec.split(':');
      return new Spec({
        name,
        count: isNaN(parseInt(count)) ? 1 : parseInt(count),
      });
    });
    this.pipelineEntity.addSpecs(additionalSpecs);
  }

  getSummary(): Summary {
    return this.pipelineEntity.getSummary();
  }

  getSpecs(): Spec[] {
    return this.pipelineEntity.getSpecs();
  }
}
