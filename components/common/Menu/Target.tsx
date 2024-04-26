import {
	cloneElement,
	type ReactElement,
	useCallback,
	useContext,
} from "react";
import { MenuContext } from "./Menu";

type Props = {
	children: ReactElement;
};

function Target({ children }: Props) {
	const ctx = useContext(MenuContext);
	const ref = useCallback((node: HTMLElement) => {
		if (node) {
			ctx.targetRef.current = node;
		}
	}, []);

	return cloneElement(children, {
		ref,
		...(ctx.onChange ? { onClick: () => ctx.onChange((show) => !show) } : {}),
	});
}

export default Target;
