import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from 'src/certificate/entities/certificate.entity';
import { CertificateSeedService } from './certificate-seed.service';
import { User } from '../../../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate, User])],
  providers: [CertificateSeedService],
  exports: [CertificateSeedService],
})
export class CertificateSeedModule {}
