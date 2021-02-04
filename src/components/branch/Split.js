import ExpandButton from "../ExpandButton";
export default function Split({ name, branchIndex, index, expanded, isLast, isLastBranch, isFirstBranch, editing, actions }) {
	return (
		<tr>
			<td className="icon-button-width">{editing && <button className="icon-button" title="Break branch" disabled>{"/"}</button>}</td>
			<td className="icon-button-width">
				<ExpandButton expanded={expanded} setExpanded={(expanded) => actions.setSplitExpandedAt(branchIndex, index, expanded)} />
			</td>
			<td colSpan="2">
				{editing ?
					<input
						className="full-width"
						placeholder="Split Name"
						type="text"
						value={name}
						onChange={(e) => actions.setSplitNameAt(branchIndex, index, e.target.value)} />
					: <u>{name}</u>}
			</td>
			{editing && <td className="icon-button-width">
				<button className="icon-button" title="Copy" disabled>c</button>
			</td>}

			{editing && <td className="icon-button-width">
				<button className="icon-button" disabled={index === 0 && isFirstBranch} title="Move up" >&uarr;</button>
			</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Move down" disabled={isLast && isLastBranch}>&darr;</button>
				</td>}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Delete" onClick={() => {
						actions.displayAlert(`Delete split ${name}? This will also delete all actions in the split. (Not reversible)`, "Delete", () => {
							actions.hideAlert();
							actions.deleteSplitAt(branchIndex, index);
						}, "Cancel", () => {
							actions.hideAlert();
						});
					}}>X</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="New Split Below" onClick={() => actions.createSplitAt(branchIndex, index + 1)}>*</button>
				</td>
			}
			{editing &&
				<td className="icon-button-width">
					<button className="icon-button" title="Paste Split Below" disabled onClick={() => actions.createSplitAt(branchIndex, index + 1)}>p</button>
				</td>
			}
		</tr>
	)
}