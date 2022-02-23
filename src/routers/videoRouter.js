import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch); // url params에 대한 정규표현식(regular expression) : ([0-9a-f]{24})
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit); // route()를 써서 get(), post()를 한 줄로 표현
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
// multer fields는 여러 파일을 업로드 하는 기능
export default videoRouter;
