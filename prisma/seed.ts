// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create user
  const user = await prisma.user.upsert({
    where: { email: 'admin@mediavault.local' },
    update: {},
    create: { email: 'admin@mediavault.local' },
  });
  console.log('✓ User created:', user);

  // Create sample library
  const library = await prisma.library.upsert({
    where: { name: 'Sample Movies' },
    update: {},
    create: {
      name: 'Sample Movies',
      type: 'movies',
      path: '/media/movies',
    },
  });
  console.log('✓ Library created:', library);

  // Ensure sample media item exists and stays up to date.
  let media = await prisma.mediaItem.findFirst({
    where: {
      libraryId: library.id,
      title: 'Test Video',
      type: 'movie',
    },
  });

  if (!media) {
    media = await prisma.mediaItem.create({
      data: {
        title: 'Test Video',
        type: 'movie',
        libraryId: library.id,
        duration: 603, // 10 minutes approx
        codec: 'h264',
        year: 2025,
      },
    });
  } else {
    media = await prisma.mediaItem.update({
      where: { id: media.id },
      data: {
        duration: 603,
        codec: 'h264',
        year: 2025,
      },
    });
  }

  const existingVariant = await prisma.hlsVariant.findFirst({
    where: {
      mediaItemId: media.id,
      quality: '480p',
    },
  });

  if (!existingVariant) {
    await prisma.hlsVariant.create({
      data: {
        mediaItemId: media.id,
        quality: '480p',
        bitrate: 1500,
        manifestUrl:
          'https://pub-0439985b7dab4c45b97f07d23ded7462.r2.dev/TestVideo/index.m3u8',
      },
    });
  } else {
    await prisma.hlsVariant.update({
      where: { id: existingVariant.id },
      data: {
        bitrate: 1500,
        manifestUrl:
          'https://pub-0439985b7dab4c45b97f07d23ded7462.r2.dev/TestVideo/index.m3u8',
      },
    });
  }

  console.log('✓ Media item created:', media);

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
