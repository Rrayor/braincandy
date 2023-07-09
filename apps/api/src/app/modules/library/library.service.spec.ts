/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prismaErrorCodes } from '../shared/constants/prisma-codes';
import { PrismaService } from '../shared/service/prisma.service';
import { LibraryService } from './library.service';

describe('LibraryService', () => {
  let service: LibraryService;
  const mockPrismaServiceWithErrors = {
    library: {
      create: (_: { data: { userId: string } }) => {
        throw new PrismaClientKnownRequestError('unique constraint violation', {
          code: prismaErrorCodes.UNIQUE_CONSTRAINT_VIOLATION,
          clientVersion: '',
        });
      },
      findFirstOrThrow: (_: { where: { userId: string } }) => {
        throw new Error('Not found'); // The type of the error does not matter here
      },
      delete: (_: { where: { userId: string } }) => {
        throw new Error('Not found'); // The type of the error does not matter here
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: PrismaService,
          useValue: mockPrismaServiceWithErrors,
        },
        {
          provide: Logger,
          useValue: {
            error: (_: unknown) => {},
            log: (_: unknown) => {},
          },
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException', async () => {
      await expect(service.create('123')).rejects.toBeInstanceOf(
        ConflictException
      );
    });
  });

  describe('getByUserId', () => {
    it('should throw NotFoundException', () => {
      expect(service.getByUserId('123')).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });

  describe('removeByUserId', () => {
    it('should throw BadRequestException', () => {
      expect(service.removeByUserId('123')).rejects.toBeInstanceOf(
        BadRequestException
      );
    });
  });
});
