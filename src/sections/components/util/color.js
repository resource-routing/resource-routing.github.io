export function shouldMakeTextWhiteForBackground(color) {
	//https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color

	const [r, g, b] = htmlColorToRGB(color).map(linerize);
	const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
	return L < 0.22;
}

function linerize(c) {
	c = c / 255.0;
	if (c <= 0.03928) {
		c = c / 12.92;
	} else {
		c = ((c + 0.055) / 1.055) ^ 2.4;
	}
	return c;
}

function htmlColorToRGB(htmlColor) {
	htmlColor = htmlColor.toLowerCase();
	if (htmlColor.startsWith("rgb(") && htmlColor.endsWith(")")) {
		const htmlrgb = htmlColor.replace("rgb(", "").replace(")", "").split(",").map(i => Number(i.trim())).map(i => Number.isNaN(i) ? 0 : i);
		return htmlrgb;
	}
	//https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes
	if (!window.getComputedStyle) return [255, 255, 255];
	const div = document.getElementById("temp");
	div.style.color = htmlColor;
	const color = window.getComputedStyle(div).color;

	const rgb = color.replace("rgb(", "").replace(")", "").split(",").map(i => Number(i.trim()));
	if (rgb[0] === 0 && rgb[1] === 0 && rgb[2] === 0) {
		if (htmlColor !== "black") {
			return [255, 255, 255];
		}
	}
	return rgb;


}