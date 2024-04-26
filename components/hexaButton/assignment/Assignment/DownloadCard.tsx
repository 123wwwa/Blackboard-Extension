import styled from "@emotion/styled";
import {
	faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {  useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Assignment, FileUrl } from "~shared/types/blackboardTypes";
import useUserStateStore, { addCheckedFile, removeCheckedFile } from "~shared/stores/userStateStore";
import Checkbox from "~components/common/Checkbox";
import Menu from "~components/common/Menu";


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

function DownloadCard({ item }: Props) {
	const [show, setShow] = useState(false);
	const [parentChecked, setParentChecked] = useState(false);
	const { checkedFiles } = useUserStateStore();
	const checkParent = (event:any) => {
		let checked = event.target.checked;
		if(checked){
			if(item?.Assignment_Files){
				item?.Assignment_Files.forEach((file) => {
					addCheckedFile(file); 
				});
			}
			if(item?.fileUrl){
				item?.fileUrl.forEach((file) => {
					addCheckedFile(file); 
				});
			}
		}else{
			if(item?.Assignment_Files){
				item?.Assignment_Files.forEach((file) => {
					removeCheckedFile(file); 
				});
			}
			if(item?.fileUrl){
				item?.fileUrl.forEach((file) => {
					removeCheckedFile(file); 
				});
			}
		}

	};
	const isParentChecked = () => {
		//console.log(item?.Assignment_Files)
		if(item?.Assignment_Files){
			for(let i = 0; i < item?.Assignment_Files.length; i++){
				if(!isChecked(item?.Assignment_Files[i]))
					return false;
			}
		}
		if(item?.fileUrl){
			for(let i = 0; i < item?.fileUrl.length; i++){
				if(!isChecked(item?.fileUrl[i]))
					return false;
			}
		}
		return true;
	}
	const isChecked = (file: FileUrl) =>{
		//console.log(checkedFiles);
		if(checkedFiles.find((checkedFile) => checkedFile.fileURL === file.fileURL)){
			return true;
		}
		else{
			return false;
		}
	}
	const checkChild = (event: any, file: FileUrl) => {
		if(event.target.checked){
			addCheckedFile(file);
		}else{
			removeCheckedFile(file);
		}
	}
	return (
		<Container color={"#E9E9E9"}>
			<div>
				<Checkbox onClick={checkParent} checked={isParentChecked()}/>
			</div>
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
								leftIcon={<Checkbox checked={isChecked(file)} onClick={(e)=>checkChild(e,file)} />}
								rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} onClick={() => window.open(file.fileURL, "_blank")}/>}
							>
								<p>{file.fileName}</p>
							</Menu.MenuItem>
						))}</>:<></>}
						<Menu.Divider />
						{item?.fileUrl?<>{item?.fileUrl.map((file) => (
							<Menu.MenuItem
								leftIcon={<Checkbox checked={isChecked(file)} onClick={(e)=>checkChild(e,file)} />}
								rightIcon={<FontAwesomeIcon icon={faDownload} opacity={0.4} onClick={() => window.open(file.fileURL, "_blank")}/>}
							>
								<p>{file.fileName}</p>
							</Menu.MenuItem>
						))}</>:<></>}
					</Menu.Dropdown>
				</Menu>
			</InnerContainer>
		</Container>
	);
}

export default DownloadCard;