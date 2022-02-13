import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import { localsMiddleWare } from "./middlewares";

const app = express();
const logger = morgan("dev"); // morgan()은 함수를 리턴함

app.set("view engine", "pug"); // view engine으로 pug 설정하기
app.set("views", process.cwd() + "/src/views"); // views 디폴트값을 src폴더 안의 views폴더로 설정하기, cwd()는 current working directory
app.use(logger);
app.use(express.urlencoded({ extended: true })); // express는 request post body data를 객체 형태로 변환하여 받기 위해 Middleware 설정이 필요함

app.use(
  session({
    secret: "Hello!",
    resave: false, // 모든 request마다 세션의 변경사항이 있든 없든 세션을 다시 저장할 것인가? > false:
    saveUninitialized: false, // session data가 초기화되지 않아도 저장할 것인가? > false : 메모리 절약, 로그인(에서 data수정 발생) 유저만 저장, 익명유저는 제외
    cookie: {
      // cookie 설정 가능: 쿠기 만료 기간, 사용자가 브라우저를 닫거나 종료하지 않은 이상 해당 기간만큼 쿠키가 저장되어 있음, expires와 maxAge 중에는 maxAge가 우선순위가 높음
      maxAge: 20000, // 밀리세컨드 단위
    },
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/wetube" }), // DB에 session 저장, session collection이 생성되고 data가 저장됨
  })
); // Session Middleware: session을 생성하여 정보를 기록, 생성한 session id를 브라우저로 보냄

app.use(localsMiddleWare); // session data를  브라우저 locals에 저장, pug는 locals data를 전역(global)으로 갖다 쓸 수 있음.

app.use("/", rootRouter); // 라우터 사용하기
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;

// 서버파일은 express 관련된 것만 나타낼 수 있도록 init파일에 db를 넣고 분리시킴.
