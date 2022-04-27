import { ValueObject } from '@libs/ddd/domain/base-classes/value-object.base';
import { Guard } from '@libs/ddd/domain/guard';
import { ArgumentNotProvidedException } from '@libs/exceptions';
import { Concurrency } from '@modules/production/domain/value-objects/concurrency.value-object';

export interface ProductionProps {
  specs: string[];
  concurrency: Concurrency;
}

export class Production extends ValueObject<ProductionProps> {
  get specs(): string[] {
    return this.props.specs;
  }

  get concurrency(): Concurrency {
    return this.props.concurrency;
  }

  protected validate(props: ProductionProps): void {
    if (Guard.isEmpty(props.specs)) {
      throw new ArgumentNotProvidedException('specs is not provided');
    }
  }
}
