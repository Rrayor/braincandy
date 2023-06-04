import { Module } from '@nestjs/common';
import { FireBaseAdmin } from '../shared/firebase.setup';
import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [FireBaseAdmin, AuthService],
})
export class AuthModule {}
