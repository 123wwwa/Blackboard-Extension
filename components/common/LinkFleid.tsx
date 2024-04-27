/** @jsxImportSource @emotion/react */
import React, { type HTMLAttributes, type InputHTMLAttributes, type ReactNode, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ActionIcon  from "./ActionIcon";
import { faLink } from "@fortawesome/free-solid-svg-icons";
type Props = InputHTMLAttributes<HTMLInputElement> &
React.ClassAttributes<HTMLInputElement> & {
    icon?: ReactNode;
    wrapperProps?: HTMLAttributes<HTMLDivElement> &
        React.ClassAttributes<HTMLDivElement>;
};
const InputContainer = styled.input<{ icon?: ReactNode }>`
    border: 1px solid #e9e9e9;
    border-radius: 5px;
    padding: 4px 9px;
    font-size: 13px;
    font-weight: 400;
    width: 405px;
`;
const LinkField = ({ wrapperProps, ...props }: Props) => {
    const [link, setLink] = useState("");
    const [disPlayLinkField, setDisplayLinkField] = useState(false);
    const handleDisplay = () => {
        if(disPlayLinkField) {
            setDisplayLinkField(false);
        }
        else {
            setDisplayLinkField(true);
        }
    };
    useEffect(() => {
        // if disPlayLinkField is true and click outside of the link field, then setDisplayLinkField to false
        if(disPlayLinkField) {
            const handleClickOutside = (e: any) => {
                let parent = document.querySelector("#link-field") as HTMLElement;
                if(!parent.contains(e.target)) {
                    setDisplayLinkField(false);
                }
            };
            document.addEventListener("click", handleClickOutside);
            return () => {
                document.removeEventListener("click", handleClickOutside);
            };
        }
    }, [disPlayLinkField]);
    return (
        <div id="link-field">
            <ActionIcon icon={faLink} title="링크" onClick={handleDisplay} />
            {disPlayLinkField && (
                <div css={css({ position: "absolute", zIndex: "2", bottom: "45px", right: "55.5px" }, wrapperProps?.css)}>
                    <InputContainer icon={props.icon} {...props} type="url"/>
                </div>
            )}
        </div>
    );
}
export default LinkField;