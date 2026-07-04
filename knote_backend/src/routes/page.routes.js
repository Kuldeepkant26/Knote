const express = require("express");
const pageController = require("../controllers/page.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  createPageValidator,
  updatePageValidator,
  pageIdValidator,
} = require("../validators/page.validator");

const router = express.Router();

router.use(protect); // all page routes require auth

router.post("/", createPageValidator, validate, pageController.createPage);
router.get("/:id", pageIdValidator, validate, pageController.getPage);
router.patch("/:id", updatePageValidator, validate, pageController.updatePage);
router.delete("/:id", pageIdValidator, validate, pageController.deletePage);

module.exports = router;
