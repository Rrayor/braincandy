import { BadRequestException, Injectable } from '@nestjs/common';
import { FireBaseAdmin } from '../shared/firebase.setup';
import { CreateUserDto } from './dto/CreateUser.dto';
import { Roles } from './enums/roles.enum';

@Injectable()
export class AuthService {
  constructor(private readonly admin: FireBaseAdmin) {}

  async createUser(userRequest: CreateUserDto): Promise<void> {
    const { email, password, displayName } = userRequest;
    const app = this.admin.setup();

    // TODO: Create admin registration if needed
    const role = Roles.USER;

    try {
      const createdUser = await app.auth().createUser({
        email,
        password,
        displayName: displayName,
      });
      await app.auth().setCustomUserClaims(createdUser.uid, { role });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
