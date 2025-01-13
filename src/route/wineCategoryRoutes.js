import express from "express";
import {wineCategoryController} from "../controller/wineCategoryController.js";

const router = express.Router();

router.put('/:id/margin', wineCategoryController.updateMargin);
router.post('/:categoryId/addSubcategories', wineCategoryController.addSubCategoryToCategory);
router.put('/:subCategoryId/subCategoryName', wineCategoryController.updateSubCategoryName);
router.delete('/:subCategoryId', wineCategoryController.deleteSubCategory);

export default router;