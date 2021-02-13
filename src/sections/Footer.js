import { connect } from "react-redux";
import {
	getInfo
} from "store/application/selectors";

export function Footer({ text }) {
	return (
		<span className="vertical-center">{text}</span>
	);
}

const mapStateToProps = (state) => ({
	text: getInfo(state),
});

export default connect(mapStateToProps)(Footer);