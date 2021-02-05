import ExpandButton from "./ExpandButton";
import SplitList from "./SplitList";

import { deleteBranchAt, setBranchPropertyAt, swapBranches, createBranchAt } from './util/data';

export default function Branch({ name, index, expanded, editing, actions, isLast, splits }) {

	const branchNode = (
		<tr key={"branch_content_" + index}>
			<td className="icon-button-width">
				<ExpandButton expanded={expanded} setExpanded={(expanded) => {
					actions.doToBranches(setBranchPropertyAt(index, "expanded", expanded), `Branch ${expanded ? "expanded" : "collapsed"}.`)
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
							actions.doToBranches(setBranchPropertyAt(index, "name", e.target.value))
						}} />
					: <strong>{name}</strong>}

			</td>
			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={index === 0} title="Move up" onClick={() => {
					actions.doToBranches(swapBranches(index, index - 1), "Branch moved.", index - 1);
				}}>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
						actions.doToBranches(swapBranches(index, index + 1), "Branch moved.", index);
					}}>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						actions.displayAlert(`Delete branch "${name}"? This will also delete all the splits in the branch. (Not reversible)`, "Delete", () => {
							actions.hideAlert();
							actions.doToBranches(deleteBranchAt(index), "Branch deleted.", index);
						}, "Cancel", () => {
							actions.hideAlert();
						});
					}}>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Branch Below" onClick={() => {
						actions.doToBranches(createBranchAt(index + 1), "Branch created.", index + 1);
					}}>*</button>
				</td>
			}
		</tr>
	);
	if (!expanded) {
		return branchNode;
	}
	return [branchNode].concat(<SplitList
		key={`branch_split_list_${index}`}
		branchIndex={index}
		splits={splits}
		isLastBranch={isLast}
		isFirstBranch={index === 0}
		editing={editing}
		actions={actions}
	/>)
}