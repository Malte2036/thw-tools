declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext;
	}
}

export const playScanSound = () => {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	// Use sine wave for clean sound
	oscillator.type = 'sine';

	// Higher frequency for scanner-like sound
	oscillator.frequency.setValueAtTime(1800, audioContext.currentTime);

	// Very quick volume envelope
	gainNode.gain.setValueAtTime(0, audioContext.currentTime);
	gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01); // Quick fade in
	gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.08); // Quick fade out

	// Connect nodes
	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	// Play short sound
	oscillator.start();
	oscillator.stop(audioContext.currentTime + 0.08);
};
