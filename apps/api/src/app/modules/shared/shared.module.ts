import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class SharedModule {}
