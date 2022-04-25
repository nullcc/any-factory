import { Logger } from '@libs/ddd/domain/ports/logger.port';

export abstract class SchedulerBase {
  protected readonly logger: Logger;

  abstract handleCron(): Promise<void>;
}
