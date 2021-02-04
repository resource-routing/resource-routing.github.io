import Split from "./Split";

export default function SplitList({ branchIndex, splits, isLastBranch, isFirstBranch, editing, actions }) {
	const splitNodes = splits.map((split, i) => (
		<Split
			key={`${branchIndex}-${i}`}
			name={split.name}
			branchIndex={branchIndex}
			index={i}
			expanded={split.expanded}
			isLast={i == splits.length - 1}
			isLastBranch={isLastBranch}
			isFirstBranch={isFirstBranch}
			editing={editing}
			actions={actions}
		/>
	));
	splitNodes.push(<tr>
		<td className="icon-button-width">{editing && <button className="icon-button" disabled title="Merge branch">^</button>}</td>
		<td colSpan="4">
			<button onClick={() => actions.createSplitAt(branchIndex, splits.length)}>New Split</button>
			<button className="space-left-small" disabled>Paste Split</button>
		</td>
	</tr>);
	return splitNodes;
}