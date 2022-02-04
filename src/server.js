import express from "express";

const PORT = 4000;

const app = express();

app.get("/", (req, res) => {
  return res.end();
});
app.get("/login", (req, res) => {
  return res.send("login here");
});

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);
