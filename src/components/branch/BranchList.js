import Branch from "./Branch";

export default function BranchList({ branches, editing, actions }) {
	if (!branches) return null;
	return (
		<table>
			<tbody>
				{branches.map((branch, i) => (
					<Branch
						name={branch.name}
						key={i}
						index={i}
						expanded={branch.expanded}
						editing={editing}
						actions={actions}
						isLast={i === branches.length - 1}
						splits={branch.splits}
					/>
				))}
				<tr>
					<td colSpan="3">
						<button onClick={() => actions.createBranchAt(branches.length)}>New Branch</button>
					</td>
				</tr>

			</tbody>

		</table>
	)
}