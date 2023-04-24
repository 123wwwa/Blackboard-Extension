import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { faPalette, faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import ActionIcon from "./common/ActionIcon";
import DatePicker from "./common/DatePicker";
import TextInput from "./common/TextInput";

type Props = {
	color: string;
	setColor: React.Dispatch<React.SetStateAction<string>>;
};

const TodoFooterWrapper = styled.footer`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 10px 14px;

	.menus {
		display: flex;
		align-items: center;
		gap: 5px;
	}
`;

function TodoFooter({ color, setColor }: Props) {
	const [showColorPicker, setShowColorPicker] = useState(false);

	return (
		<TodoFooterWrapper>
			<div className="menus">
				{showColorPicker && (
					<div css={css({ position: "absolute", zIndex: 10 })}>
						<div
							css={css({
								position: "fixed",
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
							})}
							onClick={() => setShowColorPicker(false)}
						></div>
						<SketchPicker
							color={color}
							onChange={(color) => setColor(color.hex)}
						/>
					</div>
				)}
				<ActionIcon
					icon={faPalette}
					onClick={() => setShowColorPicker((show) => !show)}
				/>
				<TextInput placeholder="새 일정 이름 입력" />
				<DatePicker />
			</div>
			<ActionIcon icon={faPlus} />
		</TodoFooterWrapper>
	);
}

export default TodoFooter;
