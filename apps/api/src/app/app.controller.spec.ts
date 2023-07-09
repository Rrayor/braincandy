import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FireBaseAdmin } from './modules/shared/firebase.setup';
import { FireBaseService } from './modules/shared/service/firebase.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: FireBaseAdmin, useValue: {} },
        {
          provide: FireBaseService,
          useValue: {},
        },
        { provide: Logger, useValue: {} },
      ],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
