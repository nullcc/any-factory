import Queue from 'queue-fifo';
import { Semaphore, SemaphoreInterface } from 'async-mutex';
import { ConsoleLogger } from '@nestjs/common';
import * as _ from 'lodash';
import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { Production } from '@modules/production/domain/value-objects/production.value-object';
import { Concurrency } from '@modules/production/domain/value-objects/concurrency.value-object';
import {
  Spec,
  SpecProps,
} from '@modules/production/domain/value-objects/spec.value-object';
import {
  Summary,
  SummaryProps,
} from '@modules/production/domain/value-objects/summary.value-object';
import { sleep } from '@libs/ddd/domain/utils/common';
import { CreateEntityProps } from '@libs/ddd/domain/base-classes/entity.base';

export interface CreatePipelineProps {
  production: Production;
}

export type PipelineProps = CreateEntityProps<CreatePipelineProps>;

export class PipelineEntity extends AggregateRoot<CreatePipelineProps> {
  protected readonly _id: UUID;
  private specs: Spec[];
  private concurrency: Concurrency;
  private readonly pendingQueue: Queue<string>;
  private running: number;
  private semaphore: Semaphore;
  private readonly logger: Logger;
  private counter: number;
  private readonly okSpecs: Map<string, number>;
  private readonly errorSpecs: Map<string, number>;
  private ok = 0;
  private error = 0;

  static create(create: CreatePipelineProps): Result<PipelineEntity, Error> {
    const id = UUID.generate();
    const props: CreatePipelineProps = { ...create };
    return PipelineEntity.doCreate(id, props);
  }

  static doCreate(
    id: UUID,
    props: CreatePipelineProps,
  ): Result<PipelineEntity, Error> {
    const entityProps: CreatePipelineProps = {
      ...props,
    };
    const entity = new PipelineEntity({ id, props: entityProps });
    return Result.ok(entity);
  }

  constructor(props: PipelineProps) {
    super(props);
    this.specs = [];
    this.concurrency = new Concurrency({
      n: props.props.production.concurrency.n,
    });
    this.pendingQueue = new Queue<string>();
    this.running = 0;
    this.semaphore = new Semaphore(this.concurrency.n);
    this.logger = new ConsoleLogger(PipelineEntity.name);
    this.counter = 0;
    this.okSpecs = new Map<string, number>();
    this.errorSpecs = new Map<string, number>();
    this.loadProductSpecs(props.props.production.specs);
  }

  async run(): Promise<void> {
    while (true) {
      if (this.isCompleted()) {
        this.logger.log('🍺 Done, bye bye ~');
        process.exit(0);
      }
      if (!this.hasAvailablePipelines() || !this.hasPendingProducts()) {
        await sleep(1000);
        continue;
      }
      try {
        const [value, release] = await this.semaphore.acquire();
        const productSpec = this.pendingQueue.dequeue();
        this.trigger(productSpec, release);
      } catch (err) {
        // todo
      }
    }
  }

  getConcurrency(): number {
    return this.concurrency.n;
  }

  setConcurrency(concurrency: Concurrency) {
    this.concurrency = concurrency;
    this.semaphore.cancel();
    this.semaphore = new Semaphore(this.concurrency.n);
  }

  addSpecs(specs: Spec[]) {
    this.loadProductSpecs(specs);
  }

  getSummary(): SummaryProps {
    return new Summary({
      ok: this.ok,
      error: this.error,
      running: this.running,
      pending: this.pendingQueue.size(),
    }).getRawProps();
  }

  getSpecs(): SpecProps[] {
    return this.specs.map((spec) => spec.getRawProps());
  }

  private async trigger(
    productSpec: string,
    release: SemaphoreInterface.Releaser,
  ): Promise<void> {
    this.running += 1;
    this.counter += 1;
    const counter = this.counter;
    try {
      this.logger.log(
        `🚧 No.${counter} pipeline is going to be triggered with product spec: ${JSON.stringify(
          productSpec,
          null,
          2,
        )}, ${this.pendingQueue.size()} products(s) is pending.`,
      );
      await sleep(5000);
      this.updateResult('ok');
      this.increaseOkSpec(productSpec);
      this.logger.log(`✅ No.${counter} pipeline finished.`);
    } catch (err) {
      this.updateResult('error');
      this.increaseErrorSpec(productSpec);
    } finally {
      this.running -= 1;
      release();
      this.logger.log(
        `ℹ️  Summary: ${JSON.stringify(this.getSummary(), null, 2)}`,
      );
    }
  }

  private loadProductSpecs(specs: Spec[]): void {
    this.specs = this.specs.concat(specs);
    const results = _.chain(specs)
      .map((spec) => {
        return _.range(spec.count).map((e) => spec.name);
      })
      .flatMap()
      .value();
    results.forEach((item) => {
      this.pendingQueue.enqueue(item);
    });
  }

  private isCompleted(): boolean {
    return this.pendingQueue.isEmpty() && this.running === 0;
  }

  private hasAvailablePipelines(): boolean {
    return !this.semaphore.isLocked();
  }

  private hasPendingProducts(): boolean {
    return this.pendingQueue.size() > 0;
  }

  private increaseOkSpec(spec: string): void {
    const value = this.okSpecs.get(spec);
    if (value === undefined) {
      this.okSpecs.set(spec, 1);
    } else {
      this.okSpecs.set(spec, value + 1);
    }
  }

  private increaseErrorSpec(spec: string): void {
    const value = this.errorSpecs.get(spec);
    if (value === undefined) {
      this.errorSpecs.set(spec, 1);
    } else {
      this.errorSpecs.set(spec, value + 1);
    }
  }

  private updateResult(key: 'ok' | 'error'): void {
    this[key] += 1;
  }
}
