import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev"); // morgan()은 함수를 리턴함

const Home = (req, res) => {
  return res.send("hello");
};
const login = (req, res) => {
  return res.send("login");
};
app.use(logger);
app.get("/", Home);
app.get("/login", login);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
