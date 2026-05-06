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

  // Create sample media item (your test video)
  const media = await prisma.mediaItem.create({
    data: {
      title: 'Test Video',
      type: 'movie',
      libraryId: library.id,
      duration: 603, // 10 minutes approx
      codec: 'h264',
      year: 2025,
      hlsVariants: {
        create: [
          {
            quality: '480p',
            bitrate: 1500,
            manifestUrl: 'https://pub-0439985b7dab4c45b97f07d23ded7462.r2.dev/TestVideo/index.m3u8',
          },
        ],
      },
    },
  });
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
