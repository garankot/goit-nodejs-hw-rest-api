const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  confirm,
  resend,
} = require("../../controllers/users");
const router = express.Router();
const {
  schemaRegister,
  schemaLogin,
  schemaVerify,
} = require("../../models/user");
const { validateRequest } = require("../../middlewares/validateRequest");
const { auth, upload } = require("../../middlewares");
const { uploadImage } = require("../../services/image.service");
const { updateUser } = require("../../services/user.service");

router.post("/signup", validateRequest(schemaRegister), registerUser);
router.post("/login", validateRequest(schemaLogin), loginUser);
router.post("/logout", auth, logoutUser);
router.get("/current", auth, getCurrentUser);
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const { _id: id } = req.user;
      const avatarURL = await uploadImage(id, req.file);
      await updateUser(id, { avatarURL });
      res.json({ avatarURL });
    } catch (e) {
      next(e);
    }
  }
);
router.get("/verify/:verificationToken", confirm);
router.post("/verify", validateRequest(schemaVerify), resend);

module.exports = router;
