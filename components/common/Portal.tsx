import { type ReactNode } from "react";
import ReactDOM from "react-dom";

type Props = {
    children: ReactNode;
}

const Portal = ({ children } : Props) => {
	if (!document?.body) {
		return null;
	}
	return ReactDOM.createPortal(children, document.body);
};

export default Portal;
