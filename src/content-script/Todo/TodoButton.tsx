import React, { Dispatch, SetStateAction, useCallback } from "react";

type Props = {
	setShow: Dispatch<SetStateAction<boolean>>;
};

function TodoButton({ setShow }: Props) {
	const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
		setShow((show) => !show);
	}, []);

	return (
		<button
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
