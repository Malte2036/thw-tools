import { QuestionType } from '$lib/model/question';

/**
 * Formats a number with German-style thousand separators (dots)
 * Example: 100000 -> 100.000
 */
export function formatNumber(num: number): string {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Returns the short name of a quiz type (without "-Quiz" suffix)
 */
export function getQuizTypeShortName(type: QuestionType): string {
	switch (type) {
		case QuestionType.GA:
			return 'Grundausbildung';
		case QuestionType.AGT:
			return 'Atemschutz';
		case QuestionType.CBRN:
			return 'CBRN';
		case QuestionType.RADIO:
			return 'Sprechfunk';
		default:
			return type;
	}
}

/**
 * Returns the full name of a quiz type (with "-Quiz" suffix)
 */
export function getQuizTypeName(type: QuestionType): string {
	return `${getQuizTypeShortName(type)}-Quiz`;
}

/**
 * Formats an accuracy percentage with consistent terminology
 * Example: 81.5 -> "81,5%"
 */
export function formatAccuracy(accuracy: number): string {
	return `${accuracy.toFixed(1).replace('.', ',')}%`;
}
