import { Module } from '@nestjs/common';
import { FireBaseAdmin } from './firebase.setup';
import { PrismaService } from './service/prisma.service';

@Module({
  exports: [PrismaService, FireBaseAdmin],
  providers: [PrismaService, FireBaseAdmin],
})
export class SharedModule {}
