import ActionSummary from "./ActionSummary";
import ExpandButton from "./ExpandButton";
import { breakBranchAt, createSplitAt, deleteSplitAt, moveFirstSplitOfBranchToPreviousBranch, moveLastSplitOfBranchToNextBranch, setSplitPropertyAt, swapSplits } from "./util/data";
export default function Split({ name, branchIndex, index, expanded, isLast, isLastBranch, isFirstBranch, editing, splitActions, actions }) {
	const splitNode = (
		<tr key={`b_${branchIndex}_s_${index}_split`}>
			<td className="icon-button-width">{editing && <button className="icon-button" title="Break branch" onClick={() => {
				actions.doToBranches(breakBranchAt(branchIndex, index), "Branch broken - bang!");
			}}>{"/"}</button>}</td>
			<td className="icon-button-width">
				<ExpandButton expanded={expanded} setExpanded={(expanded) => {
					actions.doToBranches(setSplitPropertyAt(branchIndex, index, "expanded", expanded), `Split ${expanded ? "expanded" : "collapsed"}.`);
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
							actions.doToBranches(setSplitPropertyAt(branchIndex, index, "name", e.target.value));
						}} />
					: <u className="split-link" onClick={() => {
						actions.openSplit(branchIndex, index);
					}}>{name}</u>}
			</td>
			{editing && <td className="icon-button-width">
				<button className="icon-button" title="Copy" onClick={() => {
					actions.copySplit({
						name: name,
						expanded: expanded,
						actions: splitActions,
					});
				}}>c</button>
			</td>}

			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={index === 0 && isFirstBranch} title="Move up" onClick={() => {
					if (index === 0) {
						actions.doToBranches(moveFirstSplitOfBranchToPreviousBranch(branchIndex), "Split moved to the previous branch.");
					} else {
						actions.doToBranches(swapSplits(branchIndex, index, index - 1), "Split moved.", branchIndex, index - 1);
					}
				}}>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast && isLastBranch} onClick={() => {
						if (isLast) {
							actions.doToBranches(moveLastSplitOfBranchToNextBranch(branchIndex), "Split moved to the next branch.");
						} else {
							actions.doToBranches(swapSplits(branchIndex, index, index + 1), "Split moved.", branchIndex, index);
						}
					}}>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						actions.displayAlert(`Delete split "${name}"? This will also delete all actions in the split. (Not reversible)`, "Delete", () => {
							actions.hideAlert();
							actions.doToBranches(deleteSplitAt(branchIndex, index), "Split deleted.", branchIndex, index);
						}, "Cancel", () => {
							actions.hideAlert();
						});
					}}>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Split Below" onClick={() => {
						actions.doToBranches(createSplitAt(branchIndex, index + 1), "Split created.", branchIndex, index + 1);
					}}>*</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Paste Split Below" disabled={actions.splitClipboard === undefined} onClick={() => {
						actions.doToBranches(createSplitAt(branchIndex, index + 1, actions.splitClipboard), "Split pasted.", branchIndex, index + 1)
					}}>p</button>
				</td>
			}
		</tr>
	);
	if (!expanded) return splitNode;
	return [splitNode].concat(<ActionSummary actions={splitActions} b={branchIndex} s={index} />);
}