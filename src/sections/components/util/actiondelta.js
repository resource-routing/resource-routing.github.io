export function deltaToString(deltas) {
	const array = [];
	for (const name in deltas) {
		array.push(itemToString(name, deltas[name]));
	}
	return array.join(", ");
}

export function renameItemInDelta(deltas, oldName, newName) {
	if (oldName in deltas) {
		deltas[newName] = deltas[oldName];
		delete deltas.oldName;
	}
	for (const name in deltas) {
		if (deltas[name].type.startsWith("ref")) {
			if (deltas[name].value === oldName) {
				deltas[name].value = newName;
			}
		}
	}
}

function itemToString(name, item) {
	const { type, value } = item;
	let op;
	switch (type) {
		case "add":
			if (value >= 0) {
				op = "+";
			} else {
				op = "-";
			}
			break;
		case "set":
		case "ref_set":
			op = "=";
			break;
		case "ref_add":
			op = "=";
			break;
		case "ref_sub":
			op = "-";
			break;
		default: op = "?"; break;
	}
	let quantity = value;
	if (type.startsWith("ref")) {
		quantity = `[${value}]`
	}
	return `[${name}]${op}${quantity}`;
}

export default function stringToDelta(str) {
	if (!str || !str.length) return [null, "Delta string empty"];
	if (!str.trim()) return [null, "Delta string empty"];

	const array = str.split(",").map(e => e.trim());
	const deltaObj = {};
	let errors = [];
	array.forEach(str => {
		const [item, itemError] = parseDeltaItem(str.trim());
		if (item !== null) {
			deltaObj[item.name] = {
				type: item.type,
				value: item.value,
			}
		} else {
			if (itemError !== null)
				errors.push(itemError);
		}


	});
	return errors.length > 0 ? [null, errors.join("; ")] : [deltaObj, null];
}

function parseDeltaItem(str) {
	//\[*?<name>](+|=|-)<quantity>
	if (!str || !str.length) return [null, null];//no item, skip
	if (!str.startsWith("[")) return [null, `Invalid: ${str}`];
	const nameEnd = str.indexOf("]");
	if (nameEnd < 0) return [null, `Item name bracket not closed: ${str}`];
	const name = str.substring(1, nameEnd);
	if (str.length <= nameEnd + 1) return [null, `Item [${name}] missing operator and quantity`];
	const op = str[nameEnd + 1];
	const value = str.substring(nameEnd + 2);

	if (value.startsWith("[")) {
		if (!value.endsWith("]")) return [null, `Item reference bracket not closed: ${value}`];
		const ref = value.substring(1, value.length - 1);
		let type;
		switch (op) {
			case "+": type = "ref_add"; break;
			case "-": type = "ref_sub"; break;
			case "=": type = "ref_set"; break;
			default: return [null, `Item [${name}]: unknown operator "${op}"`];
		}
		return [{
			name: name,
			type: type,
			value: ref,
		}, null]
	} else {
		let num = Number(value);
		if (!Number.isInteger(num)) return [null, `Item [${name}]: invalid quantity "${value}`];
		let type;
		switch (op) {
			case "+": type = "add"; break;
			case "-": type = "add"; num = -num; break;
			case "=": type = "set"; break;
			default: return [null, `Item [${name}]: unknown operator "${op}"`];
		}
		return [{
			name: name,
			type: type,
			value: num,
		}, null]
	}
}

