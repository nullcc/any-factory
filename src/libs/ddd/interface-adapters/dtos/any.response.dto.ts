import { ApiProperty } from '@nestjs/swagger';

export class AnyResponse {
  constructor(data: any) {
    this.data = data;
  }

  @ApiProperty({ example: {} })
  data: any;
}
