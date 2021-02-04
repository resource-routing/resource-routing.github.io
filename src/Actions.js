import ExpandButton from "./components/ExpandButton";

export default function Action({ resourcesCollapsed, setResourcesCollapsed }) {
	return (
		<div >
			<div>
				<ExpandButton
					expanded={!resourcesCollapsed} setExpanded={(expanded) => setResourcesCollapsed(!expanded)} />
				<strong> Split Detail</strong>
			</div>
			[WIP]
		</div>
	)
}