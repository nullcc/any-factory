import { Injectable, Scope, Inject } from '@nestjs/common';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { CommandHandlerBase } from '@src/libs/ddd/domain/base-classes/command-handler.base';
import { ProduceProductCommand } from './produce-product.command';
import {
  SchedulerEntity,
  Summary,
} from '@modules/production/domain/entities/scheduler.entity';
import { Production } from '@modules/production/domain/value-objects/production.value-object';
import { produceProductServiceLoggerSymbol } from '@modules/production/providers/production.providers';

@Injectable({
  scope: Scope.DEFAULT,
})
@CommandHandler(ProduceProductCommand)
export class ProduceProductService extends CommandHandlerBase {
  private schedulerEntity: SchedulerEntity;
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
      concurrency: command.concurrency,
    });
    this.logger.log(
      `Produces products: ${JSON.stringify(production.getRawProps(), null, 2)}`,
    );
    const result = SchedulerEntity.create({ production: production });
    return result.unwrap(
      async (scheduler) => {
        this.isRunning = true;
        this.schedulerEntity = scheduler;
        this.schedulerEntity.run();
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
    return this.schedulerEntity.getConcurrency();
  }

  setConcurrency(value: number) {
    this.logger.log(`Sets concurrency to: ${value}`);
    this.schedulerEntity.setConcurrency(value);
  }

  addSpecs(specs: string[]) {
    this.logger.log(`Adds specs: ${specs}`);
    this.schedulerEntity.addSpecs(specs);
  }

  getSummary(): Summary {
    return this.schedulerEntity.getSummary();
  }

  getSpecs(): string[] {
    return this.schedulerEntity.getSpecs();
  }
}
