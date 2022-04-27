import { Injectable, Scope, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler.base';
import { ProduceProductCommand } from './produce-product.command';
import {
  PipelineEntity,
  Summary,
} from '@modules/production/domain/entities/pipeline.entity';
import { Production } from '@modules/production/domain/value-objects/production.value-object';
import { Concurrency } from '@modules/production/domain/value-objects/concurrency.value-object';
import { produceProductServiceLoggerSymbol } from '@modules/production/providers/production.providers';

@Injectable({
  scope: Scope.DEFAULT,
})
@CommandHandler(ProduceProductCommand)
export class ProduceProductService extends CommandHandlerBase {
  private pipelineEntity: PipelineEntity;
  private isRunning = false;

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(produceProductServiceLoggerSymbol)
    private readonly logger: Logger,
  ) {
    super();
  }

  async handle(
    command: ProduceProductCommand,
  ): Promise<Result<boolean, Error>> {
    const production = new Production({
      specs: command.specs,
      concurrency: new Concurrency({
        n: command.concurrency,
      }),
    });
    this.logger.log(
      `Produces products: ${JSON.stringify(production.getRawProps(), null, 2)}`,
    );
    const result = PipelineEntity.create({ production: production });
    return result.unwrap(
      async (pipeline) => {
        this.isRunning = true;
        this.pipelineEntity = pipeline;
        this.pipelineEntity.run();
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

  getConcurrency() {
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
    this.pipelineEntity.addSpecs(specs);
  }

  getSummary(): Summary {
    return this.pipelineEntity.getSummary();
  }

  getSpecs(): string[] {
    return this.pipelineEntity.getSpecs();
  }
}
