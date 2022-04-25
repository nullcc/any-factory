import { ApiTags } from '@nestjs/swagger';
import { Controller, Patch, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateSchedulerHttpRequest } from './update-scheduler.request.dto';
import { UpdateSchedulerCommand } from '@modules/monitor/commands/update-scheduler/update-scheduler.command';

@ApiTags('Monitor')
@Controller()
export class UpdateSchedulerHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/production')
  async update(@Body() body: UpdateSchedulerHttpRequest) {
    const command = new UpdateSchedulerCommand(body);
    await this.commandBus.execute(command);
    return {};
  }
}
