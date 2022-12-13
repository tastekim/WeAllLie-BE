## 🐱온라인 화상채팅 보드게임, We Are Lion

![600](https://user-images.githubusercontent.com/113876583/207038393-fdc23118-2da2-4974-b46e-fbe5fc00956f.jpg)

**'We Are Lion'** 은 보드게임 **'스파이 폴'** 을 모티브로 만든 온라인 화상 채팅 보드게임 플랫폼 입니다.

<br>

> # 1. 소개 

## 📆기간
- ### 2022.11.04 ~ 2022.12.16 (6주)

## 👨‍💻팀원

| Position | Name | Email | Github |
| - | - | - | - |
| Backend, L | 김연석 |  | https://github.com/tastekim |
| Backend | 김형석 | stone1207@naver.com | https://github.com/chamchimayo |
| Backend | 송민형 |  | https://github.com/chamchimayo |
| Backend | 최윤진 | yunjin5450@gmail.com | https://github.com/yunjin5450 |
| Frontend, VL | 강승훈 | tmdgns4321@gmail.com | https://github.com/seunghoonKang |
| Frontend | 박하은 | haha2000ab@gmail.com | https://github.com/parkharoi |
| Frontend | 최진영 | oaoa9n@gmail.com | https://github.com/yoooooooung |
| Design | 이주은 |  |  |

<br>

> # 2. 서비스

## 👨‍🏫서비스 소개
- **사자들 사이에 숨어든 고양이**로 디자인 컨셉을 정해 모든 연령대가 접근하기 쉽게 제작했습니다.
- 최소 4명 부터 최대 8명 까지 쉽고 간단한 게임 규칙으로 즐길 수 있습니다.
- 실시간 채팅과 캠으로 소통하며 온라인으로 **지금 당장** 게임을 즐겨보세요!

  👉 [We Are Lion 바로가기](https://github.com/tastekim/WeAllLie-BE) <-주소 넣어주십쇼

## 📰페이지 소개
  이미지 준비중...

## 🔍기능소개

**회원가입 페이지**

- 카카오 소셜로그인 회원가입

**로비 페이지**

- 방 목록 필터 (전체/easy/hard)
- 방 만들기 버튼 (공개/비공개) / 방 참여하기 버튼
- 로비 전체 채팅 

**방 페이지**

- 방정보 (모드, 인원 등)
- 게임 준비 / 게임 시작 
- 방 전체 채팅

**게임시작 페이지**

- 마이크, 카메라 기능
- 각자 역할 카드 분배 / 제시어 카테고리&단어 모달
- 투표 기능

<br>

> # 3. 구조

## 🤹‍♂️서비스 아키텍처
  이미지 준비중...

## 🛠사용한 기술

- ### BackEnd   
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white"> <img src="https://img.shields.io/badge/JSONWebTokens-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white"> <img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=Passport&logoColor=white"> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white"> <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"> <img src="https://img.shields.io/badge/WebRTC-F37C20?style=for-the-badge&logo=WebRTC&logoColor=white">

- ### FrontEnd

  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"> 
  
## 📊ERD
<details>
<summary>ERD</summary>
<div markdown="1">

![drawSQL-export-2022-11-11_01_43](https://user-images.githubusercontent.com/113876583/207110281-9e6c3c7b-eee5-4f2d-86bd-405b46a06f03.png)

</div>
</details>

## 📈API
<details>
<summary>HPPT API</summary>
<div markdown="1">

| 기능 | - | Method | URL | request | response |
| - | - | - | - | - | - |
| User | 카카오 로그인<br>(인가 코드로 토큰 받기) | GET | /api/auth/kakao/callback/:code |  | res.status(200).send(<br>{<br>accessToken : String<br>}<br>) |
| User | 카카오 로그인<br>(토큰으로 유저 정보 받기) | POST | /api/auth/kakao/callback | **req.headers**<br>{<br>authorization: String (kakaoToken)<br>} | res.status(200).send(<br>{<br>accessToken: String,<br>nickname: String,<br>}<br>) |
| User | 유저 정보 조회 | GET | /api/user | **req.headers**<br>{<br>authorization: String (서버 발급 토큰)<br>} | res.status(200).send(<br>{<br>userId: Number,<br>nickname: String,<br>profileImg: String,<br>totayPlayCount: Number,<br>spyPlayCount: Number,<br>ctzPlayCount: Number,<br>spyWinRating: Number, (단위 %)<br>voteSpyRating: Number (단위 %)<br>}<br>) |
| User | 유저 정보 수정 | PUT | /api/user | **req.headers**<br>{<br>authorization: String (서버 발급 토큰)<br>}<br>**req.body**<br>{<br>nickname: String<br>} | res.status(200).send(<br>{<br>nickname: String,<br>}<br>) |

</div>
</details>

<details>
<summary>Socket API</summary>
<div markdown="1">

| 기능 | - | Event Message | [FE]emit | [BE]on | [BE]emit | [FE]on |
| - | - | - | - | - | - | - |    
| Room | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Room | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Room | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Room | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Game | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Game | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Game | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Game | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Game | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Game | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Chat | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |
| Chat | 입력 | 입력 | 입력 | 입력 | 입력 | 입력 |

</div>
</details>

<br>

> # 4. 기타

## 💻GitHub
  - ### BackEnd: [WeAreLion-BE](https://github.com/tastekim/WeAllLie-BE)
  - ### FrontEnd: [WeAreLion-FE](https://github.com/seunghoonKang/we-all-lie-fe)
