import styled from '@emotion/styled';
import AssignmentCard from './AssignmentCard';

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
  return (
    <AssignmentListWrapper>
        <AssignmentCard name="System Programming" count={3} color="#E5E5E5" />
        <AssignmentCard name="Advanced Programming" count={2} color="#FECACA" />
        <AssignmentCard name="Discrete Mathematics" count={1} color="#FDE68A" />
        <AssignmentCard name="Differential Equations" count={3} color="#A5F3FC" />
    </AssignmentListWrapper>
  )
}

export default AssignmentList