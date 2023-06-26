const mongoose = require("mongoose");
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, defaut: "" },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// UserSchema.methods.token=async(id)=>
// {
//   return await jwt.sign(
//     { id},
//     {eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ},
//     { expiresIn: "5d" }
//   );
// }

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
});



module.exports = mongoose.model("User", UserSchema);
