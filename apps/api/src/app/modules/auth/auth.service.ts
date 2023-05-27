import { BadRequestException, Injectable } from "@nestjs/common";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { CreateUserDto } from "./dto/CreateUser.dto";
import { AuthResponseDto } from "./dto/CreateUserResponse.dto";
import { LoginUserDto } from "./dto/LoginUser.dto";
import { Roles } from "./enums/roles.enum";
import { FireBaseAdmin } from "./firebase.setup";

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

    async loginUser(userRequest: LoginUserDto): Promise<AuthResponseDto> {
        const { email, password } = userRequest;
        try {
            const auth = getAuth();
            const loggedInUser = await signInWithEmailAndPassword(auth, email, password);

            const tokenId = await loggedInUser.user.getIdToken();
            return new AuthResponseDto(loggedInUser.user.email, loggedInUser.user.displayName, tokenId);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}