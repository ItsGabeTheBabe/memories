import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    id: { type: String },
});

const User = mongoose.model("User", userSchema); //what you want to name your model and what schema its based off

export default User;