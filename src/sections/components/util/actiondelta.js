export default function stringToDelta(str) {
	if (!str || !str.length) return null;
	if (!str.trim()) return null;

	const array = str.split(",").map(e => e.trim());
	const deltaObj = {};
	let error = false;
	array.forEach(str => {
		if (!error) {
			const item = parseDeltaItem(str.trim());
			if (item !== null) {
				deltaObj[item.name] = {
					type: item.type,
					value: item.value,
					create: item.create,
				}
			} else {
				error = true;
			}
		}

	});
	return error ? null : deltaObj;
}

function parseDeltaItem(str) {
	//\[*?<name>](+|=|-)<quantity>
	if (!str || !str.length) return null;
	if (!str.startsWith("[")) return null;
	const nameEnd = str.indexOf("]");
	if (nameEnd < 0) return null;
	const name = str.substring(1, nameEnd);
	if (str.length <= nameEnd + 1) return null;
	const op = str[nameEnd + 1];
	const value = str.substring(nameEnd + 2);

	let realName = name;
	let create = false;
	if (name.startsWith("*")) {
		realName = name.substring(1);
		create = true;
	}
	if (value.startsWith("[")) {
		if (!value.endsWith("]")) return null;
		const ref = value.substring(1, value.length - 1);
		let type;
		switch (op) {
			case "+": type = "ref_add"; break;
			case "-": type = "ref_sub"; break;
			case "=": type = "ref_set"; break;
			default: return null;
		}
		return {
			name: realName,
			type: type,
			value: ref,
			create: create,
		}
	} else {
		let num = Number(value);
		if (!Number.isInteger(num)) return null;
		let type;
		switch (op) {
			case "+": type = "add"; break;
			case "-": type = "add"; num = -num; break;
			case "=": type = "set"; break;
			default: return null;
		}
		return {
			name: realName,
			type: type,
			value: num,
			create: create,
		}
	}
}

