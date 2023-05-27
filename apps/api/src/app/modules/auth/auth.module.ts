import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FireBaseAdmin } from './firebase.setup';

@Module({
  controllers: [AuthController],
  providers: [FireBaseAdmin, AuthService],
})
export class AuthModule {}
