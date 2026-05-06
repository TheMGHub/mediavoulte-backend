import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PlaybackService {
  constructor(private prisma: PrismaService) {}

  async getMediaItem(mediaId: number) {
    return this.prisma.mediaItem.findUnique({
      where: { id: mediaId },
      include: {
        hlsVariants: true,
        playbackProgress: true,
      },
    });
  }

  async getPlaybackProgress(userId: number, mediaId: number) {
    return this.prisma.playbackProgress.findUnique({
      where: {
        userId_mediaItemId: { userId, mediaItemId: mediaId },
      },
    });
  }

  async savePlaybackProgress(
    userId: number,
    mediaId: number,
    position: number,
    duration: number,
  ) {
    return this.prisma.playbackProgress.upsert({
      where: {
        userId_mediaItemId: { userId, mediaItemId: mediaId },
      },
      update: {
        position,
        lastWatched: new Date(),
      },
      create: {
        userId,
        mediaItemId: mediaId,
        position,
        duration,
      },
    });
  }

  async getContinueWatching(userId: number) {
    return this.prisma.playbackProgress.findMany({
      where: { userId },
      include: {
        mediaItem: {
          include: { hlsVariants: true },
        },
      },
      orderBy: { lastWatched: 'desc' },
      take: 20,
    });
  }

  async getRecentlyAdded(libraryId?: number) {
    return this.prisma.mediaItem.findMany({
      where: libraryId ? { libraryId } : {},
      include: { hlsVariants: true, library: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
