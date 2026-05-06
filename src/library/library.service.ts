import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async getLibraries() {
    return this.prisma.library.findMany({
      include: {
        _count: { select: { mediaItems: true } },
      },
    });
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
