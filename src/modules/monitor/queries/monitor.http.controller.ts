import { Controller, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitorQueryHandler } from './monitor.query-handler';
import { StatusHttpResponse } from '@modules/monitor/dtos/status.response.dto';

@ApiTags('Monitor')
@Controller()
export class MonitorHttpController {
  constructor(private readonly monitorQueryHandler: MonitorQueryHandler) {}

  @Get('/production/status')
  @ApiOperation({ summary: 'Get status of production' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: StatusHttpResponse,
  })
  getStatus(): any {
    return new StatusHttpResponse(
      this.monitorQueryHandler.getAccountGenerationStatus(),
    );
  }
}
