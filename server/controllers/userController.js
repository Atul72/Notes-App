const Note = require("../models/notesModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("notes");

  if (!user) return next(new AppError("No user found", 403));

  res.status(200).json({
    status: "Success",
    user,
  });
});

exports.getAllNotesOfCurrentUser = catchAsync(async (req, res, next) => {
  if (req.params.userId !== req.user.id)
    return next(
      new AppError("You are not allowed to perform this action", 403)
    );
  const notes = await Note.find({ userId: req.params.userId });

  if (!notes) return next(new AppError("Create your first note", 404));

  res.status(200).json({
    status: "Success",
    notes,
  });
});
