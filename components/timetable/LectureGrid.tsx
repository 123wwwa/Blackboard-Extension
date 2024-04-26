import styled from '@emotion/styled'


const LectureGrid = styled.div<{ color?: string, width?:string, height:string }>`
    border: 1px solid #ccc; 
    box-sizing: border-box;
    background-color: ${props => props.color};
    width: ${props => props.width};
    height: ${props => props.height};
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;    
`;
export default LectureGrid;