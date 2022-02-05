import express from "express";

const globalRouter = express.Router(); // 라우터 만들기

const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome); // 해당 라우터의 컨트롤러 사용하기

export default globalRouter;
