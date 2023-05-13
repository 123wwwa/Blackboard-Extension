import React, { Dispatch, SetStateAction, useCallback } from "react";
import { css } from "@emotion/react";
type Props = {
	setShow: Dispatch<SetStateAction<boolean>>;
};

function TodoButton({ setShow }: Props) {
	const [hexaLogo, setHexaLogo] = React.useState(chrome.runtime.getURL("public/assets/HeXA_logo.png"));
	const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
		setShow((show) => !show);
	}, []);
	const styles = {
		Wrapper: css({
			position: "fixed",
			right: "30px",
			bottom: "10px",
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
			onClick={() => {
				setShow((show) => !show);
			}}
		>
			<img src={hexaLogo} 
			css={styles.Img}/>
		</button>
	);
}

export default TodoButton;
