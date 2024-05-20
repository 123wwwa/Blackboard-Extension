/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { css } from '@emotion/react';
import { SketchPicker } from "react-color";
import { faPalette } from "@fortawesome/free-solid-svg-icons";
import ActionIcon from "./ActionIcon";
import useLectureStore from "~shared/stores/lectureStore";
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
    const { lectureObject } = useLectureStore();
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
    const colorlist = ["#f2e8e8", "#ffe9e9", "#eff9cc", "#dcf2e9", "#dee8f6", "#fff8cc", "#ffedda", "#dceef2", "#ddd6fe", "#e0e7ff", "#f0abfc", "#7dd3fc"];
    let colorObject = colorlist.map(color => {
        // LectureObject에서 해당 색상을 찾아보기
        const foundLecture = Object.values(lectureObject).find(lecture => lecture.color === color);
        if (foundLecture) {
          return { color, title: foundLecture.name, isMatch: true };
        } else {
          return { color, title: color, isMatch: false };
        }
    });
    colorObject = colorObject.sort((a, b) => {
        return (b.isMatch === a.isMatch) ? 0 : b.isMatch ? 1 : -1;
    });
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
                        presetColors={colorObject}
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