const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

// This place also i have to add this "https://notes-app-pvrs.onrender.com/" because i have to send the link to
// email to reset password

const signToken = (id) => {
  const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    const message =
      "Hello and welcome to the NoteX company. Save your notes for later.";

    const options = {
      to: req.body.email,
      subject: "Welcome you to NoteX",
      message: message,
    };

    await sendEmail(options);

    res.status(201).json({
      status: "Success",
      token,
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    next(new AppError("Please enter email and password.", 404));

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return next(new AppError("Can't find the user. Please signUp", 403));

  if (!(await user.comparePassword(password, user.password)))
    return next(new AppError("Incorrect email or password!", 401));

  const token = signToken(user._id);

  res.status(201).json({
    status: "Success",
    token,
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("You are not authenticated.", 401));
  }

  token = req.headers.authorization.split(" ")[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }
  if (await currentUser.changePaawordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User currently changed the password. Please login again!",
        401
      )
    );
  }

  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized to perform this action.", 401)
      );
    }
    next();
  };
};

exports.sendResetPasswordEmail = catchAsync(async (req, res, next) => {
  const { userEmail } = req.body;

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    next(new AppError("No user found", 404));
  }

  const resetToken = await user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/users/resetPassword/${resetToken}`;
  const resetUrl = `https://notes-app-pvrs.onrender.com/reset/${resetToken}`;

  const message = `Your password reset URL is ${resetUrl}. if this is not you kindly ignore this.`;

  const options = {
    to: userEmail,
    subject: "Your password reset token valid for 10 min",
    message: message,
  };
  try {
    await sendEmail(options);
    res.status(200).json({
      status: "Success",
      message: "Token sent to email",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpiresIn = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was an error sending an email", 500));
  }
});

// http://127.0.0.1:7500/api/v1/users/resetPassword/fa5065d83cd5c3766b504890bb66bef03a3ebf17d342499c52ef0a15369c4a69bc6f2ca4804c78952764d6e63157fb998cb1baf9265a298a79d1712a4edcb3c3

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is inavlid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresIn = undefined;
  await user.save();

  res.status(201).json({
    status: "Success",
    message: "Password changed successfully!",
    user,
  });
});
