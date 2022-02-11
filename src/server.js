import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev"); // morgan()은 함수를 리턴함

app.set("view engine", "pug"); // view engine으로 pug 설정하기
app.set("views", process.cwd() + "/src/views"); // views 디폴트값을 src폴더 안의 views폴더로 설정하기, cwd()는 current working directory
app.use(logger);
app.use(express.urlencoded({ extended: true })); // express는 request post body data를 객체 형태로 변환하여 받기 위해 Middleware 설정이 필요함
app.use("/", rootRouter); // 라우터 사용하기
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;

// 서버파일은 express 관련된 것만 나타낼 수 있도록 init파일에 db를 넣고 분리시킴.
