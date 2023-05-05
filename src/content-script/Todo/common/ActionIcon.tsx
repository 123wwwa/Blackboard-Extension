import React, { ButtonHTMLAttributes } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "@emotion/react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	opacity?: string;
	icon: IconProp;
	size?: string;
};

const Container = styled.button<{ size: string }>`
	width: ${props => props.size};
	height: ${props => props.size};
    border: none;
    outline: none;
    background-color: transparent;
	border-radius: 10px;
    margin: 0;
    padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	transition: all 0.2s ease-in-out;
    cursor: pointer;

	&:hover {
		background-color: #E9E9E9
	}

	&:focus {
		border: none;
		outline: none;
	}

	&:active {
		border: none;
		outline: none;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

function ActionIcon({ icon, opacity="0.4", size = "28px", ...props }: Props) {
	const theme = useTheme();

	return (
		<Container size={size} {...props}>
			<FontAwesomeIcon icon={icon} opacity={opacity} fontSize={`calc(${size} - 12px)`} />
		</Container>
	);
}

export default ActionIcon;
