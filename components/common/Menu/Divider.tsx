import { css } from "@emotion/react";

const styles = {
	Divider: css({
		margin: "4px 0",

		"&::after": {
			content: "''",
			height: "1px",
			position: "absolute",
			left: 0,
			right: 0,
			backgroundColor: "#DEDEDE",
		},
	}),
};

function Divider() {
	return <div css={styles.Divider} />;
}

export default Divider;
