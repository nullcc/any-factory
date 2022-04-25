import { Logger } from '@libs/ddd/domain/ports/logger.port';

export abstract class AdapterBase {
  protected constructor(
    protected readonly logger: Logger,
  ) {}
}
