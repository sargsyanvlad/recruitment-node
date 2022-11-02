import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    let count = 0;
    while (count < 100) {
      await this.repository.save(
        this.repository.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email().toLowerCase(),
          password: 'secret',
          provider: 'email',
        }),
      );
      count++;
    }
  }
}
