import { connect } from "react-redux";
import ActionSummary from "./ActionSummary";
import ExpandButton from "./ExpandButton";
import { breakBranchAt, createSplitAt, deleteSplitAt, moveFirstSplitOfBranchToPreviousBranch, moveLastSplitOfBranchToNextBranch, setSplitPropertyAt, swapSplits } from "./util/data";
import { getBranchCount, getSplitCount, getSplitName, isSplitExpanded } from "./util/select";
export function Split({ branchIndex, splitIndex, name, expanded, isLast, isLastBranch, editing, actions }) {
	const isFirstBranch = branchIndex === 0;
	const displayName = name || "[Unnamed Split]";
	const splitNode = (
		<tr key={`b_${branchIndex}_s_${splitIndex}_split`}>
			<td className="icon-button-width">{editing && <button className="icon-button" title="Break branch" onClick={() => {
				//actions.doToBranches(breakBranchAt(branchIndex, index), "Branch broken - bang!");
			}} disabled>{"/"}</button>}</td>
			<td className="icon-button-width">
				<ExpandButton expanded={expanded} setExpanded={(expanded) => {
					//actions.doToBranches(setSplitPropertyAt(branchIndex, index, "expanded", expanded), `Split ${expanded ? "expanded" : "collapsed"}.`);
				}} />
			</td>
			<td colSpan="2">
				{editing ?
					<input
						className="full-width"
						placeholder="Split Name"
						type="text"
						value={name}
						onChange={(e) => {
							//actions.doToBranches(setSplitPropertyAt(branchIndex, index, "name", e.target.value));
						}} />
					: <u className="split-link" onClick={() => {
						//actions.openSplit(branchIndex, index);
					}} disabled>{displayName}</u>}
			</td>
			{editing && <td className="icon-button-width">
				<button className="icon-button" title="Copy" onClick={() => {
					//actions.copySplit({
					//	name: name,
					//	expanded: expanded,
					//	actions: splitActions,
					//});
				}} disabled>c</button>
			</td>}

			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={splitIndex === 0 && isFirstBranch} title="Move up" onClick={() => {
					//if (index === 0) {
					//	actions.doToBranches(moveFirstSplitOfBranchToPreviousBranch(branchIndex), "Split moved to the previous branch.");
					//} else {
					//	actions.doToBranches(swapSplits(branchIndex, index, index - 1), "Split moved.", branchIndex, index - 1);
					//}
				}} disabled>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast && isLastBranch} onClick={() => {
						//if (isLast) {
						//	actions.doToBranches(moveLastSplitOfBranchToNextBranch(branchIndex), "Split moved to the next branch.");
						//} else {
						//	actions.doToBranches(swapSplits(branchIndex, index, index + 1), "Split moved.", branchIndex, index);
						//}
					}} disabled>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						//actions.displayAlert(`Delete split "${name}"? This will also delete all actions in the split. (Not reversible)`, "Delete", () => {
						//	actions.hideAlert();
						//	actions.doToBranches(deleteSplitAt(branchIndex, index), "Split deleted.", branchIndex, index);
						//}, "Cancel", () => {
						//	actions.hideAlert();
						//});
					}} disabled>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Split Below" onClick={() => {
						//actions.doToBranches(createSplitAt(branchIndex, index + 1), "Split created.", branchIndex, index + 1);
						//setEditing(true);
					}} disabled>*</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Paste Split Below" disabled={actions.splitClipboard === undefined} onClick={() => {
						//actions.doToBranches(createSplitAt(branchIndex, index + 1, actions.splitClipboard), "Split pasted.", branchIndex, index + 1)
					}} disabled>p</button>
				</td>
			}
		</tr>
	);
	if (!expanded)
		return splitNode;
	return [splitNode].concat(<ActionSummary branchIndex={branchIndex} splitIndex={splitIndex} />);
};

const mapStateToProps = (state, ownProps) => ({
	name: getSplitName(state, ownProps.branchIndex, ownProps.splitIndex),
	expanded: isSplitExpanded(state, ownProps.branchIndex, ownProps.splitIndex),
	isLast: getSplitCount(state, ownProps.branchIndex) === ownProps.splitIndex - 1,
	isLastBranch: getBranchCount(state) === ownProps.branchIndex - 1

});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Split);