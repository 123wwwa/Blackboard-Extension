import { css } from "@emotion/react";
import { type ReactNode, useContext, useEffect, useRef, useState } from "react";
import Portal from "../Portal";
import { MenuContext } from "./Menu";

type Props = {
	children?: ReactNode;
};

const styles = {
	Dropdown: css({
		position: "absolute",
		zIndex: 10000,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		gap: "3px",
		padding: "10px",
		background: "#FFFFFF",
		borderRadius: "10px",
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
		opacity: 1,
		transform: "translateY(0)",
		transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out",
		pointerEvents: "auto",
	}),

	Hidden: css({
		opacity: 0,
		transform: "translateY(-10px)",
		pointerEvents: "none",
	}),
};

function Dropdown({ children }: Props) {
	const ctx = useContext(MenuContext);
	const [top, setTop] = useState(0);
	const [left, setLeft] = useState(0);

	useEffect(() => {
		const getPosition = () => {
			const rect = ctx.targetRef.current?.getBoundingClientRect();
			const dropdownRect = ctx.dropdownRef?.current?.getBoundingClientRect();
			if (!rect || !dropdownRect) return;
			const top = rect.bottom + window.scrollY;
			const left = rect.right - dropdownRect.width + window.scrollX;
			setTop(top);
			setLeft(left);
		};
		if (ctx.targetRef.current) {
			getPosition();
		}

		const hideMenu = () => {
			ctx.onChange(false);
		};

		window.addEventListener(
			"scroll",
			ctx.hideOnScroll ? hideMenu : getPosition
		);
		window.addEventListener("resize", getPosition);

		return () => {
			window.removeEventListener(
				"scroll",
				ctx.hideOnScroll ? hideMenu : getPosition
			);
			window.removeEventListener("resize", getPosition);
		};
	}, [ctx.show, ctx.hideOnScroll]);

	return (
		<Portal>
			<div
				css={[styles.Dropdown, !ctx.show && styles.Hidden, css({ top, left })]}
				ref={ctx.dropdownRef}
			>
				{children}
			</div>
		</Portal>
	);
}

export default Dropdown;
