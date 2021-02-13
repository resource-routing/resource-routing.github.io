import { connect } from "react-redux";
import { getActiveAction, getActiveSplitActionCount, getActiveSplitActionDeltaError, getActiveSplitActionDeltas, getActiveSplitActionDeltaString, getActiveSplitActionName, getItemColor, isActiveSplitActionExpanded } from "./util/select";



function DeltaItemRender({ name, type, value, color }) {
	const displayName = name;
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
		value = `[${value}]`;
	}
	return (
		<span><span style={{ backgroundColor: color || "" }}>[{displayName}]</span><span>{op}{value}</span></span>
	);
}

const mapStateToPropsForDeltaItemRender = (state, ownProps) => ({
	color: getItemColor(state, ownProps.name),
});

const DeltaItem = connect(mapStateToPropsForDeltaItemRender)(DeltaItemRender);

export function DeltaList({ deltas, deltaError }) {
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
	);
}

const mapStateToProps = (state, ownProps) => ({
	deltaError: getActiveSplitActionDeltaError(state, ownProps.actionIndex),
	deltas: getActiveSplitActionDeltas(state, ownProps.actionIndex),
});

export default connect(mapStateToProps)(DeltaList);