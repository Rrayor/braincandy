import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import { Roles } from '../../auth/enums/roles.enum';

@Injectable()
export class FireBaseService {
  // TODO: should refactor everything so FirebaseAdmin doesn't need to be used anywhere. This Service should do everything related to Firebase
  async verifyToken(
    app: admin.app.App,
    idToken: string
  ): Promise<{ uid: string; role: Roles }> {
    const { uid, role } = await app.auth().verifyIdToken(idToken);

    return {
      uid,
      role,
    };
  }
}
