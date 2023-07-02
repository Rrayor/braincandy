import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import admin from 'firebase-admin';
import { Roles } from '../../auth/enums/roles.enum';
import { FireBaseAdmin } from '../firebase.setup';
import { FireBaseService } from '../service/firebase.service';

interface AuthData {
  uid: string;
  role: Roles;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly admin: FireBaseAdmin,
    private readonly firebaseService: FireBaseService,
    private readonly logger: Logger
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const app = this.admin.setup();
    const request = context.getArgs()[0];
    const idToken = request?.headers?.authorization?.split(' ')[1];

    const allowedRoles = this.reflector.get<string[]>(
      'permissions',
      context.getHandler()
    );

    const authData = await this.getAuthData(app, idToken);

    if (allowedRoles.includes(authData.role)) {
      // TODO: clean this up
      request.user = {
        id: authData.uid,
      };
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  private async getAuthData(
    app: admin.app.App,
    idToken: string
  ): Promise<AuthData> {
    try {
      const { uid, role } = await this.firebaseService.verifyToken(
        app,
        idToken
      );

      return {
        uid,
        role,
      };
    } catch (error) {
      this.logger.error('Authentication error', error);
      return {
        uid: null,
        role: Roles.UNAUTHORIZED,
      };
    }
  }
}
