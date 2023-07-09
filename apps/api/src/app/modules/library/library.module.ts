import { Logger, Module } from '@nestjs/common';
import { PrismaService } from '../shared/service/prisma.service';
import { SharedModule } from '../shared/shared.module';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  imports: [SharedModule],
  controllers: [LibraryController],
  providers: [PrismaService, LibraryService, Logger],
})
export class LibraryModule {}
