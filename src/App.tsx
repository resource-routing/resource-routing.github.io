import React from "react";
import "./App.css";
import SideNav from "sections/SideNav";
import Header from "sections/Header";
import Footer from "sections/Footer";
import Actions from "sections/Actions";
import Box from "components/Box";
import {
	getActionsBounds,
	getFooterBounds,
	getHeaderBounds,
	getResourcesBounds,
	getSideBounds,
	isShowingHelp,
} from "store/application/selectors";
import {
	setWindowWidth,
	doLayout,
	setInfo,
	markResourceDirtyAt,
} from "store/application/actions";
import {
	setRouteState,
} from "store/routing/actions";
import { setSettingState } from "store/setting/actions";
import { connect, ConnectedProps } from "react-redux";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import Alert from "dialog/Alert";
import Items from "sections/Items";
import { startResourceCalcClock, stopResourceCalcClock } from "data/resource";
import { loadfromLocalStorage } from "data/storage";
import { ReduxGlobalState } from "store/store";
import { startAutoSaveClock, stopAutoSaveClock } from "data/autosave";
import IODialog from "dialog/IODialog";
import Help from "sections/Help";

const mapStateToProps = (state: ReduxGlobalState) => ({
	headerBounds: getHeaderBounds(state),
	sideBounds: getSideBounds(state),
	actionsBounds: getActionsBounds(state),
	footerBounds: getFooterBounds(state),
	resourcesBounds: getResourcesBounds(state),
	showHelp: isShowingHelp(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	actions: bindActionCreators({
		setWindowWidth,
		doLayout,
		setRouteState,
		setInfo,
		setSettingState,
		markResourceDirtyAt,
	}, dispatch)
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;
type State = {
	alertContent?: React.ReactNode,
	alertActions: AlertOption[],
	showIOAlert: boolean,
}

export type AlertOption = {
	name: string,
	execute?: () => void
}
export type AppAction = {
	showAlert: (content?: React.ReactNode, actions?: AlertOption[]) => void,
	showIODialog: (show?: boolean) => void,
}

class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			alertContent: undefined,
			alertActions: [],
			showIOAlert: false,
		};
	}

	componentDidMount() {
		window.addEventListener("resize", this.redoLayout.bind(this));
		this.props.actions.doLayout();
		const [storedState, settings] = loadfromLocalStorage();
		if (storedState) {
			this.props.actions.setRouteState({ routeState: storedState });
			this.props.actions.markResourceDirtyAt({ globalIndex: 0 });
			this.props.actions.setInfo({ info: "Loaded from local storage" });
		} else {
			this.props.actions.setInfo({ info: "Failed to load from local storage. Loaded empty project." });
		}
		if (settings) {
			this.props.actions.setSettingState({ settingState: settings });
		}
		startResourceCalcClock();
		startAutoSaveClock();
	}

	redoLayout() {
		this.props.actions.setWindowWidth({ width: window.innerWidth });
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.redoLayout.bind(this));
		stopResourceCalcClock();
		stopAutoSaveClock();
	}

	showAlert(content: React.ReactNode = undefined, actions: AlertOption[] = [{ name: "OK" }]): void {
		this.setState({
			alertContent: content,
			alertActions: actions,
		});
	}

	render() {

		const appActions: AppAction = {
			showAlert: this.showAlert.bind(this),
			showIODialog: (show = true) => this.setState({ showIOAlert: show }),
		};

		const {
			headerBounds,
			sideBounds,
			actionsBounds,
			footerBounds,
			resourcesBounds,
			showHelp,
		} = this.props;
		return (
			<div style={{
				width: "100vw",
				height: "100vh"
			}}>
				<Box layout={headerBounds} borderClass="border overflow-hidden">
					<Header appActions={appActions} />
				</Box>
				<Box layout={sideBounds} borderClass="border">
					<SideNav appActions={appActions} />
				</Box>
				<Box layout={footerBounds} borderClass="border">
					<Footer />
				</Box>
				<Box layout={actionsBounds} borderClass="border overflow">
					{
						showHelp ? <Help /> : <Actions appActions={appActions} />
					}

				</Box>
				<Box layout={resourcesBounds} borderClass="border">
					<Items appActions={appActions} />
				</Box>

				<Alert content={this.state.alertContent} alertActions={this.state.alertActions} actions={{
					hideAlert: () => this.showAlert()
				}} />
				<Alert content={this.state.showIOAlert ? <IODialog appActions={appActions} /> : undefined} alertActions={[{ name: "Close" }]} actions={{
					hideAlert: () => this.setState({ showIOAlert: false })
				}} />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
