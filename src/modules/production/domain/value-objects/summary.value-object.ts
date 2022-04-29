import { ValueObject } from '@libs/ddd/domain/base-classes/value-object.base';
import { ArgumentNotProvidedException } from '@libs/exceptions';

export interface SummaryProps {
  ok: number;
  error: number;
  running: number;
  pending: number;
}

export class Summary extends ValueObject<SummaryProps> {
  get ok(): number {
    return this.props.ok;
  }

  get error(): number {
    return this.props.error;
  }

  get running(): number {
    return this.props.running;
  }

  get pending(): number {
    return this.props.pending;
  }

  protected validate(props: SummaryProps): void {
    if (props.ok < 0) {
      throw new ArgumentNotProvidedException(
        "concurrency can't be less than 0",
      );
    }
    if (props.error < 0) {
      throw new ArgumentNotProvidedException("error can't be less than 0");
    }
    if (props.running < 0) {
      throw new ArgumentNotProvidedException("running can't be less than 0");
    }
    if (props.pending < 0) {
      throw new ArgumentNotProvidedException("pending can't be less than 0");
    }
  }
}
