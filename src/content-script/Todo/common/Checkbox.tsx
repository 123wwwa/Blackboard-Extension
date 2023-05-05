import { css } from "@emotion/react";
import React, { InputHTMLAttributes } from "react";

const styles = {
	Checkbox: css({
        width: "16px",
        height: "16px",
        border: "1px solid #64748B",

        '&:focus': {
            outline: "none"
        }
    }),
};

function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
	return <input type="checkbox" css={styles.Checkbox} {...props} />;
}

export default Checkbox;
