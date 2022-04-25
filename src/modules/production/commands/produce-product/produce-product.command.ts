import {
  Command,
  CommandProps,
} from '@src/libs/ddd/domain/base-classes/command.base';

export class ProduceProductCommand extends Command {
  constructor(props: CommandProps<ProduceProductCommand>) {
    super(props);
    this.specs = props.specs;
    this.concurrency = props.concurrency;
  }

  readonly specs: string[];

  readonly concurrency: number;
}
