import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LibraryService } from './library.service';

@Controller('api/libraries')
@UseGuards(AuthGuard('jwt'))
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get()
  async getLibraries() {
    return this.libraryService.getLibraries();
  }

  @Get(':id')
  async getLibraryContent(@Param('id') id: string) {
    return this.libraryService.getLibraryContent(parseInt(id));
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return [];
    }
    return this.libraryService.search(query);
  }
}
