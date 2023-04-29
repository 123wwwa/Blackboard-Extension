import React from "react";
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
class SketchColorPicker extends React.Component<Props, State> {
    state: State = {
        displayColorPicker: false,
        color: {
            r: "241",
            g: "112",
            b: "19",
            a: "1",
        },
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false });
    };

    handleChange = (color: any) => {
        this.setState({ color: color.rgb });
        this.props.setColor(color.hex);
    };

    render() {
        const styles = {
            color: css({
                width: "36px",
                height: "25px",
                borderRadius: "2px",
                color: this.props.color,
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
            <div>
                <div>
                    {this.state.displayColorPicker ? (
                        <div css={styles.popover}>
                            <div
                                css={styles.cover}
                                onClick={this.handleClose}
                            />
                            <SketchPicker
                                color={this.props.color}
                                onChange={this.handleChange}
                            />

                        </div>
                    ) : null}
                    <ActionIcon css={styles.color}
                        icon={faPalette}
                        opacity="0.8"
                        onClick={this.handleClick}>
                        </ActionIcon>
                    {/* <div
                        css={styles.swatch}
                        onClick={this.handleClick}
                    >
                        <div css={styles.color} />
                    </div> */}


                </div>
            </div>
        );
    }
}
export default SketchColorPicker;