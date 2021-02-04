import ExpandButton from "../ExpandButton";
import SplitList from "./SplitList";

export default function Branch({ name, index, expanded, editing, actions, isLast, splits }) {

	const branchNode = (
		<tr>
			<td className="icon-button-width">
				<ExpandButton expanded={expanded} setExpanded={(expanded) => actions.setBranchExpandedAt(index, expanded)} />
			</td>
			<td colSpan="6">
				{editing ?
					<input
						className="full-width"
						placeholder="Branch Name"
						type="text"
						value={name}
						onChange={(e) => actions.setBranchNameAt(index, e.target.value)} />
					: <strong>{name}</strong>}

			</td>
			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={index === 0} title="Move up" onClick={() => actions.swapBranchesAt(index, index - 1)}>&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast} onClick={() => actions.swapBranchesAt(index, index + 1)}>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						actions.displayAlert(`Delete branch ${name}? This will also delete all the splits in the branch. (Not reversible)`, "Delete", () => {
							actions.hideAlert();
							actions.deleteBranchAt(index);
						}, "Cancel", () => {
							actions.hideAlert();
						});
					}}>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Branch Below" onClick={() => actions.createBranchAt(index + 1)}>*</button>
				</td>
			}
		</tr>
	);
	if (!expanded) {
		return branchNode;
	}
	return [branchNode].concat(<SplitList
		branchIndex={index}
		splits={splits}
		isLastBranch={isLast}
		isFirstBranch={index === 0}
		editing={editing}
		actions={actions}
	/>)
}