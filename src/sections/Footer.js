import { connect } from "react-redux";
import { getInfo } from "./components/util/select"

export function Footer({ text }) {
	return (
		<span className="vertical-center">{text}</span>
	)
}

const mapStateToProps = (state, ownProps) => ({
	text: getInfo(state),
});

export default connect(mapStateToProps)(Footer);