import { ApiTags } from '@nestjs/swagger';
import { Controller, Patch, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UpdatePipelineHttpRequest } from './update-pipeline.request.dto';
import { UpdatePipelineCommand } from '@modules/monitor/commands/update-pipeline/update-pipeline.command';

@ApiTags('Monitor')
@Controller()
export class UpdatePipelineHttpController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch('/pipeline')
  async update(@Body() body: UpdatePipelineHttpRequest) {
    const command = new UpdatePipelineCommand(body);
    await this.commandBus.execute(command);
    return {};
  }
}
