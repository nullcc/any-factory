import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Command, Console } from 'nestjs-console';
import { ProduceProductCommand } from './produce-product.command';
import { Production } from '@src/interface-adapters/interfaces/production/production.interface';

@Console()
@Injectable()
export class ProduceProductCliController {
  constructor(private readonly commandBus: CommandBus) {}

  @Command({
    command: 'produce-product',
    description: 'Produce product',
    options: [
      {
        flags: '-s, --specs <specs>',
        required: true,
        fn: (value) => value.split(';'),
        description: 'Product specs',
      },
      {
        flags: '-c, --concurrency <concurrency>',
        required: false,
        defaultValue: 1,
        fn: (value) => parseInt(value),
        description: 'Concurrency of production task',
      },
      {
        flags: '--with-server',
        required: false,
        description:
          'Will start a HTTP server to provide a way to inspect some internal data if specified',
      },
    ],
  })
  async generateAccounts(opts: Production): Promise<void> {
    const command = new ProduceProductCommand(opts);
    await this.commandBus.execute(command);
  }
}
