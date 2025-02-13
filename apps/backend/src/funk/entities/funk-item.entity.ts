import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Organisation } from '../../organisation/entities/organisation.entity';

@Entity({ name: 'funk_items' })
@Index(['deviceId', 'organisation'], { unique: true })
export class FunkItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  deviceId: string;

  @ManyToOne(() => Organisation, { nullable: false })
  organisation: Organisation;
}
