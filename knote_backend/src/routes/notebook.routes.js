const express = require("express");
const notebookController = require("../controllers/notebook.controller");
const validate = require("../middlewares/validate.middleware");
const { protect } = require("../middlewares/auth.middleware");
const {
  createNotebookValidator,
  updateNotebookValidator,
  notebookIdValidator,
  addSectionValidator,
  updateSectionValidator,
  deleteSectionValidator,
} = require("../validators/notebook.validator");

const router = express.Router();

router.use(protect); // all notebook routes require auth

router.get("/", notebookController.listNotebooks);
router.post("/", createNotebookValidator, validate, notebookController.createNotebook);
router.get("/:id", notebookIdValidator, validate, notebookController.getNotebook);
router.patch("/:id", updateNotebookValidator, validate, notebookController.updateNotebook);
router.delete("/:id", notebookIdValidator, validate, notebookController.deleteNotebook);

router.post("/:id/sections", addSectionValidator, validate, notebookController.addSection);
router.patch("/:id/sections/:sectionId", updateSectionValidator, validate, notebookController.updateSection);
router.delete("/:id/sections/:sectionId", deleteSectionValidator, validate, notebookController.deleteSection);

module.exports = router;
