import Branch from "./Branch";

import { createBranchAt } from './util/data';

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
				<tr key="new_branch_button">
					<td colSpan="5">
						<button onClick={() => {
							const len = branches.length;
							actions.doToBranches(createBranchAt(len), "Branch created.", len);
						}}>New Branch</button>
					</td>
				</tr>

			</tbody>

		</table>
	)
}