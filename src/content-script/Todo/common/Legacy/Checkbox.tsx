import { css } from "@emotion/react";
import { InputHTMLAttributes, RefObject, useEffect, useRef } from "react";

const styles = {
	Checkbox: css({
		width: "16px",
		height: "16px",
		border: "1px solid #64748B",

		"&:focus": {
			outline: "none",
		},
	}),
};


// https://dirask.com/posts/React-three-state-checkbox-with-indeterminate-property-1yNvvD

type Props = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "value"
> & {
	value?: boolean | null;
	onChange?: (checked: boolean | null) => void;
};

const updateInput = (
	ref: RefObject<HTMLInputElement>,
	checked: boolean | null
) => {
	const input = ref.current;
	if (input) {
		input.checked = !!checked;
		input.indeterminate = checked === null;
	}
};

function Checkbox({ value = false, onChange = () => {}, ...props }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const checkedRef = useRef<boolean | null>(value);

	useEffect(() => {
		checkedRef.current = value;
		updateInput(inputRef, value);
	}, [value]);

	const handleChange = () => {
		switch (checkedRef.current) {
			case true:
				checkedRef.current = false;
				break;
			case false:
				checkedRef.current = true;
				break;
			default: // null
				checkedRef.current = true;
				break;
		}
		updateInput(inputRef, checkedRef.current);
		if (onChange) {
			onChange(checkedRef.current);
		}
	};

	return (
		<input
			{...props}
			type="checkbox"
			css={styles.Checkbox}
			onChange={handleChange}
			ref={inputRef}
		/>
	);
}

export default Checkbox;
