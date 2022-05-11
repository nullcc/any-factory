import { Module } from '@nestjs/common';
import { ConfigModule } from 'nestjs-config';
import * as path from 'path';
import { MonitorModule } from '@modules/monitor/monitor.module';
import { ProductionModule } from '@modules/production/production.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    MonitorModule,
    ProductionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
