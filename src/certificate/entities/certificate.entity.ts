import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { User } from '../../users/entities/user.entity';

export enum CertificateStatus {
  available = 0,
  owned = 1,
  transferred = 2,
}

@Entity()
export class Certificate extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: CertificateStatus.available })
  status: CertificateStatus;

  @Column({ nullable: true })
  ownerId: number;

  @OneToOne(() => User, {
    eager: false,
  })
  @JoinColumn()
  owner?: User | null;

  @DeleteDateColumn()
  public deletedAt?: Date;
}
