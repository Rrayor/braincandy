import { Controller, Get, Req } from '@nestjs/common';

import { AppService } from './app.service';
import { Roles } from './modules/auth/enums/roles.enum';
import { Auth } from './modules/shared/decorators/auth.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('/csrf')
  @Auth(Roles.ADMIN, Roles.USER)
  csrf(@Req() req: { csrfToken: () => string }) {
    return req.csrfToken();
  }
}
