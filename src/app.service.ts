import { Injectable } from '@nestjs/common';
import { version } from '../package.json';

@Injectable()
export class AppService {
  getVersion(): string {
    const currentVersion = version.replaceAll('"', '');

    return `This is api for portfolio and siap -- version: ${currentVersion}`;
  }
}
