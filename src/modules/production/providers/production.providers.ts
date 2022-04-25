import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { ConsoleLogger, Provider } from '@nestjs/common';

export const productionServiceLoggerSymbol = Symbol(
  'productionServiceLoggerSymbol',
);

export const productionServiceLoggerProvider: Provider = {
  provide: productionServiceLoggerSymbol,
  useFactory: (): Logger => {
    return new ConsoleLogger('ProductionService');
  },
};
