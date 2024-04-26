import { Global } from "@emotion/react";
const GlobalStyle = () => (
	<Global
		styles={{
            "*": {
                boxSizing: "border-box",
				font: "400 .8em 'Open Sans', sans-serif",
				WebkitTextSizeAdjust: "100%",
				WebkitFontSmoothing: "antialiased",
				letterSpacing: "0.5px",
				fontSize: "100%",
				lineHeight: 1.75,
				wordWrap: "normal",
				fontWeight: "inherit",
				fontStyle: "inherit",
				fontFamily: "inherit",
            },
			'* p': {
				marginBlockStart: 'auto',
				marginBlockEnd: 'auto',
			},
			'* h1': {
				fontFamily: 'Pretendard-Regular',
			}
		}}
	/>
);

export default GlobalStyle;
