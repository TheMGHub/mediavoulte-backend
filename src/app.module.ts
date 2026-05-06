import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { LibraryModule } from './library/library.module';
import { PlaybackModule } from './playback/playback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    LibraryModule,
    PlaybackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
