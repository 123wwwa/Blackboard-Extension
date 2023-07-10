import styled from "@emotion/styled";
import {
	faBook,
	faClock,
	faDownload,
	faGripHorizontal,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Assignment, FileUrl, Todo } from "type";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "../common/Popover";
import Checkbox from "../common/Checkbox";
import Menu from "../common/Menu";
import { addCheckedFile, removeCheckedFile, selectCheckedFiles } from "../../../features/lecture_reducer";

const DownloadWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 25px;
	padding: 4px 2px;
	border-radius: 5px;
	filter: brightness(100%);
	transition: all 0.2s ease-in-out;
	cursor: pointer;

	&:hover {
		background-color: rgba(28, 25, 23, 0.35);
	}
`;

const Container = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	gap: 16px;
	padding: 15px 20px;
	background-color: ${(props) => props.color || "#F5F5F5"};
	border-radius: 10px;
	filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.04));
	transition: all 0.2s ease-in-out;
`;

const InnerContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	gap: 4px;
	flex-basis: 60%;
`;

const Title = styled.h1`
	font-size: 24px;
	font-weight: 700;
	font-size: 14px;
	max-width: 300px;
	margin: 0;
`;

const DueDateContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const DateText = styled.p`
	font-size: 12px;
	font-weight: 400;
`;

export const DueDateText = styled(DateText)`
	color: #dc2626;
`;
type Props = {
	item?: Assignment;
};

function DownloadCard({ item }: Props) {
	const [show, setShow] = useState(false);
	const [parentChecked, setParentChecked] = useState(false);
	const checkedFiles = useSelector(selectCheckedFiles);
	const dispatch = useDispatch();
	const checkParent = (event: any) => {
		let checked = isParentChecked();
		console.log(event);
		if (checked) {
			if (item?.Assignment_Files) {
				item?.Assignment_Files.forEach((file) => {
					dispatch(addCheckedFile(file));
				});
			}
			if (item?.fileUrl) {
				item?.fileUrl.forEach((file) => {
					dispatch(addCheckedFile(file));
				});
			}
		} else {
			if (item?.Assignment_Files) {
				item?.Assignment_Files.forEach((file) => {
					dispatch(removeCheckedFile(file));
				});
			}
			if (item?.fileUrl) {
				item?.fileUrl.forEach((file) => {
					dispatch(removeCheckedFile(file));
				});
			}
		}

	};
	let isParentChecked = () => {
		if (item?.Assignment_Files) {
			for (let i = 0; i < item?.Assignment_Files.length; i++) {
				if (!isChecked(item?.Assignment_Files[i]))
					return false;
			}
		}
		if (item?.fileUrl) {
			for (let i = 0; i < item?.fileUrl.length; i++) {
				if (!isChecked(item?.fileUrl[i]))
					return false;
			}
		}
		return true;
	}
	let isChecked = (file: FileUrl) => {
		if (checkedFiles.find((checkedFile) => checkedFile.fileURL === file.fileURL)) {
			return true;
		}
		else {
			return false;
		}
	}
	const checkChild = (event: any, file: FileUrl) => {
		if (event.target.checked) {
			dispatch(addCheckedFile(file));
		} else {
			dispatch(removeCheckedFile(file));
		}
	}
	return (
		<Container color={"#E9E9E9"}>
			<Checkbox onChange={checkParent} checked={isParentChecked()} />
			<InnerContainer>
				<Content onClick={() => window.open(item?.url, "_blank")}>
					<Title>{item?.Name}</Title>
					<DateText>{item?.Due_Date}</DateText>
				</Content>
				<Popover open={show} onOpenChange={setShow}>
					<Popover.Target>
						<DownloadWrapper>
							<DueDateText>과제 파일</DueDateText>
							<FontAwesomeIcon icon={faDownload} opacity={0.4} />
						</DownloadWrapper>
					</Popover.Target>
					<Popover.Content hideWhenDetached>
						{item?.Assignment_Files ? (
							<>
								{item?.Assignment_Files.map((file) => (
									<Popover.Item
										leftIcon={
											<div
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
											>
												<Checkbox />
											</div>
										}
										rightIcon={
											<FontAwesomeIcon icon={faDownload} opacity={0.4} />
										}
										onClick={() => window.open(file.fileURL, "_blank")}
									>
										<p>{file.fileName}</p>
									</Popover.Item>
								))}
							</>
						) : (
							<></>
						)}
						<Popover.Divider />
						{item?.fileUrl ? (
							<>
								{item?.fileUrl.map((file) => (
									<Popover.Item
										leftIcon={
											<div
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
												}}
											>
												<Checkbox />
											</div>
										}
										rightIcon={
											<FontAwesomeIcon icon={faDownload} opacity={0.4} />
										}
										onClick={() => window.open(file.fileURL, "_blank")}
									>
										<p>{file.fileName}</p>
									</Popover.Item>
								))}
							</>
						) : (
							<></>
						)}
					</Popover.Content>
				</Popover>
			</InnerContainer>
		</Container>
	);
}

export default DownloadCard;
