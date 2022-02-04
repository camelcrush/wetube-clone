import express from "express";

const PORT = 4000;

const app = express();

const logger = (req, res, next) => {
  // MiddleWare는  next Argument 가지고 있음
  console.log(`${req.method} ${req.url}`);
  next();
};

const handleHome = (req, res) => {
  return res.end();
};

// app.use(logger) 는 전역(global) Middleware로 사용 가능
app.get("/", logger, handleHome); // logger Middleware 다음 handleHome controller가 실행됨, 컨트롤러도 next 인수를 가지고 있음.

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
