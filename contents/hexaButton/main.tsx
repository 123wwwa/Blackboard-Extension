import React from "react";
import { createRoot } from "react-dom/client";
import { waitForElement } from "~shared/observer";
import GlobalStyle, { theme } from "./global";
import HexaButton from "~components/hexaButton/HexaButton";
import type { PlasmoCSConfig } from "plasmo";
import { ThemeProvider } from "@emotion/react";
export const config: PlasmoCSConfig = {
    matches: ["https://blackboard.unist.ac.kr/*"],
    run_at: "document_start",
}
waitForElement("body").then(() => {
	console.log("body loaded");
	const rootEl = document.createElement("div");
	rootEl.id = "root-container";
	document.body.prepend(rootEl);
	//const container = document.body as HTMLElement;
	const root: any = createRoot(rootEl!);
	

	root.render(
		<React.StrictMode>
			
			<ThemeProvider theme={theme}>
					<GlobalStyle />
					<HexaButton/>
			</ThemeProvider>
		</React.StrictMode>
	);
});
