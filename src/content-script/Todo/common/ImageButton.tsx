import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ClassAttributes, HTMLAttributes } from "react";

type Props = {
	icon: string;
	title?: string;
	labelProps?: HTMLAttributes<HTMLParagraphElement> &
		ClassAttributes<HTMLParagraphElement>;
	imageProps?: HTMLAttributes<HTMLImageElement> &
		ClassAttributes<HTMLImageElement>;
} & React.HTMLAttributes<HTMLButtonElement> &
	ClassAttributes<HTMLButtonElement>;

export const styles = {
	Container: css({
		width: "105px",
		height: "30px",
		padding: "6px 12px",
		backgroundColor: "#ffffff",
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center",
		color: "#686868",
		border: "1px solid #e9e9e9",
		borderRadius: "10px",
		cursor: "pointer",

		"&:focus": {
			border: "1px solid #e9e9e9",
			outline: "none",
		},
	}),

	Label: css({
		fontSize: "0.75em",
		fontWeight: 600,
		marginLeft: "9px",
		whiteSpace: "nowrap",
	}),

	Image: css({
		width: "14px",
		height: "14px",
	}),
};

function ImageButton({ icon, title, imageProps, labelProps, ...props }: Props) {
	return (
		<button {...props} css={[styles.Container, props.css]}>
			<img
				src={chrome.runtime.getURL(icon)}
				{...imageProps}
				css={[styles.Image, imageProps?.css]}
			/>
			<p {...labelProps} css={[styles.Label, labelProps?.css]}>
				{title}
			</p>
		</button>
	);
}

export default ImageButton;
