import React, { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode; // 자식 컴포넌트 타입
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // 에러가 발생했을 때 상태를 업데이트하기 위한 메소드
  static getDerivedStateFromError(_: Error): State {
    // 오류 발생 시, 대체 UI를 렌더링하기 위해 상태를 업데이트합니다.
    return { hasError: true };
  }

  // 에러 정보를 캐치하여 추가 로깅을 수행할 수 있는 메소드
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 여기에서 에러 리포팅 서비스에 오류 정보를 로그할 수 있습니다.
    console.error("Error caught in Error Boundary: ", error);
    console.error("Error details: ", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 보여줄 대체 UI
      return <h1>Extension Error</h1>;
    }

    // 에러가 없을 때는 자식 컴포넌트를 정상적으로 렌더링합니다.
    return this.props.children;
  }
}

export default ErrorBoundary;