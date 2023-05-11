import styled from "@emotion/styled";
import {
	faBook,
	faClock,
	faDownload,
	faGripHorizontal,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Assignment, Todo } from "type";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Checkbox from "../common/Checkbox";
import Menu from "../common/Menu";

const DownloadWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 25px;
	padding: 4px 2px;
	border-radius: 5px;
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
// const deleteTodoItem = (item: Todo) => {
// 	const dispatch = useDispatch();
// 	return deleteTodo(dispatch as any)(item);
// };
function DownloadCard({ item }: Props) {
	const [show, setShow] = useState(false);
	console.log(item);
	return (
		<Container color={"#E9E9E9"}>
			<Checkbox />
			<InnerContainer>
				<Content onClick={()=> window.open(item?.url,"_blank")}>
					<Title>{item?.Name}</Title>
					<DateText>{item?.Due_Date}</DateText>
				</Content>

				<Menu show={show} onChange={setShow}>
					<Menu.Target>
						<DownloadWrapper>
							<DueDateText>과제 파일</DueDateText>
							<FontAwesomeIcon icon={faDownload} opacity={0.4} />
						</DownloadWrapper>
					</Menu.Target>
					<Menu.Dropdown>
						{item?.Assignment_Files?<>{item?.Assignment_Files.map((file) => (
							<Menu.MenuItem
								leftIcon={<Checkbox />}
								rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} />}
								onClick={() => window.open(file.fileURL, "_blank")}
							>
								<p>{file.fileName}</p>
							</Menu.MenuItem>
						))}</>:<></>}
						<Menu.Divider />
						{item?.fileUrl?<>{item?.fileUrl.map((file) => (
							<Menu.MenuItem
								leftIcon={<Checkbox />}
								rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} />}
								onClick={() => window.open(file.fileURL, "_blank")}
							>
								<p>{file.fileName}</p>
							</Menu.MenuItem>
						))}</>:<></>}
						{/* <Menu.MenuItem
							leftIcon={<Checkbox />}
							rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} />}
						>
							<p>input.txt</p>
						</Menu.MenuItem>
						<Menu.MenuItem
							leftIcon={<Checkbox />}
							rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} />}
						>
							<p>output.txt</p>
						</Menu.MenuItem>
						<Menu.MenuItem
							leftIcon={<Checkbox />}
							rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} />}
						>
							<p>assignment1.pdf</p>
						</Menu.MenuItem> */}
						{/* <Menu.Divider /> */}
						{/* <Menu.MenuItem
							leftIcon={<Checkbox />}
							rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} />}
						>
							<p>attempt1.pdf</p>
						</Menu.MenuItem> */}
					</Menu.Dropdown>
				</Menu>
			</InnerContainer>
		</Container>
	);
}

export default DownloadCard;
