import { Global } from "@emotion/react";
import emotionNormalize from "emotion-normalize";

const GlobalStyle = () => (
	<Global
		styles={{
            "*": {
                boxSizing: "border-box",
            },
		}}
	/>
);

export default GlobalStyle;
