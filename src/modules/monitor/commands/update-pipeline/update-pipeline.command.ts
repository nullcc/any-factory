import {
  Command,
  CommandProps,
} from '@libs/ddd/domain/base-classes/command.base';

export class UpdatePipelineCommand extends Command {
  constructor(props: CommandProps<UpdatePipelineCommand>) {
    super(props);
    this.concurrency = props.concurrency;
    this.specs = props.specs;
  }

  readonly concurrency: number;

  readonly specs: string[];
}
