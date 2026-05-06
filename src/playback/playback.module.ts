import { Module } from '@nestjs/common';
import { PlaybackService } from './playback.service';
import { PlaybackController } from './playback.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PlaybackService],
  controllers: [PlaybackController],
})
export class PlaybackModule {}
