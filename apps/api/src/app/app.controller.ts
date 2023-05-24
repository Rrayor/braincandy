import { Controller, Get } from '@nestjs/common';

import { DataSet, Prisma } from '@prisma/client';
import { AppService } from './app.service';
import { PrismaService } from './modules/shared/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prismaService: PrismaService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  //TODO: remove test code
  @Get('/create')
  async createDataSet(): Promise<DataSet> {
    const data: Prisma.DataSetCreateInput = {
      handle: 'handle',
      entries: [
        {
          key: 'key1',
          value: 'value1',
        },
        {
          key: 'key2',
          value: 'value2',
        }
      ],
    };
    return this.prismaService.dataSet.create({
      data
    })
  }

  @Get('/getall')
  async getAllDataSets(): Promise<Array<DataSet>> {
    return this.prismaService.dataSet.findMany();
  }
}
