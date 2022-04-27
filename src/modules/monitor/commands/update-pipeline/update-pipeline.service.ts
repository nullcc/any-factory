import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { CommandHandlerBase } from '@libs/ddd/domain/base-classes/command-handler.base';
import { ProduceProductService } from '@modules/production/commands/produce-product/produce-product.service';
import { UpdatePipelineCommand } from '@modules/monitor/commands/update-pipeline/update-pipeline.command';

@Injectable({
  scope: Scope.DEFAULT,
})
@CommandHandler(UpdatePipelineCommand)
export class UpdatePipelineService extends CommandHandlerBase {
  private logger = new ConsoleLogger(UpdatePipelineService.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly produceProductService: ProduceProductService,
  ) {
    super();
  }

  async handle(
    command: UpdatePipelineCommand,
  ): Promise<Result<boolean, Error>> {
    if (!this.produceProductService.isAvailable()) {
      return Result.ok(true);
    }
    this.produceProductService.setConcurrency(command.concurrency);
    if (command.specs) {
      this.produceProductService.addSpecs(command.specs);
    }
    return Result.ok(true);
  }
}
