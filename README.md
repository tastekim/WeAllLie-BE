## 🐱온라인 화상채팅 보드게임, We Are Lion

![600](https://user-images.githubusercontent.com/113876583/207038393-fdc23118-2da2-4974-b46e-fbe5fc00956f.jpg)

**'We Are Lion'** 은 보드게임 **'스파이 폴'** 을 모티브로 만든 온라인 화상 채팅 보드게임 플랫폼 입니다.

<br>

> # 1. 소개 

## 📆기간
- ### 2022.11.04 ~ 2022.12.16 (6주)

## 👨‍💻팀원

| Position | Name | Role | blog | Github |
|:----------:|:----------:|:----------:|:----------:|:----------:|
| BE `L` | 김연석 | Game 관련 socket 로직, 프로젝트 셋팅 | [tastekim.notion.site](https://tastekim.notion.site/tastekim_Devlog-fe856eb9ac6e416db3807c12fcab39c5) | https://github.com/tastekim |
| BE | 김형석 | Room, Chat 관련 socket 로직 | [stone1207.tistory.com](https://stone1207.tistory.com/) | https://github.com/chamchimayo |
| BE | 송민형 | User, Chat 관련 socket 로직, 인증 관련 API | [notion.so/Home](https://www.notion.so/Home-355200dabb9747fa93658bee658e23d2) | https://github.com/chamchimayo |
| BE | 최윤진 | Game 관련 socket 로직 | [velog.io/@yunjin5450](https://velog.io/@yunjin5450) | https://github.com/yunjin5450 |
| FE `VL` | 강승훈 |  | [velog.io/@deepthink](https://velog.io/@deepthink) | https://github.com/seunghoonKang |
| FE | 박하은 |   |  [haro-e.tistory.com](https://haro-e.tistory.com/) | https://github.com/parkharoi |
| FE | 최진영 |   | [notion.so/yoooooooung](www.notion.so/yoooooooung/6f65b151350f486f8696c9090504a15b) | https://github.com/yoooooooung |
| Design | 이주은 | 웹페이지 디자인 |  |  |

<br>

> # 2. 서비스

## 👨‍🏫서비스 소개
- **사자들 사이에 숨어든 고양이**로 디자인 컨셉을 정해 모든 연령대가 접근하기 쉽게 제작했습니다.
- 최소 4명 부터 최대 8명 까지 쉽고 간단한 게임 규칙으로 즐길 수 있습니다.
- 우리끼리?! 지인들과 즐길 수 있도록 **비밀방 설정**이 가능합니다.
- 실시간 채팅과 캠으로 유저들과 소통하며 온라인으로 **지금 당장** 게임을 즐겨보세요!

  👉 [We Are Lion 바로가기](https://we-all-lie.vercel.app/)

## 📰페이지 소개
| 메인페이지 | 로그인페이지 | 로비페이지 |
|:----------:|:----------:|:----------:|
| <img width="1395" alt="스크린샷 2022-12-14 오전 11 41 08" src="https://user-images.githubusercontent.com/113876583/207493542-319b2b7d-d93d-4179-a2f2-2c993ba69d8e.png"> | <img width="1431" alt="스크린샷 2022-12-14 오전 11 41 45" src="https://user-images.githubusercontent.com/113876583/207493561-080650cd-654b-4d73-91ea-c4eeacc01db6.png"> | <img width="1397" alt="스크린샷 2022-12-14 오전 11 44 02" src="https://user-images.githubusercontent.com/113876583/207493589-4b56be8d-3f21-45fa-9012-b0012bf69172.png"> |

| 방만들기페이지 | 방페이지 | 게임페이지 |
|:----------:|:----------:|:----------:|
| <img width="1394" alt="스크린샷 2022-12-14 오전 11 46 12" src="https://user-images.githubusercontent.com/113876583/207493612-870bfaae-ddbd-47f7-bd1d-a5ed371bf094.png"> | <img width="1395" alt="스크린샷 2022-12-14 오전 11 46 38" src="https://user-images.githubusercontent.com/113876583/207494929-4c54144c-b936-4aed-a7d6-c0c63fe52715.png">
 |  |

| 방만들기페이지 | 방페이지 | 게임페이지 |
|:----------:|:----------:|:----------:|
|  |  |  |

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

![아키텍처](https://user-images.githubusercontent.com/113876583/207357747-a8d22f13-4d50-4d4f-9b32-83c20120f2b2.png)


## 📊ERD
<details>
<summary>ERD</summary>
<div markdown="1">

![erd](https://user-images.githubusercontent.com/113876583/207319448-35612007-56e3-478d-a503-17691fc2bfcd.jpg)

</div>
</details>

## 📈프로젝트 구성
<details>
<summary>프로젝트 구성</summary>
<div markdown="1">

<br>

```markup
├── Dockerfile
├── nodemon.json
├── package-lock.json
├── package.json
├── server.js
├── src
│   ├── app.js
│   ├── chat
│   │   └── chat-socket.js
│   ├── game
│   │   ├── game-provider.js
│   │   ├── game-repo.js
│   │   └── game-socket.js
│   ├── middlewares
│   │   ├── auth-middleware.js
│   │   ├── exception.js
│   │   ├── passport
│   │   │   ├── index.js
│   │   │   └── kakao-stratege.js
│   │   ├── socket-auth-middleware.js
│   │   ├── test.js
│   │   ├── user-error-handler.js
│   │   └── wrap-async-controller.js
│   ├── redis.js
│   ├── rooms
│   │   ├── room-provider.js
│   │   ├── room-repo.js
│   │   └── room-socket.js
│   ├── schemas
│   │   ├── game.js
│   │   ├── index.js
│   │   ├── room.js
│   │   └── user.js
│   ├── socket.js
│   ├── users
│   │   ├── user-controller.js
│   │   ├── user-repo.js
│   │   ├── user-route.js
│   │   ├── user-service.js
│   │   └── util
│   │       ├── jwt.js
│   │       └── user-function.js
│   └── webRTC
│       └── webRTC.js
├── test
│   ├── mockData
│   │   └── user-data.js
│   └── user-test
│       ├── jwt.spec.js
│       ├── user-controller.spec.js
│       ├── user-function.spec.js
│       ├── user-repo.spec.js
│       └── user-service.spec.js
└── 제목 없는 다이어그램.drawio
```

</div>
</details>

## 🛠사용한 기술

- ### BackEnd   
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white"> <img src="https://img.shields.io/badge/JSONWebTokens-000000?style=for-the-badge&logo=JSONWebTokens&logoColor=white"> <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white"> <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"> <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white"> <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"> <img src="https://img.shields.io/badge/WebRTC-F37C20?style=for-the-badge&logo=WebRTC&logoColor=white">

- ### FrontEnd

  <img src="https://img.shields.io/badge/React Router-CA4245?style=for-the-badge&logo=React Router&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white"> <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white"> <img src="https://img.shields.io/badge/styled components-DB7093?style=for-the-badge&logo=styled components&logoColor=white"> <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"> <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"> <img src="https://img.shields.io/badge/WebRTC-F37C20?style=for-the-badge&logo=WebRTC&logoColor=white">

## ⁉기술적 의사 결정

- ### BE
    <details>
    <summary>1. Nginx</summary>
    <div markdown="1">
    
    <br>
    
     　**사용이유**
    
    - event-driven의 비동기 구조이므로 채팅 기능이나 RTC기능을 사용 할 때, 동시 접속자 수가 증가를 대비하여 적합한 방식의 웹 서버라고 생각했습니다. 또한 NginX는 이벤트 처리 방식, 비동기식 처리, 논블로킹 방식 처리를 통해 고속으로 처리하는 특징이 있어 사용하게 되었습니다. 
    - 동시 접속자 수가 많아져도 Apache에 비해 메모리 사용률이 낮고, 처리하는 초 당 요청 수가 앞도적으로 높은 모습을 보여줍니다. 
    - 메모리를 좀 더 효율적으로 운영할 수 있는 결과를 갖고 오기 때문에 사용하게 되었습니다. 
    - reverse proxy로 서버 확장에 용이하고 보안적으로 뛰어나기 때문에 사용했습니다.

    </div>
    </details>

    <details>
    <summary>2. Socket.io</summary>
    <div markdown="1">
    
    <br>
    
     　**사용이유**
    
    - 통상적으로 사용자(서버에 연결된 소켓들)을 세밀하게 관리해야하는 서비스에는 socket.io에 있는 브로드캐스팅을 사용하는게 더 효율적이라고 합니다.
    - socket을 이용해서 게임 로직과 같은 복잡한 구조를 갖고 socekt이라는 객체를 활용해서 서비스 내에서 활용하는 부분들을 생각하면 socekt.io가 더 적합하다고 판단했습니다.

    </div>
    </details>

    <details>
    <summary>3. Redis</summary>
    <div markdown="1">
    
    <br>
    
     　**사용이유**
    
    - 각 게임에 대해 투표 결과 집계나 준비 상태 등 DB에 저장할 필요는 없다고 생각했습니다.
    - I/O에 빈번한 간단한 액션들에 대해 가볍게 저장해 둘 DB에 memcached랑 redis 가 후보였습니다. memcached보다 redis가 cloud서비스로 제공이 초기 세팅하기에 더 빨라서 선택하게 됐습니다.
    - 간단한 데이터 타입들과 key, value 형식으로 저장할 수 있는 메모리를 사용하는 DB라서 I/O을 다루기에는 redis가 적합하다고 생각했습니다.
    - redis를 선택할 때 local과 cloud 두가지 옵션이 있었는데 협업하면서 사용하기에는 아무래도 local보단 cloud가 더 효율적일 것 같다는 생각이 들었습니다.

    </div>
    </details>

    <details>
    <summary>4. JWT</summary>
    <div markdown="1">
    
    <br>
    
     　**사용이유**
    
    - 카카오에서 발급받은 accessToken을 그대로 사용해도 되지만 카카오의 accessToken 의 유효시간이 11시간으로 굉장히 긴 편이라고 생각했습니다.
    - 직접 accessToken을 발급하고 유효시간을 줄여 보안을 조금 더 강화하고자 생각했습니다.
    - 세션 방식과 다르게 별도의 인증 저장소가 필요하지 않아 서버와의 커뮤니케이션을 최소한으로 할 수 있어 트래픽에 대한 부담이 적다고 생각이 들었습니다.

    </div>
    </details>

    <details>
    <summary>5. MongoDB</summary>
    <div markdown="1">
    
    <br>
    
     　**사용이유**
    
    - 프로젝트에서 DB에 저장하는 대상은 유저(전적, 개인정보) / 룸 / 게임 이렇게 세 가지 테이블(콜렉션) 밖에 필요하지 않고, 데이터의 집합 간의 종속성이 많지 않다고 생각했습니다.
    - 게임 내에서 실시간으로 변하는 정보나 방 상태의 변화의 경우 일시적인 정보는 Redis를 통해서 저장하기도 하지만, Redis로 모든 정보를 전부 처리할 수는 없기에 DB를 사용해야 하는 경우가 있고, 또 굉장히 자주 DB의 정보를 가져오거나 업데이트해야 하는 상황이 발생한다고 생각이 들었습니다.
    - 다른 데이터 집합을 연결시켜서 가져와야 하는 경우가 없다시피하기에 처리 속도가 빠른 NoSQL이 우리의 프로젝트와 더 적합하다고 판단했습니다.
    - 소켓을 통해 실시간으로 많은 정보가 생성, 변경되는 서비스이기 때문에 데이터를 빨리 읽어올 수 있으며 수직 및 수평 확장이 가능하다고 생각이 들었습니다.

    </div>
    </details>

    <details>
    <summary>6. Prettier / ESLint / Babel</summary>
    <div markdown="1">
    
    <br>
    
     　**사용이유**
    
    - prettier
      깔끔한 코드와 협업을 위해서 일관성 있는 코드 스타일을 제공해준다 생각하여 사용했습니다.
    - eslint
      다양한 방식으로 구현할 수 있는 코드 방식을 일관성 있게 구현할 수 있도록 해준다 생각하여 사용했습니다.
    - babel
      Babel을 이용하면 ES6 이상의 최신 문법으로 작성한 자바스크립트 코드를 ES5 이하의 예전 문법으로 작성한 것 처럼 소스 코드 내의 문법의 형태를 변경해주어 다양한 실행환경에서 작동할 수 있게 해준다 생각하여 사용했습니다.
    </div>
    </details>

　　👉 [기술적 의사 결정](https://www.notion.so/SIDE-PROJECT-a569695123b0458aa599641a5419a3e4)

## ⚽트러블슈팅 
 
- ### BE

　　👉 [카카오소셜 로그인 : 프론트로 데이터 전달 불가](https://aluminum-root-238.notion.site/76b50c99bbd04d0a84b9952dec1a5996) <br>
  
　　👉 [특정 룸으로 채팅메세지 전달 불가 (Socket.io)](https://aluminum-root-238.notion.site/socket-io-d9151a97e0e54ad89c7062f78370a7c1) <br>

　　👉 [Https서버 배포시 Socket접속 불가](https://aluminum-root-238.notion.site/Https-15381227cbb74d98a3854ec1deb4130d) <br>

<br>

> # 4. 기타

## 💻GitHub
  - ### BackEnd: [WeAreLion-BE](https://github.com/tastekim/WeAllLie-BE)
  - ### FrontEnd: [WeAreLion-FE](https://github.com/seunghoonKang/we-all-lie-fe)
