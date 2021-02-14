import { connect } from "react-redux";
import {
	getInfo
} from "store/application/selectors";
import { ReduxGlobalState } from "store/store";

type Props = {
	text: string
}

export const Footer: React.FunctionComponent<Props> = ({ text }: Props) => {
	return (
		<span className="vertical-center">{text}</span>
	);
};

const mapStateToProps = (state: ReduxGlobalState) => ({
	text: getInfo(state),
});

export default connect(mapStateToProps)(Footer);