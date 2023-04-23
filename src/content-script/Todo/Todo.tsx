/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import { useLocalStorage } from "usehooks-ts";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { css } from "@emotion/react";
import { Assignment, FileUrl } from "../../type";
import TodoButton from "./TodoButton";
import TodoContainer from "./TodoContainer";

function Todo() {
	const [showMainArea, setShowMainArea] = useState<boolean>(false);

	return (
		<div
			css={css({
				zIndex: 10,
				position: "fixed",
				right: "30px",
				bottom: "30px",
				fontSize: "16px",
				fontFamily: "Pretendard-Regular",
			})}
		>
			<TodoContainer show={showMainArea} setShow={setShowMainArea} />
			<TodoButton setShow={setShowMainArea} />
		</div>
	);
}

export default Todo;
