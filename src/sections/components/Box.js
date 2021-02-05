import clsx from 'clsx';
export default function Box({ layout, children, borderClass }) {
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
}