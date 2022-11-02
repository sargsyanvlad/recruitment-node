import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  Repository,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { Certificate, CertificateStatus } from './entities/certificate.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: Repository<Certificate>,
  ) {}

  transfer(newOwnerId: number, ownerId: number, certificateId: number) {
    return this.certificateRepository.update(
      {
        id: certificateId,
        ownerId,
      },
      {
        status: CertificateStatus.transferred,
        ownerId: newOwnerId,
      },
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    publicOnly: boolean,
  ) {
    const options: FindManyOptions = {
      select: {
        id: true,
        ownerId: true,
        status: true,
        owner: {
          firstName: true,
          lastName: true,
          id: true,
        },
      },
      relations: ['owner'],
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    };
    if (publicOnly) {
      options.where = { isPublic: true };
    }
    return this.certificateRepository.find(options);
  }

  findOne(fields: EntityCondition<Certificate>) {
    const options: FindOneOptions = {
      select: {
        id: true,
        ownerId: true,
        status: true,
        owner: {
          firstName: true,
          lastName: true,
          id: true,
        },
      },
      relations: ['owner'],
      where: { ...fields },
    };
    return this.certificateRepository.findOne(options);
  }

  update(
    condition: FindOptionsWhere<Certificate>,
    fields: QueryDeepPartialEntity<Certificate>,
  ) {
    return this.certificateRepository.update(condition, fields);
  }

  delete(condition: FindOptionsWhere<Certificate>) {
    return this.certificateRepository.delete(condition);
  }
}
