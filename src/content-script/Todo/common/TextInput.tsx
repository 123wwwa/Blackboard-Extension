import React, { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import styled from "@emotion/styled";
import { css, Interpolation, Theme } from "@emotion/react";

const InputContainer = styled.input<{ icon?: ReactNode }>`
	border: 1px solid #e9e9e9;
	border-radius: 5px;
	padding: 4px 9px;
	font-size: 13px;
	font-weight: 400;
	${(props) => props.icon && "padding-Right: 10px;"}

	&:focus {
		outline: none;
	}

	&::placeholder {
		color: rgba(0, 0, 0, 0.4);
	}
`;

type Props = InputHTMLAttributes<HTMLInputElement> &
	React.ClassAttributes<HTMLInputElement> & {
		icon?: ReactNode;
		wrapperProps?: HTMLAttributes<HTMLDivElement> &
			React.ClassAttributes<HTMLDivElement>;
	};

function TextInput({ wrapperProps, ...props }: Props) {
	return (
		<div css={[css({ position: "relative" }), wrapperProps?.css]}>
			<InputContainer icon={props.icon} {...props} />
			{props.icon && (
				<div
					css={[
						css({
							position: "absolute",
							top: "50%",
							right: "4px",
							transform: "translateY(-50%)",
						}),
						props?.css,
					]}
				>
					{props.icon}
				</div>
			)}
		</div>
	);
}

export default TextInput;
