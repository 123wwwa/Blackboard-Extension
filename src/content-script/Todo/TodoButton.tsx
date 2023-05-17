/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
type Props = {
	setShow: Dispatch<SetStateAction<boolean>>;
	position: { x: number; y: number };
	setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
};
function TodoButton({ setShow, position, setPosition }: Props) {
	useEffect(()=>{
		// save position to chrome storage on tab close or refresh
		window.addEventListener("resize", (e) => {
			if(position.x > window.innerWidth - 100 || position.y > window.innerWidth - 60){
				setPosition({ x: window.innerWidth - 100, y: window.innerWidth - 60 });
			}
		});
	},[])
	const [hexaLogo, setHexaLogo] = React.useState(chrome.runtime.getURL("public/assets/HeXA_logo.png"));
	const [isDragging, setIsDragging] = useState(false);
	const startMousePos = useRef({ x: position.x, y: position.y });
	const startPos = useRef({ x: position.x, y: position.y });
	const handleMouseMove = (event: MouseEvent) => {
		const delta = {
			x: event.clientX - startMousePos.current.x,
			y: event.clientY - startMousePos.current.y,
		}
		if (isDragging) {
			setPosition({
				x: startPos.current.x + delta.x,
				y: startPos.current.y + delta.y,
			});
			
		}
	};
	const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
		setIsDragging(true);
	};

	const handleMouseUp = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
		// save position to chrome storage
		chrome.storage.local.set({ position: { x: position.x, y: position.y } });
		setIsDragging(false);
	};
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (isDragging) return;
		e.preventDefault();
		e.stopPropagation();
		setShow((show) => !show);
	};
	const styles = {
		Wrapper: css({
			position: "fixed",
			left: position.x,
			top: position.y,
			fontSize: "16px",
			fontFamily: "Pretendard-Regular",
			zIndex: 10000,
			width: "50px",
			height: "50px",
		}),
		Img: css({
			width: "100%",
			height: "100%",
		})
	};
	return (
		<button
			css={styles.Wrapper}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
		>
			<img src={hexaLogo}
				css={styles.Img} />
		</button>
	);
}

export default TodoButton;
