import { createItem, setItemPropertyAt } from './util/data';
import { shouldMakeTextWhiteForBackground } from "./util/color";

function ItemDisplay({ name, color, delta }) {
	const displayName = name || "[Unnamed Item]";
	return <td style={{ backgroundColor: color, color: shouldMakeTextWhiteForBackground(color) ? "white" : "" }}>
		<span className="item-span" >{displayName}</span>
		<span className="item-span" >{(delta && deltaString(delta, name)) || ""}</span>
	</td>;
}

function ItemEdit({ name, color, index, isLast, actions, setEditing }) {

	return (
		<tr key={"item_" + index}>
			<td className="icon-button-width">
				{index + 1}.
			</td>
			<td>

				<input
					className="full-width"
					placeholder="Item Name"
					type="text"
					value={name}
					onChange={(e) => {
						actions.doToItems(setItemPropertyAt(index, "name", e.target.value))
					}} />

			</td>
			<td>
				<input
					className="full-width"
					placeholder="Color (e.g, red, #FF0000, rgb(255, 0, 0)"
					type="text"
					value={color}
					onChange={(e) => {
						actions.doToItems(setItemPropertyAt(index, "color", e.target.value))
					}} />
			</td>
			<td className="icon-button-width">
				<button className="icon-button" disabled={index === 0} title="Move up" onClick={() => {
					//actions.doToBranches(swapBranches(index, index - 1), "Branch moved.", index - 1);
				}}>&uarr;</button>
			</td>

			<td className="icon-button-width">
				<button className="icon-button" title="Move down" disabled={isLast} onClick={() => {
					//actions.doToBranches(swapBranches(index, index + 1), "Branch moved.", index);
				}}>&darr;</button>
			</td>

			<td className="icon-button-width">
				<button className="icon-button" title="Delete" onClick={() => {
					actions.displayAlert(`Delete branch "${name}"? This will also delete all the splits in the branch. (Not reversible)`, "Delete", () => {
						actions.hideAlert();
						//actions.doToBranches(deleteBranchAt(index), "Branch deleted.", index);
					}, "Cancel", () => {
						actions.hideAlert();
					});
				}}>X</button>
			</td>


			<td className="icon-button-width">
				<button className="icon-button" title="New Branch Below" onClick={() => {
					actions.doToItems(createItem(index + 1), "Item created.");
					setEditing(true);
				}}>*</button>
			</td>

		</tr>
	);
}

function deltaString(delta, name) {
	const { value, change } = delta[name];
	return `${value} (${change >= 0 ? "+" : ""}${change})`
}

export default function ItemList({ items, delta, editing, actions, setEditing, filter }) {
	const filterObj = [];
	if (filter) {
		filter.split(",").forEach(f => {
			const name = f.trim();
			filterObj.push(name);
		})
	}

	const filteredItems = !filter ? items : items.filter(item => {
		if (!item.name) return true;
		for (let i = 0; i < filterObj.length; i++) {
			if (item.name.includes(filterObj[i])) return true;
		}
		return false;
	});
	let itemSection;

	if (editing) {
		itemSection = filteredItems.map((item, i) => {
			return <ItemEdit
				name={item.name}
				color={item.color}
				key={i}
				index={i}
				actions={actions}
				setEditing={setEditing}
				isLast={i === items.length - 1}
			/>
		})
	} else {
		itemSection = [];
		for (let i = 0; i < filteredItems.length; i += 4) {

			itemSection.push(
				<tr key={i}>
					{<ItemDisplay name={filteredItems[i].name} color={filteredItems[i].color} delta={delta} />}
					{filteredItems[i + 1] && <ItemDisplay name={filteredItems[i + 1].name} color={filteredItems[i + 1].color} delta={delta} />}
					{filteredItems[i + 2] && <ItemDisplay name={filteredItems[i + 2].name} color={filteredItems[i + 2].color} delta={delta} />}
					{filteredItems[i + 3] && <ItemDisplay name={filteredItems[i + 3].name} color={filteredItems[i + 3].color} delta={delta} />}
				</tr>
			)
		}
	}
	return (
		<table>
			<tbody>
				{itemSection}
			</tbody>
			<tr key="new_item_button">
				<td colSpan="5">
					<button onClick={() => {
						const len = items.length;
						actions.doToItems(createItem(len), "Item created.");
						setEditing(true);
					}}>New Item</button>
				</td>
			</tr>
		</table>
	);
}