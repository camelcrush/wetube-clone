import express from "express";
import { trending, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router(); // 라우터 만들기

globalRouter.get("/", trending); // 해당 라우터의 컨트롤러 사용하기
globalRouter.get("/join", join);
globalRouter.get("/login", login);

export default globalRouter;
