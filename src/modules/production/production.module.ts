import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConsoleModule } from 'nestjs-console';
import { ProductionTaskSagas } from './sagas/production-task.saga';
import { ProduceProductCliController } from './commands/produce-product/produce-product.cli.controller';
import { ProduceProductService } from './commands/produce-product/produce-product.service';
import { UpdateSchedulerService } from '../monitor/commands/update-scheduler/update-scheduler.service';
import { generateAccountServiceLoggerProvider } from './providers/account-generation.providers';

const cliControllers = [ProduceProductCliController];

const commandHandlers = [ProduceProductService, UpdateSchedulerService];

const sagas = [ProductionTaskSagas];

const customProviders = [generateAccountServiceLoggerProvider];

@Global()
@Module({
  imports: [CqrsModule, ConsoleModule],
  controllers: [],
  providers: [
    ...cliControllers,
    ...commandHandlers,
    ...sagas,
    ...customProviders,
  ],
  exports: [...commandHandlers],
})
export class ProductionModule {}
