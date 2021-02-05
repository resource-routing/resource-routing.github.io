export function benchmarkTime() {
	return new Date().getTime();
}

export function benchmarkDelta(start) {
	return new Date().getTime() - start;
}