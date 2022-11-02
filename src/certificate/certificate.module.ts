import { Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certificate } from './entities/certificate.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate])],
  controllers: [CertificateController],
  providers: [IsExist, IsNotExist, CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
