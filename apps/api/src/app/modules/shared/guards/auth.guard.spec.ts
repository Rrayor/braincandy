import { Logger } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { FireBaseAdmin } from "../firebase.setup";
import { AuthGuard } from "./auth.guard";

describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: FireBaseAdmin, useValue: {} }, { provide: Logger, useValue: {} }, AuthGuard]
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });
});
