import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch); // url params에 대한 정규표현식(regular expression) : ([0-9a-f]{24})
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit); // route()를 써서 get(), post()를 한 줄로 표현
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
