import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/svelte';
import CheckboxAnswer from './CheckboxAnswer.svelte';
import '@testing-library/jest-dom';

describe('CheckboxAnswer Icons', () => {
	it('should show checked variant when checked but not revealed', () => {
		const { getByTestId, queryByTestId } = render(CheckboxAnswer, {
			props: {
				answer: { id: 1, text: 'Test', isCorrect: true },
				checked: true,
				revealAnswers: false,
				changeCheckedCallback: () => {}
			}
		});

		const answerDiv = getByTestId('answer-container');
		expect(answerDiv).toHaveClass('checkedVariant');
		expect(answerDiv).not.toHaveClass('uncheckedVariant');
		expect(answerDiv).not.toHaveClass('correctVariant');
		expect(answerDiv).not.toHaveClass('wrongVariant');
		expect(queryByTestId('check-mark')).toBeInTheDocument();
		expect(queryByTestId('x-mark')).not.toBeInTheDocument();
	});

	it('should show unchecked variant when not checked, correct answer, not revealed', () => {
		const { getByTestId, queryByTestId } = render(CheckboxAnswer, {
			props: {
				answer: { id: 1, text: 'Test', isCorrect: true },
				checked: false,
				revealAnswers: false,
				changeCheckedCallback: () => {}
			}
		});

		const answerDiv = getByTestId('answer-container');
		expect(answerDiv).toHaveClass('uncheckedVariant');
		expect(answerDiv).not.toHaveClass('checkedVariant');
		expect(answerDiv).not.toHaveClass('correctVariant');
		expect(answerDiv).not.toHaveClass('wrongVariant');
		expect(queryByTestId('check-mark')).not.toBeInTheDocument();
		expect(queryByTestId('x-mark')).not.toBeInTheDocument();
	});

	it('should show correct variant when checked, correct answer, revealed', () => {
		const { getByTestId, queryByTestId } = render(CheckboxAnswer, {
			props: {
				answer: { id: 1, text: 'Test', isCorrect: true },
				checked: true,
				revealAnswers: true,
				changeCheckedCallback: () => {}
			}
		});

		const answerDiv = getByTestId('answer-container');
		expect(answerDiv).not.toHaveClass('checkedVariant');
		expect(answerDiv).not.toHaveClass('uncheckedVariant');
		expect(answerDiv).toHaveClass('correctVariant');
		expect(answerDiv).not.toHaveClass('wrongVariant');

		expect(queryByTestId('check-mark')).toBeInTheDocument();
		expect(queryByTestId('x-mark')).not.toBeInTheDocument();
	});

	it('should show wrong variant when checked, not correct answer, revealed', () => {
		const { getByTestId, queryByTestId } = render(CheckboxAnswer, {
			props: {
				answer: { id: 1, text: 'Test', isCorrect: false },
				checked: true,
				revealAnswers: true,
				changeCheckedCallback: () => {}
			}
		});

		const answerDiv = getByTestId('answer-container');
		expect(answerDiv).not.toHaveClass('checkedVariant');
		expect(answerDiv).not.toHaveClass('uncheckedVariant');
		expect(answerDiv).not.toHaveClass('correctVariant');
		expect(answerDiv).toHaveClass('wrongVariant');
		expect(queryByTestId('x-mark')).toBeInTheDocument();
		expect(queryByTestId('check-mark')).not.toBeInTheDocument();
	});

	it('should show unchecked variant when not checked, not correct answer, revealed', () => {
		const { getByTestId, queryByTestId } = render(CheckboxAnswer, {
			props: {
				answer: { id: 1, text: 'Test', isCorrect: false },
				checked: false,
				revealAnswers: true,
				changeCheckedCallback: () => {}
			}
		});

		const answerDiv = getByTestId('answer-container');
		expect(answerDiv).not.toHaveClass('checkedVariant');
		expect(answerDiv).toHaveClass('uncheckedVariant');
		expect(answerDiv).not.toHaveClass('correctVariant');
		expect(answerDiv).not.toHaveClass('wrongVariant');
		expect(queryByTestId('check-mark')).not.toBeInTheDocument();
		expect(queryByTestId('x-mark')).toBeInTheDocument();
	});

	it('should show wrong variant when not checked, correct answer, revealed', () => {
		const { getByTestId, queryByTestId } = render(CheckboxAnswer, {
			props: {
				answer: { id: 1, text: 'Test', isCorrect: true },
				checked: false,
				revealAnswers: true,
				changeCheckedCallback: () => {}
			}
		});

		const answerDiv = getByTestId('answer-container');
		expect(answerDiv).not.toHaveClass('checkedVariant');
		expect(answerDiv).not.toHaveClass('uncheckedVariant');
		expect(answerDiv).not.toHaveClass('correctVariant');
		expect(answerDiv).toHaveClass('wrongVariant');
		expect(queryByTestId('check-mark')).toBeInTheDocument();
		expect(queryByTestId('x-mark')).not.toBeInTheDocument();
	});
});
