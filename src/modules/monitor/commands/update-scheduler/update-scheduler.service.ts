import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { ProduceProductService } from '@modules/production/commands/produce-product/produce-product.service';
import { UpdateSchedulerCommand } from '@modules/monitor/commands/update-scheduler/update-scheduler.command';

@Injectable({
  scope: Scope.DEFAULT,
})
@CommandHandler(UpdateSchedulerCommand)
export class UpdateSchedulerService extends CommandHandlerBase {
  private logger = new ConsoleLogger(UpdateSchedulerService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly generateAccountService: ProduceProductService,
  ) {
    super();
  }

  async handle(
    command: UpdateSchedulerCommand,
  ): Promise<Result<boolean, Error>> {
    if (!this.generateAccountService.isAvailable()) {
      return Result.ok(true);
    }
    if (command.concurrency > 0) {
      this.generateAccountService.setConcurrency(command.concurrency);
    }
    if (command.specs) {
      this.generateAccountService.addSpecs(command.specs);
    }
    return Result.ok(true);
  }
}
