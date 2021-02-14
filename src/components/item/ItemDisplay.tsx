import { shouldMakeTextWhiteForBackground } from "util/color";
import { ItemDelta } from "data/item";
import { ReduxGlobalState } from "store/store";
import { getItemColorByIndex, getItemNameByIndex } from "store/routing/selectors";
import { connect } from "react-redux";

type Props = {
	name: string,
	color: string,
	delta?: ItemDelta,
}

function deltaString(delta: ItemDelta): string {
	const { value, change } = delta;
	return `${value} (${change >= 0 ? "+" : "-"}${change})`;
}

const ItemDisplay: React.FunctionComponent<Props> = ({ name, color, delta }: Props) => {
	const displayName = name || "[Unnamed Item]";
	return <td style={{ backgroundColor: color, color: shouldMakeTextWhiteForBackground(color) ? "white" : "" }}>
		<span className="item-span" >{displayName}</span>
		<span className="item-span" >{(delta && deltaString(delta)) || ""}</span>
	</td>;
}

type ExternalProps = {
	index: number,
	delta?: ItemDelta,
}

const mapStateToProps = (state: ReduxGlobalState, { index }: ExternalProps) => ({
	name: getItemNameByIndex(state, index),
	color: getItemColorByIndex(state, index),
})

export default connect(mapStateToProps)(ItemDisplay);