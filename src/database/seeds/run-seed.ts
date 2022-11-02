import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { CertificateSeedService } from './certificate/certificate-seed.service';
// import { UserSeedService } from './user/user-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule, {
    logger: ['error', 'warn'],
  });

  // await app.get(UserSeedService).run();
  await app.get(CertificateSeedService).run();

  await app.close();
};

void runSeed();
