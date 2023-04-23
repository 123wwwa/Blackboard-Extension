import React, { Dispatch, SetStateAction, useCallback } from "react";
import { css } from "@emotion/react";
type Props = {
	setShow: Dispatch<SetStateAction<boolean>>;
};

function TodoButton({ setShow }: Props) {
	const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
		setShow((show) => !show);
	}, []);
	const styles = {
		Wrapper: css({
			position: "fixed",
			right: "30px",
			bottom: "0px",
			fontSize: "16px",
			fontFamily: "Pretendard-Regular",
			zIndex: 10000
		}),
	};
	return (
		<button
			css={styles.Wrapper}
			onClick={() => {
				console.log("clicked");
				setShow((show) => !show);
			}}
		>
			TodoButton
		</button>
	);
}

export default TodoButton;
