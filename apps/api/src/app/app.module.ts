import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LibraryModule } from './modules/library/library.module';
import { FireBaseAdmin } from './modules/shared/firebase.setup';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        CSRF_KEY: Joi.string().required(),
        COOKIE_PARSER_SECRET: Joi.string().required(),
        FIRE_BASE_PROJECT_ID: Joi.string().required(),
        FIRE_BASE_PRIVATE_KEY: Joi.string().required(),
        FIRE_BASE_CLIENT_EMAIL: Joi.string().required().email(),
      }),
      validationOptions: {
        allowUnknown: true,
      },
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3_600_000,
      max: 100,
    }),
    SharedModule,
    AuthModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FireBaseAdmin,
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
