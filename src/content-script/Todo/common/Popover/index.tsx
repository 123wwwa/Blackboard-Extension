import * as RadixPopover from "@radix-ui/react-popover";
import { css, keyframes } from "@emotion/react";
import { HTMLAttributes, ReactNode } from "react";

const slideUpAndFade = keyframes({
	"0%": { opacity: 0, transform: "translateY(2px)" },
	"100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
	"0%": { opacity: 0, transform: "translateX(-2px)" },
	"100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
	"0%": { opacity: 0, transform: "translateY(-2px)" },
	"100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
	"0%": { opacity: 0, transform: "translateX(2px)" },
	"100%": { opacity: 1, transform: "translateX(0)" },
});

const styles = {
	Content: css({
		zIndex: 10000,
		display: "flex",
		flexDirection: "column",
		alignItems: "flex-start",
		gap: "3px",
		padding: "10px",
		background: "#FFFFFF",
		borderRadius: "10px",
		filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
		opacity: 1,
		transform: "translateY(0)",
		transition: "opacity 150ms ease-in-out, transform 150ms ease-in-out",
		animationDuration: "400ms",
		animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
		willChange: "transform, opacity",
		pointerEvents: "auto",
		'&[data-state="open"]': {
			'&[data-side="top"]': { animationName: slideDownAndFade },
			'&[data-side="right"]': { animationName: slideLeftAndFade },
			'&[data-side="bottom"]': { animationName: slideUpAndFade },
			'&[data-side="left"]': { animationName: slideRightAndFade },
		},
	}),

	Hidden: css({
		opacity: 0,
		transform: "translateY(-10px)",
		pointerEvents: "none",
	}),

	MenuItem: css({
		width: "100%",
		borderRadius: "5px",
		fontSize: "14px",
		padding: "7px",
		transition: "all 200ms",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		gap: "7.5px",

		"&:hover": {
			background: "#E9E9E9",
		},
	}),

	RightIcon: css({
		marginLeft: "auto",
		paddingLeft: "20px",
	}),

	Divider: css({
		margin: "4px 0",

		"&::after": {
			content: "''",
			height: "1px",
			position: "absolute",
			left: 0,
			right: 0,
			backgroundColor: "#DEDEDE",
		},
	}),
};

function Popover({ children, ...props }: RadixPopover.PopoverProps) {
	return <RadixPopover.Root {...props}>{children}</RadixPopover.Root>;
}

function Target({ children, ...props }: RadixPopover.PopoverTriggerProps) {
	return (
		<RadixPopover.Trigger asChild {...props}>
			{children}
		</RadixPopover.Trigger>
	);
}

function Content({ children, ...props }: RadixPopover.PopoverContentProps) {
	return (
		<RadixPopover.Portal>
			<RadixPopover.Content css={[styles.Content, props.css]} {...props}>
				{children}
			</RadixPopover.Content>
		</RadixPopover.Portal>
	);
}

function CloseButton({ children, ...props }: RadixPopover.PopoverCloseProps) {
	return <RadixPopover.Close {...props}>{children}</RadixPopover.Close>;
}

function Arrow({ children, ...props }: RadixPopover.PopoverArrowProps) {
	return <RadixPopover.Arrow {...props}>{children}</RadixPopover.Arrow>;
}

function Divider() {
	return <div css={styles.Divider} />;
}

interface ItemProps {
	children: ReactNode;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
}

function Item({
	children,
	leftIcon,
	rightIcon,
	...props
}: HTMLAttributes<HTMLDivElement> & ItemProps) {
	return (
		<div css={styles.MenuItem} {...props}>
			{leftIcon}
			{children}
			{rightIcon && <div css={styles.RightIcon}>{rightIcon}</div>}
		</div>
	);
}

Popover.Target = Target;
Popover.Content = Content;
Popover.CloseButton = CloseButton;
Popover.Arrow = Arrow;
Popover.Item = Item;
Popover.Divider = Divider;
Popover.displayName = "Popover";

export default Popover;
