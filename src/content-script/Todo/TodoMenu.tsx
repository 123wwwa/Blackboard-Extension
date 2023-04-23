import React from "react";
import IconButton from "./common/IconButton";
import ActionIcon from "./common/ActionIcon";
import styled from "@emotion/styled";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 20px;
`;

type Props = {
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function TodoMenu({ setShow } : Props): JSX.Element {
	return (
		<Container>
			<ActionIcon
				icon={chrome.runtime.getURL("public/icons/icon-refresh.png")}
				size={"15px"}
			/>
			<ActionIcon
				icon={chrome.runtime.getURL("public/icons/icon-settings.png")}
				size={"15px"}
			/>
			<ActionIcon
				icon={chrome.runtime.getURL("public/icons/icon-hamburger.png")}
				size={"16px"}
			/>
			<ActionIcon
				icon={chrome.runtime.getURL("public/icons/icon-x.png")}
				size={"12px"}
				onClick={() => setShow(show => !show)}
			/>
		</Container>
	);
}

export default TodoMenu;
