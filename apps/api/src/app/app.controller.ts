import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { PrismaService } from './modules/shared/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prismaService: PrismaService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
