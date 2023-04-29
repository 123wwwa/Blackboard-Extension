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
    margin: 0;
    padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;
	transition: all 0.2s ease-in-out;
    cursor: pointer;

	&:hover {
		scale: 1.1;
		opacity: 0.7;
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

function ActionIcon({ icon, opacity="0.4", size = "16px", ...props }: Props) {
	const theme = useTheme();

	return (
		<Container size={size} {...props}>
			<FontAwesomeIcon icon={icon} opacity={opacity} fontSize={size} />
		</Container>
	);
}

export default ActionIcon;
