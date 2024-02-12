export const midiToFreq = (n: number) => Math.pow(2, (n - 69) / 12) * 440;
