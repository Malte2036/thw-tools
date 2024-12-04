import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { QuestionAnswer } from './question-answer.schema';
import { QuestionStats } from './question-stats.schema';

export enum QuizType {
  GA = 'ga',
  AGT = 'agt',
  CBRN = 'cbrn',
  RADIO = 'radio',
}

@Entity('questions')
@Index(['type', 'number'], { unique: true })
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuizType,
  })
  type: QuizType;

  @Column({ type: 'int' })
  number: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text', nullable: true })
  image: string | null;

  @OneToMany(() => QuestionAnswer, (answer) => answer.question, {
    cascade: true,
  })
  answers: QuestionAnswer[];

  @OneToMany(() => QuestionStats, (stats) => stats.question, {
    cascade: true,
  })
  stats: QuestionStats[];
}

export type CreateQuestionDto = Omit<Question, 'id'>;
