# 터틀체인 2.0

### 🛠 프론트 개발환경 구성

```shell
# 레포지토리 클론
git clone https://bitbucket.org/turtleship/turtlechain-v2.git

# 레포지토리 이동
cd turtlechain-v2

# devel 브런치 이동
git checkout devel

# yarn이 설치되어 있지 않은 경우 yarn 설치
npm install -g yarn

# 의존성 설치
yarn install

# 로컬 서버 실행 : http://localhost:52273
yarn start

# storybook 실행 : http://localhost:6006
yarn storybook

# test 실행
yarn test
```

<br>

### ⭐️ 주요 라이브러리

- SPA 라이브러리 : react(v17)
- package 라이브러리 : yarn, craco(v6), env-cmd(v10)
- test 라이브러리 : storybook(v6), @testing-library/jest-dom(v5), @testing-library/react-hooks(v8)
- UI 라이브러리 : antd(v4), emotion(v11)
- 라우팅 라이브러리 : react-router-dom(v6)
- 전역 상태 관리 라이브러리 : recoil(v0)
- 비동기 상태 관리 라이브러리 : axios(v0), react-query(v3)
- 날짜 및 시간 관리 라이브러리 : moment(v2), react-moment(v1)
- 다국어 처리 : i18next(v21), react-i18next(v11)

<br>

### 📦 디렉토리 구조

```
build             # 빌드된 파일이 저장될 디렉토리
storybook         # storybook 설정 파일이 있는 디렉토리
public            # 정적 파일을 넣는 디렉토리
  assets          # assets 관련 디렉토리
src
  __test__        # test 코드가 있는 디렉토리
  apis            # api 요청 함수 및 axios 인스턴스가 있는 디렉토리
  assets          # icon svg 파일이 있는 디렉토리
  components
    combine       # 전역에서 자주 사용되는 컴포넌트가 있는 디렉토리
    element       # 스타일링된 기본 컴포넌트가 있는 디렉토리
  constant        # 상수 값이 있는 디렉토리
  hooks           # custom hooks가 있는 디렉토리
  i18n            # 문자열 처리 관련 디렉토리
  layouts         # 레이아웃 컴포넌트가 있는 디렉토리
  pages           # 페이지에서 사용되는 컴포넌트를 모아둔 디렉토리
  store           # 전역 스토어 디렉토리
  utils           # 자주 사용되는 유틸리티가 있는 디렉토리
  index.tsx       # 루트 컴포넌트
```
