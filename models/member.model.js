const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const memberSchema = mongoose.Schema(
  {
    memberName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    yob: { type: Number, required: true },
    gender: { type: Boolean, default: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
memberSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

memberSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("Members", memberSchema);
