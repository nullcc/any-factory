import { Result } from '@libs/ddd/domain/utils/result.util';

export interface InfluxdbAdapterPort {
  write(db: string, data: string): Promise<Result<boolean, Error>>;
}
