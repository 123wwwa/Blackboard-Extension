import { css, keyframes } from "@emotion/react";
import { faCheck, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RedixCheckbox from "@radix-ui/react-checkbox";
import { useState } from "react";

const fadeIn = keyframes({
    from: { backgroundColor: "white" },
    to: { backgroundColor: "#426acf" },
});

const fadeOut = keyframes({
    from: { backgroundColor: "#426acf" },
    to: { backgroundColor: "white" },
});

const styles = {
	Checkbox: css({
		width: "16px",
		height: "16px",
		border: "1px solid #64748B",
		borderRadius: "2px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        backgroundColor: "white",

		"&:focus": {
			outline: "none",
		},

		"&[data-state='checked']": {
			backgroundColor: "#426acf",
            borderColor: "#426acf",
		},
		"&[data-state='indeterminate']": {
			backgroundColor: "#426acf",
            borderColor: "#426acf",
		},
	}),
};

function Checkbox(props: RedixCheckbox.CheckboxProps) {
	const [checked, setChecked] = useState<
		RedixCheckbox.CheckboxProps["checked"]
	>(props.checked);

	return (
		<RedixCheckbox.Root
			css={[styles.Checkbox, props.css]}
			{...props}
			onCheckedChange={(checked) => {
				setChecked(checked);
				if (props.onCheckedChange) props.onCheckedChange(checked);
			}}
		>
			<RedixCheckbox.Indicator>
				{checked === "indeterminate" && (
					<FontAwesomeIcon icon={faMinus} color="white" size="sm" />
				)}
				{checked === true && (
					<FontAwesomeIcon icon={faCheck} color="white" size="sm" />
				)}
			</RedixCheckbox.Indicator>
		</RedixCheckbox.Root>
	);
}

export default Checkbox;
