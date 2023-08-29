import styled from "@emotion/styled";
type Props  = {
    prompt: string;
}
const styles = {
    GPTButton : styled.button`
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 10px;
        background-color: #ffffff;
        color: #686868;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        &:focus {
            outline: none;
        }
    `
}
const GPTButton = ({prompt}: Props) => {
    const handleOnClick = () => {
        alert(prompt);
    }
    return (
        <>
            <button id="gpt-button" onClick={handleOnClick} css={styles.GPTButton}>
            ask GPT
            </button>
        </>
    );
}
export default GPTButton;