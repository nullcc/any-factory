import { Module } from '@nestjs/common';
import { MonitorModule } from '@modules/monitor/monitor.module';
import { ProductionModule } from '@modules/production/production.module';

@Module({
  imports: [MonitorModule, ProductionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
