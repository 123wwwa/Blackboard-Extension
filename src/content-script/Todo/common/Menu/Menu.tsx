import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import Divider from "./Divider";
import Dropdown from "./Dropdown";
import MenuItem from "./MenuItem";
import Target from "./Target";

type Props = {
	children: ReactNode;
	show: boolean;
	onChange: React.Dispatch<React.SetStateAction<boolean>>;
};

interface MenuContext {
	targetRef: React.MutableRefObject<HTMLElement | null>;
	dropdownRef?: React.MutableRefObject<HTMLDivElement | null>;
	show: boolean;
	hideOnScroll?: boolean;
	onChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MenuContext = createContext<MenuContext>({
	targetRef: { current: null },
	dropdownRef: { current: null },
	show: false,
	hideOnScroll: true,
	onChange: () => {},
});

function Menu({ children, show, onChange }: Props) {
	const targetRef = useRef<HTMLElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				targetRef.current &&
				!dropdownRef.current.contains(e.target as Node) &&
				!targetRef.current.contains(e.target as Node)
			) {
				onChange(false);
			}
		};

		window.addEventListener("mousedown", handleClickOutside);
		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<MenuContext.Provider value={{ targetRef, dropdownRef, show, onChange }}>
			{children}
		</MenuContext.Provider>
	);
}

Menu.Target = Target;
Menu.Dropdown = Dropdown;
Menu.MenuItem = MenuItem;
Menu.Divider = Divider;
Menu.displayName = "Menu";

export default Menu;
