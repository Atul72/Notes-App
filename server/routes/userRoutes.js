const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const notesController = require("../controllers/notesController");

const router = express.Router();

// Only for post and other stuff not to get the data of certain user or something
// router.use("/:userId/notes", notesController.getAllNotes);

router.post("/signUp", authController.signUp);
router.post("/login", authController.login);
router.post("/resetPassword/:token", authController.resetPassword);

router.get("/me", authController.protect, userController.getMe);

router.get(
  "/:userId/notes",
  authController.protect,
  authController.restrictTo("user"),
  userController.getAllNotesOfCurrentUser
);

module.exports = router;
