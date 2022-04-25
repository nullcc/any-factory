import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MonitorHttpController } from './queries/monitor.http.controller';
import { MonitorQueryHandler } from './queries/monitor.query-handler';
import { UpdateSchedulerHttpController } from '@modules/monitor/commands/update-scheduler/update-scheduler.http.controller';
import { ProductionModule } from '@modules/production/production.module';

const httpControllers = [MonitorHttpController, UpdateSchedulerHttpController];

@Module({
  imports: [CqrsModule, ProductionModule],
  controllers: [...httpControllers],
  providers: [MonitorQueryHandler],
})
export class MonitorModule {}
