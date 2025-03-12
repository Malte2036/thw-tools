import { writable } from 'svelte/store';
import type { HumanGender } from './clothing';
import { browser } from '$app/environment';

export type ClothingInputValue = {
	gender: HumanGender;
	height: string;
	chest: string;
	waist: string;
	hip: string;
	insideLegLength: string;
};

const defaultClothingInput: ClothingInputValue = {
	gender: 'M',
	height: '',
	chest: '',
	waist: '',
	hip: '',
	insideLegLength: ''
};

const localStorageKey = 'clothingInput';
function getSavedClothingInput(): ClothingInputValue {
	if (!browser) return defaultClothingInput;

	const storedValue = localStorage.getItem(localStorageKey);
	if (!storedValue) return defaultClothingInput;

	try {
		return JSON.parse(storedValue);
	} catch (e) {
		console.error('Error parsing clothing input from local storage', e);
		return defaultClothingInput;
	}
}

export const clothingInput: any = writable<ClothingInputValue>(getSavedClothingInput(), () => {
	if (!browser) return;

	return clothingInput.subscribe((value: ClothingInputValue) =>
		localStorage.setItem(localStorageKey, JSON.stringify(value))
	);
});
