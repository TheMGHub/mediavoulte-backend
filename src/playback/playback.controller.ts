import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlaybackService } from './playback.service';

@Controller('api/playback')
@UseGuards(AuthGuard('jwt'))
export class PlaybackController {
  constructor(private playbackService: PlaybackService) {}

  @Get('media/:id')
  async getMediaItem(@Param('id') id: string) {
    return this.playbackService.getMediaItem(parseInt(id));
  }

  @Get('progress/:id')
  async getProgress(@Param('id') id: string, @Request() req: any) {
    return this.playbackService.getPlaybackProgress(req.user.userId, parseInt(id));
  }

  @Post('progress/:id')
  async saveProgress(
    @Param('id') id: string,
    @Body() body: { position: number; duration: number },
    @Request() req: any,
  ) {
    return this.playbackService.savePlaybackProgress(
      req.user.userId,
      parseInt(id),
      body.position,
      body.duration,
    );
  }

  @Get('continue-watching')
  async getContinueWatching(@Request() req: any) {
    return this.playbackService.getContinueWatching(req.user.userId);
  }

  @Get('recently-added')
  async getRecentlyAdded() {
    return this.playbackService.getRecentlyAdded();
  }
}
