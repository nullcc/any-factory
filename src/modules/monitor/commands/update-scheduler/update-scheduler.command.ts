import {
  Command,
  CommandProps,
} from '@libs/ddd/domain/base-classes/command.base';

export class UpdateSchedulerCommand extends Command {
  constructor(props: CommandProps<UpdateSchedulerCommand>) {
    super(props);
    this.concurrency = props.concurrency;
    this.specs = props.specs;
  }

  readonly concurrency: number;

  readonly specs: string[];
}
