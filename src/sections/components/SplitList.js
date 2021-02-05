import Split from "./Split";
import { createSplitAt, mergeNextBranchWithCurrentBranch } from "./util/data";

export default function SplitList({ branchIndex, splits, isLastBranch, isFirstBranch, editing, actions }) {
	const splitNodes = splits.map((split, i) => (
		<Split
			key={`branch_${branchIndex}_split_${i}_`}
			name={split.name}
			branchIndex={branchIndex}
			index={i}
			expanded={split.expanded}
			isLast={i === splits.length - 1}
			isLastBranch={isLastBranch}
			isFirstBranch={isFirstBranch}
			editing={editing}
			actions={actions}
			splitActions={split.actions}
		/>
	));
	splitNodes.push(<tr key={`branch_${branchIndex}_split_actions`}>
		<td className="icon-button-width">{editing && <button className="icon-button" title="Merge branch" disabled={isLastBranch} onClick={() => {
			actions.doToBranches(mergeNextBranchWithCurrentBranch(branchIndex), "Branch merged - moosh!");
		}}>^</button>}</td>
		<td colSpan="4">
			<button onClick={() => {
				const len = splits.length;
				actions.doToBranches(createSplitAt(branchIndex, len), "Split created.", branchIndex, len)
			}}>New Split</button>
			<button className="space-left-small" disabled={actions.splitClipboard === undefined} onClick={() => {
				const len = splits.length;
				actions.doToBranches(createSplitAt(branchIndex, len, actions.splitClipboard), "Split pasted.", branchIndex, len)
			}}>Paste Split</button>
		</td>
	</tr>);
	return splitNodes;
}