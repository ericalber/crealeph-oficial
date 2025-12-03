import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCors from '@fastify/cors';
import { AppModule } from './modules/app.module';
import { Config } from '@crealeph/config';

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: true });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter);
  await app.register(fastifyCors, { origin: true, credentials: true });
  const { API_PORT } = Config.api();
  await app.listen({ host: '0.0.0.0', port: API_PORT });
  // eslint-disable-next-line no-console
  console.log(`API em http://localhost:${API_PORT}`);
}

bootstrap();

