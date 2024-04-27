/** @jsxImportSource @emotion/react */
import React, { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";

type Props = {
  setShow: Dispatch<SetStateAction<boolean>>;
  position: { x: number; y: number };
  setPosition: Dispatch<SetStateAction<{ x: number; y: number }>>;
};

function DragButton({ setShow, position, setPosition }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null); // 버튼에 대한 ref 생성

  useEffect(() => {
    // resize 이벤트 핸들러
    const handleResize = () => {
      if (position.x > window.innerWidth - 100) {
        setPosition({ x: window.innerWidth - 100, y: position.y });
      }
      if (position.y > window.innerHeight - 60) {
        setPosition({ x: position.x, y: window.innerHeight - 60 });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, setPosition]);



  const [hexaLogo, setHexaLogo] = useState(chrome.runtime.getURL("assets/HeXA_logo.png"));
  const [isDragging, setIsDragging] = useState(false);
  const startMousePos = useRef({ x: position.x, y: position.y });
  const startPos = useRef({ x: position.x, y: position.y });
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const handleMouseUp = () => {
      if (isDragging) {
        // 드래그 상태를 false로 설정하여 드래그를 멈춤
        setIsDragging(false);
        // 마우스 이동 이벤트 리스너 제거
        document.removeEventListener("mousemove", handleMouseMove);
      }
    };
    const handleMouseDown = (event: MouseEvent) => {
      // 드래그 시작 시 마우스 위치와 요소의 현재 위치를 기록
      startMousePos.current = { x: event.clientX, y: event.clientY };
      startPos.current = { x: position.x, y: position.y };

      setIsDragging(true);
      document.addEventListener("mousemove", handleMouseMove);
    };
    if (button) {
      // 버튼에 mousedown 이벤트 리스너 추가
      button.addEventListener("mousedown", handleMouseDown);
    }
    document.addEventListener("mouseup", handleMouseUp);
    // 마우스 이동 이벤트 핸들러
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const delta = {
        x: event.clientX - startMousePos.current.x,
        y: event.clientY - startMousePos.current.y,
      };

      setPosition({
        x: startPos.current.x + delta.x,
        y: startPos.current.y + delta.y,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    button.addEventListener("mousedown", handleMouseDown);
    // 기타 이벤트 리스너 추가 및 제거...

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mousedown", handleMouseDown);
      // 기타 이벤트 리스너 제거...
    };
  }, [isDragging, position, setPosition]);
  // handleMouseMove를 useEffect 내부에 정의
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (event: MouseEvent) => {
      const delta = {
        x: event.clientX - startMousePos.current.x,
        y: event.clientY - startMousePos.current.y,
      };
      setPosition({
        x: startPos.current.x + delta.x,
        y: startPos.current.y + delta.y,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isDragging, setPosition]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setShow((show) => !show);
  };

  const styles = {
    Wrapper: css({
      position: "fixed",
      left: position.x,
      top: position.y,
      fontSize: "16px",
      fontFamily: "Pretendard-Regular",
      zIndex: 10000,
      width: "50px",
      height: "50px",
      padding: "5px",
      borderRadius: "10px",
      border: "2px solid #dadada",
      ':focus': {
        outline: "none",
        borderColor: "#9ecaed",
        boxShadow: "0 0 10px #9ecaed",
      },
    }),
    Img: css({
      width: "100%",
      height: "100%",
    })
  };

  return (
    <button
      ref={buttonRef}
      css={styles.Wrapper}
      onClick={handleClick}
      id="hexa-drag-button"
    >
      <img src={hexaLogo} css={styles.Img} alt="Hexa Logo" />
    </button>
  );
}

export default DragButton;