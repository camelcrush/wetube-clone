import "regenerator-runtime";
import "dotenv/config";
import "./db"; // 반드시 파일 자체를 import 해줘야함, server가 파일을 일고 db를 연결함.
import "./models/Video"; // 모델을 preload시킴, 반드시 db를 import한 후에..
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
