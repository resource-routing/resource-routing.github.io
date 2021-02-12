export type millisecond = number;

export function benchmarkTime(): millisecond {
	return new Date().getTime();
}

export function benchmarkDelta(start: millisecond): millisecond {
	return new Date().getTime() - start;
}