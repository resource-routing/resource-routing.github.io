import { connect } from "react-redux";
import ExpandButton from "../ExpandButton";
import SplitList from "../SplitList";
import {
	isBranchExpanded,
	getBranchName,
	getBranchCount
} from "store/routing/selectors";
import {
	createBranch,
	setBranchName,
	setBranchExpanded,
} from "store/routing/actions";
import { isEditingNav } from "store/application/selectors";
import { bindActionCreators } from "@reduxjs/toolkit";
// import { deleteBranchAt, setBranchPropertyAt, swapBranches, createBranchAt } from "../../data";

export function Branch({ index, name, expanded, editing, actions, isLast }) {
	const displayName = name || "[Unnamed Branch]";
	const branchNode = (
		<tr key={"branch_content_" + index}>
			<td className="icon-button-width">
				<ExpandButton expanded={expanded} setExpanded={(expanded) => {
					actions.setBranchExpanded({ branchIndex: index, expanded });
				}} />
			</td>
			<td colSpan="6">
				{editing ?
					<input
						className="full-width"
						placeholder="Branch Name"
						type="text"
						value={name}
						onChange={(e) => {
							actions.setBranchName({ branchIndex: index, name: e.target.value });
						}} />
					: <strong>{displayName}</strong>}

			</td>
			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={index === 0} title="Move up" onClick={() => {
					//actions.doToBranches(swapBranches(index, index - 1), "Branch moved.", index - 1);
				}} disabled>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
						//actions.doToBranches(swapBranches(index, index + 1), "Branch moved.", index);
					}} disabled>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						//actions.displayAlert(`Delete branch "${name}"? This will also delete all the splits in the branch. (Not reversible)`, "Delete", () => {
						//	actions.hideAlert();
						//	actions.doToBranches(deleteBranchAt(index), "Branch deleted.", index);
						//}, "Cancel", () => {
						//	actions.hideAlert();
						//});
					}} disabled>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Branch Below" onClick={() => {
						actions.createBranch({ branchIndex: index + 1 });
					}}>*</button>
				</td>
			}
		</tr>
	);
	//if (!expanded) {
	return branchNode;
	//}
	// return [branchNode].concat(<SplitList
	// 	key={`branch_split_list_${index}`}
	// 	branchIndex={index}
	// 	editing={editing}
	// 	actions={actions}
	// />);
}

const mapStateToProps = (state, ownProps) => ({
	name: getBranchName(state, ownProps.index),
	expanded: isBranchExpanded(state, ownProps.index),
	isLast: getBranchCount(state) === ownProps.index - 1,
	editing: isEditingNav(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	actions: bindActionCreators({
		createBranch,
		setBranchName,
		setBranchExpanded,
	}, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Branch);