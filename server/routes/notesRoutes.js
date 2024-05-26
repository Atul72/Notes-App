const express = require("express");
const notesController = require("../controllers/notesController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  authController.protect,
  authController.restrictTo("admin", "user"),
  notesController.getAllNotes
);

router.post(
  "/",
  authController.protect,
  authController.restrictTo("user"),
  notesController.createNote
);

module.exports = router;
