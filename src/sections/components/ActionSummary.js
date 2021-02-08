export default function ActionSummary({ actions, b, s }) {
	return actions.map((action, i) => (
		<tr key={`b_${b}_s_${s}_a_${i}_`}>
			<td></td><td></td>
			<td className="icon-button-width">&gt;</td>
			<td>
				{!action.deltaString ? <em>{action.name}</em> : action.name}
			</td>
		</tr>
	));
}