import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev"); // morgan()은 함수를 리턴함

app.set("view engine", "pug"); // view engine으로 pug 설정하기
app.set("views", process.cwd() + "/src/views"); // views 디폴트값을 src폴더 안의 views폴더로 설정하기, cwd()는 current working directory
app.use(logger);
app.use(express.urlencoded({ extended: true })); // express는 request post body data를 객체 형태로 변환하여 받기 위해 Middleware 설정이 필요함

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, // 모든 request마다 세션의 변경사항이 있든 없든 세션을 다시 저장할 것인가? > false:
    saveUninitialized: false, // session data가 초기화되지 않아도 저장할 것인가? > false : 메모리 절약, 로그인(에서 data수정 발생) 유저만 저장, 익명유저는 제외
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }), // DB에 session 저장, session collection이 생성되고 data가 저장됨
  })
); // Session Middleware: session을 생성하여 정보를 기록, 생성한 session id를 브라우저로 보냄

app.use(flash());
app.use(localsMiddleware); // session data를  브라우저 locals에 저장, pug는 locals data를 전역(global)으로 갖다 쓸 수 있음.
app.use("/uploads", express.static("uploads")); // static 설정: 해당 url(uploads폴더)로 브라우저가 읽을 수 있도록 설정함.
app.use("/static", express.static("assets")); // express static을 통해 assets 폴더를 해당 url로 노출시킴
app.use("/", rootRouter); // 라우터 사용하기
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;

// 서버파일은 express 관련된 것만 나타낼 수 있도록 init파일에 db를 넣고 분리시킴.
