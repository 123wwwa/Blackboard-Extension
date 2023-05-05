import { Global } from "@emotion/react";
import emotionNormalize from "emotion-normalize";

const GlobalStyle = () => (
	<Global
		styles={{
            "*": {
                boxSizing: "border-box",
				fontFamily: "Pretendard-Regular",
            },
		}}
	/>
);

export default GlobalStyle;
