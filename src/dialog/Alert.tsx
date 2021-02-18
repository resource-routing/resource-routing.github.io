import Box from "components/Box";

import { calc } from "util/layout";
import { ReactNode } from "react";
import { AlertOption } from "App";
type Props = {
	content: ReactNode | undefined,
	alertActions: AlertOption[],
	actions: {
		hideAlert: () => void
	}
}

const Alert: React.FunctionComponent<Props> = ({ content, alertActions, actions }: Props) => {
	if (content === undefined) {
		return null;
	}
	const width = "50%";
	const height = "15rem";
	return (
		<div>
			<div
				style={{
					backgroundColor: "rgba(0,0,0,0.6)",
					position: "absolute",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh"
				}}
			/>
			<Box layout={{
				x: calc(calc("100vw", "-", width), "/", "2"),
				y: calc(calc("100vh", "-", height), "/", "2"),
				w: width,
				h: height,
			}}>
				<div style={{ backgroundColor: "white", height: "100%", boxSizing: "border-box", padding: "1rem" }}>
					{content}
					<div style={{
						position: "absolute",
						bottom: "1rem",
						right: "1rem"
					}}
					>
						{alertActions.map((alertAction, i) => <button
							key={i}
							className="margin-small"
							onClick={() => {
								if (alertAction.execute) {
									alertAction.execute();
								}
								actions.hideAlert();
							}}>
							{alertAction.name}
						</button>)}
					</div>
				</div>
			</Box>
		</div>
	);
};

export default Alert;