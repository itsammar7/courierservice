const express = require("express");
const router = express.Router();

// @route   Get api/posts/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({msg: "Post Works"}));

module.exports = router;
