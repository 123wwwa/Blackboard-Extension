import styled from '@emotion/styled';
import AssignmentCard from './AssignmentCard';
import { useEffect } from 'react';
import { AppDispatch } from 'features/store';
import { useDispatch, useSelector } from 'react-redux';
import { LectureList } from 'type';
import { getLectureList, selectLectureList } from '../../../features/lecture_reducer';

const AssignmentListWrapper = styled.article`
	width: 100%;
	height: 330px;
	overflow: scroll;
	overflow-x: hidden;
	padding: 5px 14px;
	display: flex;
	flex-direction: column;
	gap: 10px;
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

function AssignmentList() {
	const dispatch:AppDispatch = useDispatch();
	const lectureList:LectureList = useSelector(selectLectureList);
	useEffect(()=>{
		dispatch(getLectureList as any);
	},[dispatch])
	return (
		<AssignmentListWrapper>
			{Object.entries(lectureList).map(([key, value]) => {
				return <AssignmentCard name={value.name} count={value.assignment.length} color={value.color} />;
			})
			}
		</AssignmentListWrapper>
	)
}

export default AssignmentList