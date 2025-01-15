import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  displayName: {
    // to display username is the case in which user entered
    type: String,
    // required: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
