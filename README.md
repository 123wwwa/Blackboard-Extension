# Blackboard Extension

UNIST Blackboard를 더 편리하게 사용할 수 있도록 만든 Chrome 확장 프로그램입니다. 과제와 강의 자료를 한곳에서 관리하고, 시간표와 PDF 보조 기능을 제공합니다.

## 주요 기능

- Blackboard 과제 및 마감 일정 확인
- 개인 할 일 추가·삭제 및 알림 설정
- 과제 일정을 Google Calendar에 연동
- Blackboard 시간표 표시
- 강의 자료와 제출한 과제 파일 다운로드
- PDF 내용 확인, 저장 및 OpenAI API를 이용한 요약
- Blackboard 퀴즈 풀이 보조 기능

일부 기능은 UNIST Blackboard 페이지에서만 동작하며, Google Calendar와 AI 기능은 각각 Google 로그인과 OpenAI API 키 설정이 필요합니다.

## 개발 환경 실행

Node.js와 Yarn이 설치되어 있어야 합니다.

```bash
git clone https://github.com/123wwwa/Blackboard-Extension.git
cd Blackboard-Extension
yarn install
yarn dev
```

개발 서버가 실행되면 Chrome에서 다음 순서로 확장 프로그램을 불러옵니다.

1. `chrome://extensions`로 이동합니다.
2. 우측 상단의 **개발자 모드**를 켭니다.
3. **압축해제된 확장 프로그램을 로드합니다**를 누릅니다.
4. 프로젝트의 `dist` 폴더를 선택합니다.

## 빌드

```bash
yarn build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

## 기술 스택

- React, TypeScript
- Vite
- CRXJS
- Chrome Extension Manifest V3

## 참고

이 프로젝트는 학교 웹사이트 구조와 외부 API에 의존하므로 Blackboard 화면이나 API 사양이 변경되면 일부 기능이 정상적으로 동작하지 않을 수 있습니다.
