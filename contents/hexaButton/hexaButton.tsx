import React from "react";
import { createRoot } from "react-dom/client";
import { waitForElement } from "~shared/observer";
import GlobalStyle, { theme } from "~contents/hexaButton/global";
import HexaButton from "~components/hexaButton/HexaButton";
import type { PlasmoCSConfig } from "plasmo";
import { ThemeProvider } from "@emotion/react";
import ErrorBoundary from "~shared/ErrorBoundary";
export const config: PlasmoCSConfig = {
	matches: ["https://blackboard.unist.ac.kr/*"],
}
window.addEventListener("load", () => {
	const rootEl = document.createElement("div");
	rootEl.id = "root-container";
	document.body.prepend(rootEl);
	//const container = document.body as HTMLElement;
	const root: any = createRoot(rootEl!);

	root.render(
		<React.StrictMode>
			<ErrorBoundary>
				<ThemeProvider theme={theme}>
					<GlobalStyle />
					<HexaButton />
				</ThemeProvider>
			</ErrorBoundary>
		</React.StrictMode>
	);
});
