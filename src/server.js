import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev"); // morgan()은 함수를 리턴함
app.use(logger);

const handleHome = (req, res) => res.send("Home");
const globalRouter = express.Router(); // 라우터 만들기
globalRouter.get("/", handleHome); // 해당 라우터의 컨트롤러 사용하기

const handleEditUser = (req, res) => res.send("Edit User");
const userRouter = express.Router();
userRouter.get("/edit", handleEditUser);

const handleWatchVideo = (req, res) => res.send("Watch Video");
const videoRouter = express.Router();
videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter); // 라우터 사용하기
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
