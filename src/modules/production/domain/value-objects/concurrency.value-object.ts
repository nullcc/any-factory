import { ValueObject } from '@libs/ddd/domain/base-classes/value-object.base';
import { ArgumentNotProvidedException } from '@libs/exceptions';

export interface ConcurrencyProps {
  n: number;
}

export class Concurrency extends ValueObject<ConcurrencyProps> {
  get n(): number {
    return this.props.n;
  }

  protected validate(props: ConcurrencyProps): void {
    if (props.n < 1) {
      throw new ArgumentNotProvidedException(
        "concurrency can't be less than 1",
      );
    }
  }
}
