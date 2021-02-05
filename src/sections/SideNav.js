import React from "react";
import Box from "./components/Box";
import BranchList from "./components/BranchList";
import { collapseAll } from "./components/util/data";

export default class SideNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editing: false,

		}
	}

	setEditEnabled(enabled) {
		this.setState({ editing: enabled });
	}
	render() {
		let buttonSection = (
			<span>
				<button className="space-left-small" onClick={() => this.setEditEnabled(!this.state.editing)}>{this.state.editing ? "Finish" : "Edit"}</button>
				<button className="space-left-small" onClick={() => this.props.actions.doToBranches(collapseAll(), "Collapsed all.")} >Collapse All</button>
			</span>
		);
		let branchSection =
			<BranchList
				branches={this.props.branches}
				editing={this.state.editing}
				actions={this.props.actions} />;
		return (
			<div>
				<Box layout={this.props.layout.header} >
					<div>
						<button onClick={() => this.props.actions.setSideCollapsed(!this.props.sideCollapsed)}>{this.props.sideCollapsed ? ">>" : "<<"}</button>
						{!this.props.sideCollapsed && buttonSection}

					</div>
					<hr />
				</Box>
				<Box layout={this.props.layout.main} borderClass="overflow-auto">
					<div>
						{!this.props.sideCollapsed && branchSection}
					</div>
				</Box>


			</div>
		);
	}
}