import { encodeLengthPrepended, decodeLengthPrepended } from './compress';

describe("compress.js", () => {
	describe("length prepend", () => {
		it("should encode", () => {
			const str = "hello";
			expect(encodeLengthPrepended(str)).toBe("5:hello");
		});
		it("should encode empty", () => {
			const str = "";
			expect(encodeLengthPrepended(str)).toBe(":");
		});
		it("should decode at beginning", () => {
			const encoded = "5:hello";
			expect(decodeLengthPrepended(encoded, 0)).toEqual(["hello", 7, null]);
		});
		it("should decode in middle", () => {
			const encoded = "7:hahahaa5:hello";
			expect(decodeLengthPrepended(encoded, 9)).toEqual(["hello", 16, null]);
		});
		it("should decode error", () => {
			const encoded = "abc";
			let [str, index, error] = decodeLengthPrepended(encoded, 0);
			expect(error).not.toBeNull();
			[str, index, error] = decodeLengthPrepended("10:a", 0);
			expect(error).not.toBeNull();
			[str, index, error] = decodeLengthPrepended("a:a", 0);
			expect(error).not.toBeNull();
		});
	});
});