const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name."],
      maxlength: [20, "Name must be equal to or less than 20 characters."],
      minlength: [4, "Name must be equal to or less than 20 characters."],
    },
    email: {
      type: String,
      required: [true, "A user must have email."],
      validate: [validator.isEmail, "Please provide valid email."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "A user must have passowrd."],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    role: {
      type: String,
      default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("notes", {
  ref: "Note",
  foreignField: "userId",
  localField: "_id",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  encryptedPassword
) {
  return await bcrypt.compare(candidatePassword, encryptedPassword);
};

userSchema.methods.changePaawordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(64).toString("hex");

  // Save the hash one in database for comparing later
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
