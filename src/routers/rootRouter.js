import express from "express";
import { home, search } from "../controllers/videoController";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userController";

const rootRouter = express.Router(); // 라우터 만들기

rootRouter.get("/", home); // 해당 라우터의 컨트롤러 사용하기
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
