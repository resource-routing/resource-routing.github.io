import { connect } from "react-redux";
import {
	getActionCount,
	getActionName,
	isActionNote
} from "store/routing/selectors";
import { ReduxGlobalState } from "store/store";

type RenderProps = {
	isNote: boolean,
	name: string,
}


const ActionSummaryItemRender: React.FunctionComponent<RenderProps> = ({ isNote, name }: RenderProps) => {
	return <tr>
		<td />
		<td />
		<td className="icon-button-width" >&gt;</td>
		<td colSpan={8} >
			{isNote ? <em>{name}</em> : name}
		</td>
	</tr>;
};

type RenderExternalProps = {
	branchIndex: number,
	splitIndex: number,
	actionIndex: number,
}
const mapStateToPropsForActionSummaryItemRender = (state: ReduxGlobalState, ownProps: RenderExternalProps) => ({
	isNote: isActionNote(state, ownProps.branchIndex, ownProps.splitIndex, ownProps.actionIndex),
	name: getActionName(state, ownProps.branchIndex, ownProps.splitIndex, ownProps.actionIndex),
});


const ActionSummaryItem = connect(mapStateToPropsForActionSummaryItemRender)(ActionSummaryItemRender);

type Props = {
	length: number,
	branchIndex: number,
	splitIndex: number,
}

export const ActionSummary: React.FunctionComponent<Props> = ({ length, branchIndex, splitIndex }: Props) => {
	const nodes = [];
	for (let i = 0; i < length; i++) {
		nodes.push(<ActionSummaryItem
			key={i}
			branchIndex={branchIndex}
			splitIndex={splitIndex}
			actionIndex={i}
		/>);
	}
	return <>{nodes}</>;
};

type ExternalProps = {
	branchIndex: number,
	splitIndex: number,
}
const mapStateToProps = (state: ReduxGlobalState, ownProps: ExternalProps) => ({
	length: getActionCount(state, ownProps.branchIndex, ownProps.splitIndex),
});

export default connect(mapStateToProps)(ActionSummary);