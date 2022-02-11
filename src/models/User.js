import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, require: true },
  location: { type: String },
});

const User = mongoose.model("User", userSchema);
export default User;
