import { Global } from "@emotion/react";
import emotionNormalize from "emotion-normalize";

const GlobalStyle = () => (
	<Global
		styles={{
			// ...emotionNormalize,
            "*": {
                boxSizing: "border-box",
            },
		}}
	/>
);

export default GlobalStyle;
