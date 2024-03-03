/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import { useEffect, useState } from "react";
import "./App.css";
import { css } from "@emotion/react";

import TodoButton from "./TodoButton";
import TodoContainer from "./TodoContainer";



function Todo() {
	const [showMainArea, setShowMainArea] = useState<boolean>(false);
	const bodyWidth = document.body.clientWidth;
	const bodyHeight = document.body.clientHeight;

	const [position, setPosition] = useState({ x: bodyWidth - 100, y: bodyHeight - 60 });
	// get position from chrome storage and set to position state
	useEffect(() => {
		chrome.storage.local.get("position", (result) => {
			if (result.position) {
				if (result.position.x > window.innerWidth - 100 || result.position.y > window.innerHeight - 60) {
					setPosition({ x: window.innerWidth - 100, y: window.innerHeight - 60 });
				} else {
					setPosition(result.position);
				}
			}
		});
	}, []);
	const calcWrapperPosition = () => {
		const bodyWidth = window.innerWidth;
		const bodyHeight = window.innerHeight;
		if (position.x > bodyWidth / 2 && position.y > bodyHeight / 2) {
			return ({ x: position.x - 512, y: position.y - 431 });
		} else if (position.x > bodyWidth / 2 && position.y < bodyHeight / 2) {
			return ({ x: position.x - 512, y: position.y + 30 });
		} else if (position.x < bodyWidth / 2 && position.y > bodyHeight / 2) {
			return ({ x: position.x + 60, y: position.y - 431 });
		} else {
			return ({ x: position.x + 60, y: position.y + 30 });
		}
	}
	const styles = {
		Wrapper: css({
			position: "fixed",
			left: calcWrapperPosition().x,
			top: calcWrapperPosition().y,
			fontSize: "14px",
			fontFamily: "Pretendard-Regular",
			transition: "all 200ms",
			zIndex: 9999,
		}),
	};
	return (
		<div>
			<div
				css={[
					styles.Wrapper,
					css({
						opacity: showMainArea ? 1 : 0,
						transform: showMainArea ? "translateY(0)" : "translateY(10px)",
						pointerEvents: showMainArea ? "auto" : "none",
					}),
				]}
			>
				<TodoContainer show={showMainArea} setShow={setShowMainArea} position={position} />
			</div>
			<TodoButton setShow={setShowMainArea} position={position} setPosition={setPosition} />
		</div>
	);
}

export default Todo;
