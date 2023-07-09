import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Library } from '@prisma/client';
import { Roles } from '../auth/enums/roles.enum';
import { Auth } from '../shared/decorators/auth.decorator';
import { LibraryResponseDto } from './dto/library-response.dto';
import { LibraryService } from './library.service';

@Controller('library')
@ApiTags('Library')
@ApiBearerAuth()
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly logger: Logger
  ) {}

  @Post('')
  @HttpCode(201)
  @Auth(Roles.ADMIN, Roles.USER)
  @ApiOperation({ summary: 'Create library for the currently logged in user' })
  @ApiCreatedResponse({ description: 'Library created for user' })
  @ApiConflictResponse({
    description: 'The logged in user already has a library',
  })
  create(@Request() req): Promise<Library> {
    return this.libraryService.create(req.user.id);
  }

  @Get('personal')
  @Auth(Roles.ADMIN, Roles.USER)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get the library of the currently logged in user' })
  @ApiOkResponse({
    description: 'Returns the users library',
    type: LibraryResponseDto,
  })
  @ApiNotFoundResponse({ description: 'The user does not have a library' })
  getPersonalLibrary(@Request() req): Promise<LibraryResponseDto> {
    return this.libraryService.getByUserId(req.user.id);
  }

  @Delete('')
  @Auth(Roles.ADMIN, Roles.USER)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Remove the library of the currently logged in user',
  })
  @ApiNoContentResponse({ description: 'Library successfully deleted' })
  @ApiBadRequestResponse({
    description:
      'Library could not be deleted. Either there was an error, or it does not exist',
  })
  removePersonalLibrary(@Request() req): Promise<void> {
    // TODO: invalidate cache -  #8
    return this.libraryService.removeByUserId(req.user.id);
  }
}
