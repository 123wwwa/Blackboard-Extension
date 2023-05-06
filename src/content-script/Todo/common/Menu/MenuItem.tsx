import { css } from "@emotion/react";
import { HTMLAttributes, ReactNode } from "react";

const styles = {
	MenuItem: css({
		width: "100%",
		borderRadius: "5px",
		fontSize: "14px",
		padding: "7px",
		transition: "all 200ms",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		gap: "7.5px",

		"&:hover": {
			background: "#E9E9E9",
		},
	}),

	RightIcon: css({
		marginLeft: "auto",
		paddingLeft: "20px",
	}),
};

type Props = {
	children: ReactNode;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
};

function MenuItem({
	children,
	leftIcon,
	rightIcon,
	...props
}: HTMLAttributes<HTMLDivElement> & Props) {
	return (
		<div css={styles.MenuItem} {...props}>
			{leftIcon}
			{children}
			{rightIcon && <div css={styles.RightIcon}>{rightIcon}</div>}
		</div>
	);
}

export default MenuItem;
