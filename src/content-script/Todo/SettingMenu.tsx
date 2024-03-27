/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />
import React, { useEffect, useState } from "react";
import ActionIcon from "./common/ActionIcon";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {

    faGear,
    faPowerOff,

    faUserCircle,
    faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";

import Popover from "./common/Popover";

import ImageButton from "./common/ImageButton";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { css } from "@emotion/react";
import * as Switch from "@radix-ui/react-switch";
import { reloadSetting, reloadUserEmail, selectAlarm, selectAlarmTime, selectApiKey, selectIsAutoSave, selectIsPreviousVersion, selectUserEmail, updateSetting } from "../../features/setting_reducer";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./TodoMenu";
import { on } from "events";

export const SettingMenu = () => {
    const [showSettingMenu, setShowSettingMenu] = useState<boolean>(false);
    const userEmail = useSelector(selectUserEmail);
    const isAlarmSet = useSelector(selectAlarm);
    const alarmTime = useSelector(selectAlarmTime);
    const isAutoSave = useSelector(selectIsAutoSave);
    const apiKey = useSelector(selectApiKey);
    const isPreviousVersion = useSelector(selectIsPreviousVersion);
    const dispatch = useDispatch();
    const logoutOauth = () => {
        window.chrome.runtime.sendMessage({ action: "logout" }, (response) => {
        });
    }
    const onAlarmChange = (e: boolean) => {
        updateSetting(dispatch, "isAlarmSet", e);
    }
    const onChangeAlarmTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        // input only number and limit to 2 digits
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
        e.target.value = e.target.value == "" ? "0" : e.target.value;
        let convertedTime = parseInt(e.target.value);
        updateSetting(dispatch, "alarmTime", convertedTime);
    }
    const onChangeApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateSetting(dispatch, "apiKey", e.target.value);
    }
    const onChangeAutoSave = (e: boolean) => {
        updateSetting(dispatch, "isAutoSave", e);
    }
    const onChangePreviousVersion = (e: boolean) => {
        updateSetting(dispatch, "isPreviousVersion", e);
    }
    const getFormattedDate = (date: Date, time: string) => {
        let day = date.getDate().toString().padStart(2, '0');
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let year = date.getFullYear().toString();
        // Create formatted date string
        let formattedDate = `${month}/${day}/${year}%20${time}`;
        return formattedDate;
        // time start: 00:00:00 end: 23:59:59
    }
    const openMylab = () => {
        let now = new Date();
        let twoWeeksFromNow = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000));
        let startDate = getFormattedDate(now, "00:00:00");
        let endDate = getFormattedDate(twoWeeksFromNow, "23:59:59");
        let url = `https://mylab.pearson.com/api/studenthome?requestType=studenthomedata&StartDate=${startDate}&EndDate=${endDate}`;
        window.open(url, "_blank");
    }
    return (
        <Popover open={showSettingMenu} onOpenChange={setShowSettingMenu}>
            <Popover.Target>
                <ActionIcon icon={faGear} />
            </Popover.Target>
            <Popover.Content css={styles.SettingMenu}>
                <p>구글 캘린더 설정</p>
                <Popover.Divider />
                <Popover.Item
                    leftIcon={<FontAwesomeIcon icon={faUserCircle} opacity="0.4" />}
                >
                    <span css={styles.SettingMenuItemLabel}>{userEmail}</span>
                </Popover.Item>
                <Popover.Item
                    leftIcon={<FontAwesomeIcon icon={faPowerOff} opacity="0.4" />}
                >
                    <span css={styles.SettingMenuItemLabel} onClick={logoutOauth}>로그아웃</span>
                </Popover.Item>
                <div css={styles.NotificationItemContainer}>
                    <Popover.Item
                        leftIcon={<FontAwesomeIcon icon={faBell} opacity="0.4" />}
                    >
                        <span css={styles.SettingMenuItemLabel}>알림</span>
                        <div css={styles.SwitchContainer}>
                            <Switch.Root
                                id="alarm-label"
                                css={styles.SwitchRoot}
                                checked={isAlarmSet}
                                onCheckedChange={onAlarmChange}
                            >
                                <Switch.Thumb css={styles.SwitchThumb} />
                            </Switch.Root>
                            <label htmlFor="alarm-label" css={styles.SwitchLabel}>
                                <input onChange={onChangeAlarmTime} css={styles.TextInput} value={alarmTime} />
                                <span css={styles.SettingMenuItemLabel}>분전</span>
                            </label>
                        </div>
                    </Popover.Item>
                </div>
                <Popover.Item
                    leftIcon={<FontAwesomeIcon icon={faNetworkWired} opacity="0.4" />}
                >
                    <div css={styles.SwitchContainer}>
                        <span css={styles.SettingMenuItemLabel}>자동 연동</span>
                        <Switch.Root
                            id="alarm-label"
                            css={styles.SwitchRoot}
                            checked={isAutoSave}
                            onCheckedChange={onChangeAutoSave}
                        >
                            <Switch.Thumb css={styles.SwitchThumb} />
                        </Switch.Root>
                    </div>
                </Popover.Item>
                <Popover.Divider />
                <div>
                    <ImageButton
                        icon="public/icons/ChatGPT_logo.svg.png"
                        title="Chatgpt API key"
                        labelProps={{ css: styles.ImageButtonLabel }}
                        imageProps={{ css: styles.ImageButtonImage }}
                        css={styles.ImageButton}
                    />
                </div>
                <label htmlFor="alarm-label" css={styles.SwitchLabel}>
                    <input onChange={onChangeApiKey} css={styles.TextInput2} value={apiKey} />
                </label>
                <Popover.Divider />
                <div css={styles.SwitchContainer}>
                    <span css={styles.SettingMenuItemLabel}>이전 버전 사용</span>
                    <Switch.Root
                        id="isPrevVer-label"
                        css={styles.SwitchRoot}
                        checked={isPreviousVersion}
                        onCheckedChange={onChangePreviousVersion}
                    >
                        <Switch.Thumb css={styles.SwitchThumb} />
                    </Switch.Root>
                </div>
                <Popover.Divider />
                <ImageButton
                    icon="public/icons/icon-mylab.png"
                    title="Mylab 일정 연동"
                    labelProps={{ css: styles.ImageButtonLabel }}
                    imageProps={{ css: styles.ImageButtonImage }}
                    css={styles.ImageButton}
                    onClick={openMylab}
                />
            </Popover.Content>
        </Popover>
    )
};