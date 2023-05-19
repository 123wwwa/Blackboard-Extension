import { css } from "@emotion/react";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import {
	faBook,
	faGrip,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ActionIcon from "../common/ActionIcon";
import TextInput from "../common/TextInput";

const styles = {
	Wrapper: css({
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
		padding: "10px 14px",
		gap: "11px",
	}),

	Button: css({
		display: "flex",
		gap: "9px",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "14px",
		fontWeight: 400,
    cursor: "pointer",
    padding: "7px 14px",
    borderRadius: "10px",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },

		p: {
			opacity: 0.5,
		},
	}),

	Divider: css({
		width: "1px",
		height: "10px",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	}),
};

function AlarmFooter() {
	return (
		<div css={styles.Wrapper}>
			<div css={styles.Button}>
				<FontAwesomeIcon icon={faClock} opacity="0.5" />
				<p>날짜 선택</p>
			</div>
			<div css={styles.Divider} />
			<div css={styles.Button}>
				<FontAwesomeIcon icon={faBook} opacity="0.5" />
				<p>과목 선택</p>
			</div>
			<div css={styles.Divider} />
			<div css={styles.Button}>
				<FontAwesomeIcon icon={faGrip} opacity="0.5" />
				<p>타입 선택</p>
			</div>
		</div>
	);
}

export default AlarmFooter;
