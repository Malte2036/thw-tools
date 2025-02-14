import { Question } from './question.schema';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'question_stats' })
@Index(['question'])
@Index(['correct'])
export class QuestionStats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Question, (question) => question.stats)
  question: Question;

  @Column({ type: 'boolean' })
  correct: boolean;

  @Column({ type: 'timestamp' })
  timestamp: Date;
}

export type CreateQuestionStatsDto = Omit<QuestionStats, 'id'>;
