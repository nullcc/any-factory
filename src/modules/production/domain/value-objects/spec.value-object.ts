import { ValueObject } from '@libs/ddd/domain/base-classes/value-object.base';
import { Guard } from '@libs/ddd/domain/guard';
import { ArgumentNotProvidedException } from '@libs/exceptions';

export interface SpecProps {
  name: string;
  count: number;
}

export class Spec extends ValueObject<SpecProps> {
  get name(): string {
    return this.props.name;
  }

  get count(): number {
    return this.props.count;
  }

  protected validate(props: SpecProps): void {
    if (Guard.isEmpty(props.name)) {
      throw new ArgumentNotProvidedException('name is not provided');
    }
    if (props.count < 1) {
      throw new ArgumentNotProvidedException("count can't be less than 1");
    }
  }
}
