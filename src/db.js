import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube"); // mongoose와 db를 연결

const db = mongoose.connection; // db 불러오기

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError); // on은 error가 날 때마다 캐치하기 위해
db.once("open", handleOpen); // once는 연결은 한번 이루어지기 때문에
