import { connect } from "react-redux";
import Split from "./Split";
import { createSplitAt, mergeNextBranchWithCurrentBranch } from "./util/data";
import { getBranchCount, getSplitCount } from "./util/select";

export function SplitList({ branchIndex, length, isLastBranch, editing, actions }) {
	const splitNodes = [];
	for (let i = 0; i < length; i++) {
		splitNodes.push(<Split
			key={`branch_${branchIndex}_split_${i}_`}
			branchIndex={branchIndex}
			splitIndex={i}
			editing={editing}
			actions={actions}
		/>)
	}
	splitNodes.push(<tr key={`branch_${branchIndex}_split_actions`}>
		<td className="icon-button-width">{editing && <button className="icon-button" title="Merge branch" disabled={isLastBranch} onClick={() => {
			//actions.doToBranches(mergeNextBranchWithCurrentBranch(branchIndex), "Branch merged - moosh!");
		}} disabled>^</button>}</td>
		<td colSpan="4">
			<button onClick={() => {
				//const len = splits.length;
				//actions.doToBranches(createSplitAt(branchIndex, len), "Split created.", branchIndex, len)
				//setEditing(true);
			}} disabled>New Split</button>
			<button className="space-left-small" disabled={actions.splitClipboard === undefined} onClick={() => {
				//const len = splits.length;
				//actions.doToBranches(createSplitAt(branchIndex, len, actions.splitClipboard), "Split pasted.", branchIndex, len)
			}} disabled>Paste Split</button>
		</td>
	</tr>);
	return splitNodes;
};

const mapStateToProps = (state, ownProps) => ({
	length: getSplitCount(state, ownProps.branchIndex),
	isLastBranch: getBranchCount(state) === ownProps.branchIndex - 1,
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(SplitList);