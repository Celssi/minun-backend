import { Controller, Get } from '@nestjs/common';
import * as packageJson from '../../package.json';
import { Public } from '../auth/public.decorator';

@Controller('api/version')
export class VersionController {
  @Public()
  @Get()
  getVersion(): Promise<any> {
    return Promise.resolve({ version: packageJson.version });
  }
}
