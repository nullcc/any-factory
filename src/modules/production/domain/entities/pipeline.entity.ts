import Queue from 'queue-fifo';
import { Semaphore, SemaphoreInterface } from 'async-mutex';
import { ConsoleLogger } from '@nestjs/common';
import * as _ from 'lodash';
import { AggregateRoot } from '@libs/ddd/domain/base-classes/aggregate-root.base';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { Result } from '@libs/ddd/domain/utils/result.util';
import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { Production } from '@modules/production/domain/value-objects/production.value-object';
import { sleep } from '@libs/ddd/domain/utils/common';
import { CreateEntityProps } from '@libs/ddd/domain/base-classes/entity.base';

export interface Summary {
  ok: number;
  error: number;
  running: number;
  pending: number;
}

export interface CreatePipelineProps {
  production: Production;
}

export type PipelineProps = CreateEntityProps<CreatePipelineProps>;

export class PipelineEntity extends AggregateRoot<CreatePipelineProps> {
  protected readonly _id: UUID;
  private specs: string[];
  private concurrency: number;
  private readonly pendingQueue: Queue<string>;
  private running: number;
  private semaphore: Semaphore;
  private readonly summary: Summary;
  private readonly logger: Logger;
  private counter: number;
  private readonly okSpecs: Map<string, number>;
  private readonly errorSpecs: Map<string, number>;

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
    this.concurrency = props.props.production.concurrency;
    this.pendingQueue = new Queue<string>();
    this.running = 0;
    this.semaphore = new Semaphore(this.concurrency);
    this.summary = {
      ok: 0,
      error: 0,
      running: 0,
      pending: 0,
    };
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
    return this.concurrency;
  }

  setConcurrency(value: number) {
    if (value < 1) {
      return;
    }
    this.concurrency = value;
    this.semaphore.cancel();
    this.semaphore = new Semaphore(this.concurrency);
  }

  addSpecs(specs: string[]) {
    this.loadProductSpecs(specs);
  }

  getSummary(): Summary {
    return {
      ok: this.summary.ok,
      error: this.summary.error,
      running: this.running,
      pending: this.pendingQueue.size(),
    };
  }

  getSpecs(): string[] {
    return this.specs;
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
      this.summary['ok'] += 1;
      this.increaseOkSpec(productSpec);
      this.logger.log(`✅ No.${counter} pipeline finished.`);
    } catch (err) {
      this.summary['error'] += 1;
      this.increaseErrorSpec(productSpec);
    } finally {
      this.running -= 1;
      release();
      this.logger.log(
        `ℹ️  Summary: ${JSON.stringify(this.getSummary(), null, 2)}`,
      );
    }
  }

  private loadProductSpecs(specs: string[]): void {
    this.specs = this.specs.concat(specs);
    const results = _.chain(specs)
      .map((e) => {
        const [spec, n] = e.split(':');
        const count = isNaN(parseInt(n)) ? 1 : parseInt(n);
        return _.range(count).map((e) => spec);
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
}
