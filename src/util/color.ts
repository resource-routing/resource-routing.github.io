export function shouldMakeTextWhiteForBackground(color: string): boolean {
	//https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
	const [r, g, b] = htmlColorToRGB(color).map(linerize);
	const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	console.log(L);
	return L < 1.8;
}

function linerize(c: number): number {
	c = c / 255.0;
	if (c <= 0.03928) {
		c = c / 12.92;
	} else {
		c = ((c + 0.055) / 1.055) ^ 2.4;
	}
	return c;
}

function htmlColorToRGB(htmlColor: string): number[] {
	htmlColor = htmlColor.toLowerCase();
	if (htmlColor.startsWith("rgb(") && htmlColor.endsWith(")")) {
		const htmlrgb = htmlColor.replace("rgb(", "").replace(")", "").split(",").map(i => Number(i.trim())).map(i => Number.isNaN(i) ? 0 : i);
		return htmlrgb;
	}
	//https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
	if (!window.getComputedStyle) return [255, 255, 255];
	const div = document.getElementById("temp");
	if (div == null) {
		return [255, 255, 255];
	}
	div.style.color = "white";
	div.style.color = htmlColor;
	const color = window.getComputedStyle(div).color;
	console.log(color);
	if (!color) {
		return [255, 255, 255];
	}
	const rgb = color.replace("rgb(", "").replace(")", "").split(",").map(i => Number(i.trim()));
	if (rgb[0] === 0 && rgb[1] === 0 && rgb[2] === 0) {
		if (htmlColor !== "black") {
			return [255, 255, 255];
		}
	}
	return rgb;
}

export function isValidNonWhiteColor(color: string): boolean {
	const div = document.getElementById("temp");
	if (div == null) {
		return true;
	}
	div.style.color = "white";
	div.style.color = color;
	const computed = window.getComputedStyle(div).color;
	return computed !== "rgb(255, 255, 255)";
}

export function randomColor(): string {
	const hex = "0123456789abcdef";
	const r1 = hex[Math.floor(Math.random() * 16)];
	const r2 = hex[Math.floor(Math.random() * 4) * 4];
	const g1 = hex[Math.floor(Math.random() * 16)];
	const g2 = hex[Math.floor(Math.random() * 4) * 4];
	const b1 = hex[Math.floor(Math.random() * 16)];
	const b2 = hex[Math.floor(Math.random() * 4) * 4];
	return `#${r1}${r2}${g1}${g2}${b1}${b2}`;
}