/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContextType,
  ExecutionContext,
  Logger,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import {
  HttpArgumentsHost,
  RpcArgumentsHost,
  WsArgumentsHost,
} from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import admin from 'firebase-admin';
import { Roles } from '../../auth/enums/roles.enum';
import { FireBaseAdmin } from '../firebase.setup';
import { FireBaseService } from '../service/firebase.service';
import { AuthGuard } from './auth.guard';

class MockExecutionContext implements ExecutionContext {
  getClass<T = any>(): Type<T> {
    return {} as Type<T>;
  }

  getHandler(): () => unknown {
    return () => {
      // NOOP
    };
  }

  getArgs<T = any>(): T {
    return [{}] as T;
  }

  getArgByIndex<T = any>(): T {
    return {} as T;
  }

  switchToRpc(): RpcArgumentsHost {
    return {} as RpcArgumentsHost;
  }

  switchToHttp(): HttpArgumentsHost {
    return {} as HttpArgumentsHost;
  }

  switchToWs(): WsArgumentsHost {
    return {} as WsArgumentsHost;
  }

  getType<TContext extends string = ContextType>(): TContext {
    return {} as TContext;
  }
}

describe('AuthGuard', () => {
  const mockFirebaseAdmin = {
    setup() {
      return {
        auth() {
          return {
            verifyIdToken(token: string) {
              return {
                role: Roles.USER,
              };
            },
          };
        },
      };
    },
  };
  const mockReflector = (role: Roles) => ({
    get(key: string, fn: () => unknown) {
      return [role];
    },
  });
  const testUserId = '123';
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: FireBaseAdmin,
          useValue: mockFirebaseAdmin,
        },
        {
          provide: FireBaseService,
          useValue: {
            verifyToken: (app: admin.app.App, idToken: string) => ({
              uid: testUserId,
              role: Roles.USER,
            }),
          },
        },
        { provide: Logger, useValue: {} },
        {
          provide: Reflector,
          useValue: mockReflector(Roles.USER),
        },
        AuthGuard,
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('authorized', () => {
    it('canActivate should return true when user has access', async () => {
      const context = new MockExecutionContext();

      expect(await guard.canActivate(context)).toBe(true);
    });
  });

  describe('unauthorized', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: FireBaseAdmin,
            useValue: mockFirebaseAdmin,
          },
          {
            provide: FireBaseService,
            useValue: {
              verifyToken: (app: admin.app.App, idToken: string) => ({
                uid: testUserId,
                role: Roles.USER,
              }),
            },
          },
          { provide: Logger, useValue: {} },
          {
            provide: Reflector,
            useValue: mockReflector(Roles.ADMIN),
          },
          AuthGuard,
        ],
      }).compile();

      guard = module.get<AuthGuard>(AuthGuard);
    });

    it("canActivate should throw UnauthorizedException when user doesn't have access", async () => {
      const context = new MockExecutionContext();

      await expect(guard.canActivate(context)).rejects.toEqual(
        new UnauthorizedException()
      );
    });
  });
});
