import styled from "@emotion/styled";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "../common/Checkbox";

const AssignmentFooterWrapper = styled.footer`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: 10px 14px;
	font-size: 12px;
	font-weight: 700;
	font-family: inherit;

	.menus {
		display: flex;
		align-items: center;
		gap: 5px;

		.icon-button {
			display: flex;
			align-items: center;
			gap: 8px;
			font-family: inherit;
			font-weight: inherit;
			border-radius: 10px;
			padding: 6px 8px;
			cursor: pointer;
			transition: all 0.2s ease-in-out;
			&:hover {
				background-color: #d9d9d9;
			}

			svg {
				opacity: 0.4;
			}
		}
	}

	.select-text {
		color: #dc2626;
		margin-right: 12px;
	}
`;

type Props = {
	activeLectureId: string | null;
};

function TodoFooter({ activeLectureId }: Props) {
	return (
		<AssignmentFooterWrapper>
			<div className="menus">
				<Checkbox />
				<div className="icon-button">
					선택 항목 다운로드
					<FontAwesomeIcon icon={faDownload} />
				</div>
				<div className="icon-button">
					선택 항목 삭제
					<FontAwesomeIcon icon={faTrash} />
				</div>
			</div>
			{<div className="select-text">{1}개 항목 선택</div>}
		</AssignmentFooterWrapper>
	);
}

export default TodoFooter;
