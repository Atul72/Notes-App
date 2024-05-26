const Note = require("../models/notesModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find();
  res.status(201).json({
    status: "Success",
    notes,
  });
});

exports.getNote = catchAsync(async (req, res, next) => {
  const note = await Note.findOne(req.params.id);

  if (!note) return next(new AppError("No notes found.", 404));

  res.status(201).json({
    status: "Success",
    note,
  });
});

exports.createNote = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  const newNote = await Note.create({
    title: req.body.title,
    content: req.body.content,
    userId: req.body.user,
  });

  res.status(201).json({
    status: "Success",
    data: newNote,
  });
});
