import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import { SketchPicker } from "react-color";
import ActionIcon from "./ActionIcon";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
interface Props {
    color: string;
    setColor: React.Dispatch<React.SetStateAction<string>>;
}

interface State {
    displayColorPicker: boolean;
    color: {
        r: string;
        g: string;
        b: string;
        a: string;
    };
}
const SketchColorPicker = (props: Props) => {
    interface Color {
        r: string;
        g: string;
        b: string;
        a: string;
    };
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    const [color, setColor] = useState<Color>({
        r: "241",
        g: "112",
        b: "19",
        a: "1",
    });

    const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
    };

    const handleChange = (color: any) => {
        setColor(color.rgb);
        props.setColor(color.hex);
    };
    useEffect(() => {
        // if displaycolorpicker is true and click outside of the color picker, then setDisplayColorPicker to false
        if (displayColorPicker) {
            const handleClickOutside = (e: any) => {
                let parent  = document.querySelector("#color-picker") as HTMLElement;
                if(!parent.contains(e.target)) {
                    setDisplayColorPicker(false);
                }
            };
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }
    }, [displayColorPicker]);
    const styles = {
        color: css({
            width: "28px",
            height: "28px",
            borderRadius: "10px",
            color: props.color,
        }),
        swatch: css({
            padding: "5px",
            background: "#fff",
            borderRadius: "1px",
            boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
            display: "inline-block",
            cursor: "pointer",
        }),
        popover: css({
            bottom: "45px",
            position: "absolute",
            zIndex: "2",
        }),
        cover: css({
            position: "relative",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
        }),
    };
    return (
        <div id="color-picker">
            {displayColorPicker ? (
                <div css={styles.popover}>
                    <div css={styles.cover} onClick={handleClose} />
                    <SketchPicker
                        color={props.color}
                        onChange={handleChange}
                    />
                </div>
            ) : null}
            <ActionIcon
                css={styles.color}
                icon={faPalette}
                opacity="0.8"
                onClick={handleClick}
            />
        </div>
    );
}
export default SketchColorPicker;