import Box from "./components/Box";

import { calc } from "./components/util/layout";
export default function Alert({ enabled, text, okText, cancelText, onOk, onCancel }) {
	if (!enabled) {
		return null;
	}

	const width = "50%";
	const height = "12rem";
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
				x: calc(calc("100vw", "-", width), "/", 2),
				y: calc(calc("100vh", "-", height), "/", 2),
				w: width,
				h: height,
			}}>
				<div style={{ backgroundColor: "white", height: "100%", boxSizing: "border-box", padding: "1rem" }}>
					{text}
					<div style={{
						position: "absolute",
						bottom: "1rem",
						right: "1rem"
					}}
					>
						<button onClick={() => onOk()}>{okText}</button>
						{onCancel !== undefined && <button className="margin-small" onClick={() => onCancel()}>{cancelText}</button>}
					</div>
				</div>
			</Box>
		</div>
	)
}