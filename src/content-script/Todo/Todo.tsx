/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { useState } from "react";
import "./App.css";
import { css } from "@emotion/react";

import TodoButton from "./TodoButton";
import TodoContainer from "./TodoContainer";

const styles = {
	Wrapper: css({
		position: "fixed",
		right: "30px",
		bottom: "60px",
		fontSize: "16px",
		fontFamily: "Pretendard-Regular",
		transition: "all 200ms",
		zIndex: 9999,
	}),
};

function Todo() {
	const [showMainArea, setShowMainArea] = useState<boolean>(false);

	return (
		<div>
			<div
				css={[
					styles.Wrapper,
					css({
						opacity: showMainArea ? 1 : 0,
						transform: showMainArea ? "translateY(0)" : "translateY(-10px)",
						pointerEvents: showMainArea ? "auto" : "none",
					}),
				]}
			>
				<TodoContainer show={showMainArea} setShow={setShowMainArea} />
			</div>
			<TodoButton setShow={setShowMainArea} />
		</div>
	);
}

export default Todo;
