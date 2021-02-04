export default function ExpandButton({ expanded, setExpanded }) {
	return (
		<button className="icon-button" onClick={() => setExpanded(!expanded)}>{expanded ? "-" : "+"}</button>
	)
}