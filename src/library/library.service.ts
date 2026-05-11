import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async getLibraries() {
    const libraries = await this.prisma.library.findMany({
      include: {
        _count: { select: { mediaItems: true } },
      },
    });

    if (libraries.length > 0) {
      return libraries;
    }

    await this.ensureDefaultLibraryData();

    return this.prisma.library.findMany({
      include: {
        _count: { select: { mediaItems: true } },
      },
    });
  }

  private async ensureDefaultLibraryData() {
    const library = await this.prisma.library.upsert({
      where: { name: 'Sample Movies' },
      update: {},
      create: {
        name: 'Sample Movies',
        type: 'movies',
        path: '/media/movies',
      },
    });

    let media = await this.prisma.mediaItem.findFirst({
      where: {
        libraryId: library.id,
        title: 'Test Video',
        type: 'movie',
      },
    });

    if (!media) {
      media = await this.prisma.mediaItem.create({
        data: {
          title: 'Test Video',
          type: 'movie',
          libraryId: library.id,
          duration: 603,
          codec: 'h264',
          year: 2025,
        },
      });
    }

    const variant = await this.prisma.hlsVariant.findFirst({
      where: {
        mediaItemId: media.id,
        quality: '480p',
      },
    });

    if (!variant) {
      await this.prisma.hlsVariant.create({
        data: {
          mediaItemId: media.id,
          quality: '480p',
          bitrate: 1500,
          manifestUrl:
            'https://pub-0439985b7dab4c45b97f07d23ded7462.r2.dev/TestVideo/index.m3u8',
        },
      });
    }
  }

  async getLibraryContent(libraryId: number) {
    return this.prisma.mediaItem.findMany({
      where: {
        libraryId,
        type: 'movie', // or handle series differently
      },
      include: {
        hlsVariants: true,
      },
    });
  }

  async search(query: string) {
    return this.prisma.mediaItem.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      include: {
        library: true,
        hlsVariants: true,
      },
      take: 20,
    });
  }
}
