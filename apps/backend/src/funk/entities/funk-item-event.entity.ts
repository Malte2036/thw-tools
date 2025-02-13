import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { FunkItem } from './funk-item.entity';
import { User } from '../../user/entities/user.entity';

export type FunkItemEventType = 'borrowed' | 'returned';

@Entity({ name: 'funk_item_events' })
@Index(['funkItem', 'date'])
export class FunkItemEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FunkItem, { nullable: false })
  funkItem: FunkItem;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({ type: 'varchar', nullable: false })
  type: FunkItemEventType;

  @Column({
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
}
