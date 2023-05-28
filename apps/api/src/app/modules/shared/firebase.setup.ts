import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin, { ServiceAccount } from 'firebase-admin';
let app: admin.app.App = null;

@Injectable()
export class FireBaseAdmin implements OnApplicationBootstrap {
  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    if (!app) {
      const serviceAccount: ServiceAccount = {
        projectId: this.configService.get<string>('FIRE_BASE_PROJECT_ID'),
        privateKey: this.configService.get<string>('FIRE_BASE_PRIVATE_KEY'),
        clientEmail: this.configService.get<string>('FIRE_BASE_CLIENT_EMAIL'),
      };
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
  }
  setup() {
    return app;
  }
}
