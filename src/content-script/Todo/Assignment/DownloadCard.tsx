import styled from "@emotion/styled";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Assignment } from "type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "../common/Popover";
import Checkbox from "../common/Checkbox";

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
// const deleteTodoItem = (item: Todo) => {
// 	const dispatch = useDispatch();
// 	return deleteTodo(dispatch as any)(item);
// };
function DownloadCard({ item }: Props) {
	const [show, setShow] = useState(false);

	return (
		<Container color={"#E9E9E9"}>
			<Checkbox />
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
