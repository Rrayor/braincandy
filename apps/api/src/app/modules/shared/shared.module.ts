import { Module } from '@nestjs/common';
import { FireBaseAdmin } from './firebase.setup';
import { FireBaseService } from './service/firebase.service';
import { PrismaService } from './service/prisma.service';

@Module({
  exports: [PrismaService, FireBaseAdmin, FireBaseService],
  providers: [PrismaService, FireBaseAdmin, FireBaseService],
})
export class SharedModule {}
