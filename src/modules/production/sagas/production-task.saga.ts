import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable, map } from 'rxjs';
import { Command } from '@src/libs/ddd/domain/base-classes/command.base';
import { ProduceProductCommand } from '@modules/production/commands/produce-product/produce-product.command';
import { ProductionTaskTriggeredEvent } from '@modules/production/events/production.event';

@Injectable()
export class ProductionTaskSagas {
  @Saga()
  accountGenerationTaskTriggered = (
    events$: Observable<any>,
  ): Observable<Command> => {
    return events$.pipe(
      ofType(ProductionTaskTriggeredEvent),
      map(
        (event) =>
          new ProduceProductCommand({
            specs: event.specs,
            concurrency: event.concurrency,
          }),
      ),
    );
  };
}
