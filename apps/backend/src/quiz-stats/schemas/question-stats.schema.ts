import { Question } from './question.schema';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('question_stats')
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
