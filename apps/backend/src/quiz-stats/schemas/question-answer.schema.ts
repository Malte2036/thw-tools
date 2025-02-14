import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.schema';

@Entity({ name: 'question_answers' })
export class QuestionAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: Question;
}

export type CreateQuestionAnswerDto = Omit<QuestionAnswer, 'id'>;
