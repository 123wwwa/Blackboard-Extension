import { type ButtonHTMLAttributes, forwardRef, useRef } from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconProp } from "@fortawesome/fontawesome-svg-core";
import useMergedRef from "~features/hooks/useMergedRef";


type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	opacity?: string;
	icon: IconProp;
	size?: string;
};

export const ActionIconContainer = styled.button<{ size: string }>`
	width: ${(props) => props.size};
	height: ${(props) => props.size};
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
		background-color: #e9e9e9;
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

const ActionIcon = forwardRef<HTMLButtonElement, Props>(function ActionIcon(
	{ icon, opacity = "0.4", size = "28px", ...props }: Props,
	ref
) {
	const innerRef = useRef<HTMLButtonElement>(null);
	const mergedRef = useMergedRef([innerRef, ref]);
	return (
		<ActionIconContainer size={size} {...props} ref={mergedRef}>
			<FontAwesomeIcon
				icon={icon}
				opacity={opacity}
				fontSize={`calc(${size} - 12px)`}
			/>
		</ActionIconContainer>
	);
});

export default ActionIcon;
