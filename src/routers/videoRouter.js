import express from "express";
import { watch, getEdit, postEdit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); // url params에 대한 정규표현식(regular expression) : (\\d+)는 숫자만 허용하겠다는 뜻
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); // route()를 써서 get(), post()를 한 줄로 표현

export default videoRouter;
