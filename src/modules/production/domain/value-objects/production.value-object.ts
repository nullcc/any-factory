import { ValueObject } from '@libs/ddd/domain/base-classes/value-object.base';
import { Guard } from '@libs/ddd/domain/guard';
import { ArgumentNotProvidedException } from '@libs/exceptions';

export interface ProductionProps {
  specs: string[];
  concurrency: number;
}

export class Production extends ValueObject<ProductionProps> {
  get specs(): string[] {
    return this.props.specs;
  }

  get concurrency(): number {
    return this.props.concurrency;
  }

  protected validate(props: ProductionProps): void {
    if (Guard.isEmpty(props.specs)) {
      throw new ArgumentNotProvidedException('specs is not provided');
    }
  }
}
