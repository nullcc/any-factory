import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConsoleModule } from 'nestjs-console';
import { ProduceProductCliController } from './commands/produce-product/produce-product.cli.controller';
import { ProduceProductService } from './commands/produce-product/produce-product.service';
import { UpdatePipelineService } from '../monitor/commands/update-pipeline/update-pipeline.service';
import { productionServiceLoggerProvider } from './providers/production.providers';

const cliControllers = [ProduceProductCliController];

const commandHandlers = [ProduceProductService, UpdatePipelineService];

const customProviders = [productionServiceLoggerProvider];

@Global()
@Module({
  imports: [CqrsModule, ConsoleModule],
  controllers: [],
  providers: [...cliControllers, ...commandHandlers, ...customProviders],
  exports: [...commandHandlers],
})
export class ProductionModule {}
