import express from "express";
import {
  watch,
  edit,
  upload,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", watch); // url params에 대한 정규표현식(regular expression) : (\\d+)는 숫자만 허용하겠다는 뜻
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);

export default videoRouter;
