import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import admin from 'firebase-admin';
import { FireBaseAdmin } from '../../auth/firebase.setup';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly admin: FireBaseAdmin,
    private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    const idToken = context.getArgs()[0]?.headers?.authorization.split(' ')[1];

    const permissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );

    if (await this.verify(app, idToken, permissions)) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  private async verify(
    app: admin.app.App,
    idToken: string,
    permissions: Array<string>
  ): Promise<boolean> {
    try {
      return (await app.auth().verifyIdToken(idToken)).role === permissions[0];
    } catch (error) {
      this.logger.error('Authentication error', error);
      return false;
    }
  }
}
