import styled from "@emotion/styled";

type Props = {
	icon: string;
	title?: string;
	onClick?: () => void;
};

const ImageButtonContainer = styled.button`
	width: 105px;
	height: 30px;
	padding: 6px 12px;
	background-color: #FFFFFF;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	color: #686868;
	border: 1px solid #E9E9E9;
	border-radius: 10px;
	cursor: pointer;

	&:focus {
		border: 1px solid #E9E9E9;
		outline: none;
	}

	p {
		font-size: 0.75em;
		font-weight: 600;
		margin-left: 9px;
	}

	img {
		width: 14px;
		height: 14px;
	}
`;

function ImageButton({ icon, title, onClick }: Props) {
	return (
		<ImageButtonContainer onClick={onClick}>
			<img src={icon} />
			<p>{title}</p>
		</ImageButtonContainer>
	);
}

export default ImageButton;
