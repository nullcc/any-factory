import { Logger } from '@libs/ddd/domain/ports/logger.port';
import { ConsoleLogger, Provider } from '@nestjs/common';

export const produceProductServiceLoggerSymbol = Symbol(
  'produceProductServiceLoggerSymbol',
);

export const productionServiceLoggerProvider: Provider = {
  provide: produceProductServiceLoggerSymbol,
  useFactory: (): Logger => {
    return new ConsoleLogger('ProduceProductService');
  },
};
