import { writable } from 'svelte/store';
import type { HumanGender } from './clothing';

export type ClothingInputValue = {
	gender: HumanGender;
	height: string;
	chest: string;
	waist: string;
	hip: string;
	insideLegLength: string;
};

export const clothingInput = writable<ClothingInputValue>({
	gender: 'M',
	height: '',
	chest: '',
	waist: '',
	hip: '',
	insideLegLength: ''
});
