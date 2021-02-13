import clsx from "clsx";
import { Bounds } from "util/layout";

type Props = {
	layout: Bounds,
	borderClass?: string,
}

const Box: React.FunctionComponent<Props> = ({ layout, children, borderClass }) => {
	return (
		<div className={clsx("component", borderClass)}
			style={{
				position: "absolute",
				top: layout.y,
				left: layout.x,
				width: layout.w,
				height: layout.h
			}}>
			{children}
		</div>
	);
};

export default Box;