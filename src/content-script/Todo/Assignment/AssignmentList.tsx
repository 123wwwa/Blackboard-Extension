import styled from "@emotion/styled";
import AssignmentCard from "./AssignmentCard";
import { useEffect, useState } from "react";
import { AppDispatch } from "features/store";
import { useDispatch, useSelector } from "react-redux";
import { LectureList } from "type";
import {
	getLectureList,
	selectLectureList,
} from "../../../features/lecture_reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DownloadCard from "./DownloadCard";
import AssignmentFooter from "./AssignmentFooter";

const ListContainer = styled.article`
	display: flex;
	flex-direction: column;
	gap: 10px;
	overflow: scroll;
	overflow-x: hidden;
	&::-webkit-slider-thumb {
		background: #6c757d;
		border-radius: 8px;
	}
	&::-webkit-scrollbar {
		width: 7px;
		height: 10px;
		background-color: white;
		border-radius: 8px;
	}
`;

const RootContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 5px 14px;
	width: 100%;
	height: 330px;

	& > header {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		margin-bottom: 20px;
		margin-left: 4px;
		border-radius: 10px;
		padding: 8px;
		width: fit-content;
		cursor: pointer;

		&:hover {
			background-color: #e9e9e9;
		}
	}
`;

type Props = {
	activeLectureId: string | null;
	setActiveLectureId: React.Dispatch<React.SetStateAction<string | null>>;
};

function AssignmentList({ activeLectureId, setActiveLectureId }: Props) {
	const dispatch: AppDispatch = useDispatch();
	const lectureList: LectureList = useSelector(selectLectureList);
	useEffect(() => {
		dispatch(getLectureList as any);
	}, [dispatch]);
	return (
		<RootContainer>
			{activeLectureId && (
				<header onClick={() => setActiveLectureId(null)}>
					<FontAwesomeIcon icon={faArrowLeft} />
					{lectureList[activeLectureId].name}
				</header>
			)}
			<ListContainer>
				{!activeLectureId ? (
					Object.entries(lectureList).map(([key, value]) => {
						return (
							<AssignmentCard
								key={key}
								name={value.name}
								count={value.assignment.length}
								color={value.color}
								onSelect={() => setActiveLectureId(key)}
							/>
						);
					})
				) : (
					// : lectureList[activeLectureId].assignment.map((item) => {
					// 		return <DownloadCard item={item} />;
					//   })
					<>
						{lectureList[activeLectureId].assignment ? <>
						{lectureList[activeLectureId].assignment.map((item) => {
							return <DownloadCard item={item} />;
						})}
						</> : <></>}
					</>
				)}
			</ListContainer>
		</RootContainer>
	);
}

export default AssignmentList;
