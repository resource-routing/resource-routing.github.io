

function parseColor(name) {
	if (!name) return ["", "auto"];
	const i = name.indexOf("#");
	if (i >= 0) {
		const color = name.substring(i + 1);
		return [name.substring(0, i), color];
	}
	return [name, "auto"];
}

function DeltaItem({ name, type, value, create }) {
	const [displayName, color] = parseColor(name);
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
	if (type.startsWith("ref")) {
		value = `[${value}]`
	}
	return (
		<span style={{ backgroundColor: color }}>[{displayName}]{op}{value}</span>
	);
}

export default function DeltaList({ deltas, deltaError }) {
	const deltaItems = [];
	for (const name in deltas) {
		deltaItems.push(
			<DeltaItem name={name} key={name} {...deltas[name]} />
		);
	}
	return (
		<tr key="delta">
			<td className="icon-button-width align-right">
				&#916;
			</td>
			<td colSpan="6">
				{deltaError !== undefined ?
					<span className="deltastr-error">{deltaError}</span>
					:
					deltaItems
				}

			</td>

		</tr>
	)
}