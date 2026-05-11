import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://mediavoult.vercel.app',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean);

  // Enable CORS for frontend (Vercel + localhost)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed =
        allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');

      callback(null, isAllowed);
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`MediaVault API listening on port ${port}`);
}
bootstrap();
