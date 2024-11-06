# Calcify

기본 계산기와 공학용 계산기를 모두 지원하는 크로스 플랫폼 데스크톱 애플리케이션입니다.

## 주요 기능

- 💡 기본/공학용 계산기 모드 전환
- 🌓 라이트/다크 모드 지원
- ⌨️ 키보드 입력 지원
- 🧮 메모리 기능 (MC, MR, M+, M-, MS) 개발 중
- 📐 공학용 계산기 기능
  - 삼각함수 (sin, cos, tan)
  - 수학 상수 (π, e)
  - 고급 연산 (√, x², xʸ, |x|, 1/x)

## 기술 스택

### 프론트엔드

- React 18.3.1
- TypeScript 5.6.2

- Tailwind CSS 3.4.14
- Vite 5.4.10

### 데스크톱 애플리케이션

- Electron 33.0.2
- electron-builder 25.1.8

### 개발 도구

- ESLint
- concurrently
- cross-env

## 실행 방법

### 개발 모드

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run electron:dev

```

### 빌드

```bash
# 프로덕션 빌드
npm run electron:build

```

## 단축키

| 키                 | 기능      |
| ------------------ | --------- |
| `0-9`              | 숫자 입력 |
| `+`, `-`, `*`, `/` | 기본 연산 |
| `Enter`, `=`       | 계산      |
| `Escape`           | 초기화    |
| `Backspace`        | 삭제      |
| `s`                | sin       |
| `c`                | cos       |
| `t`                | tan       |
| `r`                | 제곱근    |
| `p`                | π         |
| `e`                | 자연상수  |

## 시스템 요구사항

- **Windows**: 64비트 Windows 10 이상
- **macOS**: Apple Silicon (M1/M2) macOS 11.0 이상

## 빌드 산출물

- **Windows**: NSIS 인스톨러 (.exe)
- **macOS**: DMG 패키지 (.dmg)

## 프로젝트 구조

```
├── src/
│   ├── components/         # React 컴포넌트
├── build/                 # 빌드 리소스
└── dist/                  # 빌드 출력

```

## 제작자

- **개발자**: yono
