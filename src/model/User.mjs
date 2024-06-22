import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    default: "Member",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("User", userSchema);
