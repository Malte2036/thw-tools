import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FunkItemEvent, FunkItemEventType } from './funk-item-event.entity';
import { Organisation } from '../../organisation/entities/organisation.entity';

@Entity({ name: 'funk_item_event_bulks' })
@Index(['organisation', 'date'])
export class FunkItemEventBulk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => FunkItemEvent)
  @JoinTable({
    name: 'funk_item_event_bulk_events',
    joinColumn: { name: 'bulk_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  funkItemEvents: FunkItemEvent[];

  @Column({ type: 'varchar', nullable: false })
  eventType: FunkItemEventType;

  @Column({ type: 'int', nullable: false, default: 0 })
  batteryCount: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Organisation, { nullable: false })
  organisation: Organisation;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
}
