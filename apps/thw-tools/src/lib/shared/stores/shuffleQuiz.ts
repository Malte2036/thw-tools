import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const defaultValue = false;
const initialValue = browser
	? window.localStorage.getItem('shuffleQuiz') === 'true'
		? true
		: defaultValue
	: defaultValue;

const shuffleQuiz = writable<boolean>(initialValue);

shuffleQuiz.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('shuffleQuiz', value.toString());
	}
});

export default shuffleQuiz;
