import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Certificate,
  CertificateStatus,
} from 'src/certificate/entities/certificate.entity';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Injectable()
export class CertificateSeedService {
  constructor(
    @InjectRepository(Certificate)
    private repository: Repository<Certificate>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async run() {
    const take = 5;
    const users = await this.userRepository.find({ take });

    for (const user of users) {
      await this.repository.save(
        this.repository.create({
          status: CertificateStatus.owned,
          ownerId: user.id,
        }),
      );
    }

    let count = 95;
    while (count > 0) {
      await this.repository.save(
        this.repository.create({
          status: CertificateStatus.available,
        }),
      );
      count--;
    }
  }
}
