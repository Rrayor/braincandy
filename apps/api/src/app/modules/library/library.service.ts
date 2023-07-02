import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { prismaErrorCodes } from '../shared/constants/prisma-codes';
import { FireBaseService } from '../shared/service/firebase.service';
import { PrismaService } from '../shared/service/prisma.service';
import { LibraryResponseDto } from './dto/library-response.dto';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FireBaseService,
    private readonly logger: Logger
  ) {}

  // TODO: telemetry: db write
  async create(userId: string): Promise<LibraryResponseDto> {
    try {
      this.logger.log('[DB WRITE ATTEMPT] Create Library');
      return await this.prismaService.library.create({
        data: {
          userId,
        },
      });
    } catch (error) {
      this.logger.error(error);
      this.handleUniqueConstraintViolation(error);
    }
  }

  // TODO: telemetry: db read
  async getByUserId(userId: string): Promise<LibraryResponseDto> {
    try {
      this.logger.log('[DB READ ATTEMPT] Get Library by User ID');
      return await this.prismaService.library.findFirstOrThrow({
        where: {
          userId,
        },
      });
    } catch (error) {
      this.logger.error('Error getting library', error);
      throw new NotFoundException(
        'Could not find library for user. Try creating one'
      );
    }
  }

  // TODO: telemetry: db write
  async removeByUserId(userId: string): Promise<void> {
    try {
      this.logger.log('[DB WRITE ATTEMPT] Remove Library by User ID');
      await this.prismaService.library.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      this.logger.error('Could not delete library by user ID', error);
      throw new BadRequestException('Library could not be deleted');
    }
  }

  private handleUniqueConstraintViolation(error: unknown): void {
    if (
      (error as { code: string }).code ===
      prismaErrorCodes.UNIQUE_CONSTRAINT_VIOLATION // would be nicer with error instanceof PrismaClientKnownRequestError but doesn't work for some reason
    ) {
      throw new ConflictException('The user already has a library');
    }
  }
}
