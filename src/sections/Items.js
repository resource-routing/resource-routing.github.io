import ItemList from "./components/ItemList";
import Box from "./components/Box";
import { useState } from "react";
import ExpandButton from "./components/ExpandButton";

export default function Items({ layout, resourcesCollapsed, resourceInfo, items, actions, actionResources, lastActionResources }) {

	const [editing, setEditing] = useState(false);
	const [filter, setFilter] = useState("");

	const collapsed = resourcesCollapsed;
	const buttonSection = (
		<span>
			<button className="space-left-small" onClick={() => setEditing(!editing)}>{editing ? "Finish" : "Edit"}</button>
			<input
				className="space-left-small"
				type="text"
				value={filter}
				placeholder="Filter (use , to separate)"
				onChange={(e) => setFilter(e.target.value)}
			/>
			<button className="space-left-small icon-button" title="Clear" onClick={() => setFilter("")}>X</button>
		</span>
	);

	let delta = undefined;
	if (actionResources && lastActionResources) {
		delta = {};
		for (const key in actionResources) {
			delta[key] = {
				value: actionResources[key],
				change: actionResources[key] - ((key in lastActionResources) ? lastActionResources[key] : 0)
			};
		}
		items = items.filter(item => {
			return item.name in actionResources;
		});
	}

	const itemSection =
		<ItemList
			items={items}
			editing={editing}
			actions={actions}
			setEditing={setEditing}
			filter={filter}
			delta={delta}
		/>
		;
	return (
		<div >
			<Box layout={layout.main} borderClass="overflow-auto">

				<div>
					{!collapsed && itemSection}
				</div>

			</Box>
			<Box layout={layout.header} >
				<div>

					<strong>Resources</strong>
					{!collapsed && buttonSection}

				</div>
				{!collapsed &&
					<div>
						resourceInfo
					</div>}
				{!resourcesCollapsed && <hr />}
			</Box>



		</div>
	);
}