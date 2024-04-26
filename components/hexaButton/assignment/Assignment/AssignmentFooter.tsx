import styled from "@emotion/styled";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import JSZip from "jszip";
import useLectureStore from "~shared/stores/lectureStore";
import useUserStateStore, { addCheckedFile, setCheckedFiles } from "~shared/stores/userStateStore";
import Checkbox from "~components/common/Checkbox";

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
	const {lectureObject} = useLectureStore(); 
	const {checkedFiles} = useUserStateStore();
	const [isAllChecked, setIsAllChecked] = useState(false);
	const checkAllFiles = () => {
		setIsAllChecked(!isAllChecked);
		if (!activeLectureId) return;
		if (!lectureObject[activeLectureId]) return;
		if (!isAllChecked) {
			lectureObject[activeLectureId!].assignment.forEach((assignment) => {
				if (assignment.Assignment_Files) {
					assignment.Assignment_Files.forEach((file) => {
						addCheckedFile(file);
					});
				}
				if (assignment.fileUrl) {
					assignment.fileUrl.forEach((file) => {
						addCheckedFile(file);
					});
				}
			});
		} else {
			setCheckedFiles([]);
		}
	};
	const urlToBlob = async (url: string) => {
		let blob = await fetch(url).then((r) => r.blob());
		return blob;
	};
	const downloadSelectedFiles = () => {
		const zip = new JSZip();
		checkedFiles.forEach((file) => {
			zip.file(file.fileName, urlToBlob(file.fileURL), { binary: true });
		});
		zip.generateAsync({ type: "blob" }).then((content) => {
			const a = document.createElement("a");
			const url = URL.createObjectURL(content);
			a.href = url;
			a.download = `${activeLectureId}.zip`;
			a.click();
			URL.revokeObjectURL(url);
		});
	};
	return (
		<AssignmentFooterWrapper>
			<div className="menus">
				<Checkbox onChange={checkAllFiles} checked={isAllChecked} />
				<div className="icon-button" onClick={downloadSelectedFiles}>
					선택 항목 다운로드
					<FontAwesomeIcon icon={faDownload} />
				</div>
				<div className="icon-button">
					선택 항목 삭제
					<FontAwesomeIcon icon={faTrash} />
				</div>
			</div>
			{<div className="select-text">{checkedFiles.length}개 항목 선택</div>}
		</AssignmentFooterWrapper>
	);
}

export default TodoFooter;
