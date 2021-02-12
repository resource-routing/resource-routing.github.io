import { connect } from "react-redux";
import { getActionCount, getActionName, isActionNote } from "./util/select";


function ActionSummaryItemRender({ isNote, name }) {
	return <tr >
		<td></td><td></td>
		<td className="icon-button-width">&gt;</td>
		<td>
			{isNote ? <em>{name}</em> : name}
		</td>
	</tr>
}
const mapStateToPropsForActionSummaryItemRender = (state, ownProps) => ({
	isNote: isActionNote(state, ownProps.branchIndex, ownProps.splitIndex, ownProps.actionIndex),
	name: getActionName(state, ownProps.branchIndex, ownProps.splitIndex, ownProps.actionIndex),
});

const ActionSummaryItem = connect(mapStateToPropsForActionSummaryItemRender)(ActionSummaryItemRender);

export function ActionSummary({ length, branchIndex, splitIndex }) {
	const nodes = [];
	for (let i = 0; i < length; i++) {
		nodes.push(<ActionSummaryItem
			key={`b_${branchIndex}_s_${splitIndex}_a_${i}_`}
			branchIndex={branchIndex}
			splitIndex={splitIndex}
			actionIndex={i}
		/>);
	}
	return nodes;
};

const mapStateToProps = (state, ownProps) => ({
	length: getActionCount(state, ownProps.branchIndex, ownProps.splitIndex),
});

export default connect(mapStateToProps)(ActionSummary);