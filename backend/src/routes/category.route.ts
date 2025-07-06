import { Router } from "express";
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller";
import {
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} from "../middlewares/category.validate";
import { validateResult } from "../middlewares/validateResult";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", createCategoryValidator, validateResult, createCategory);
router.put("/:id", updateCategoryValidator, validateResult, updateCategory);
router.delete("/:id", deleteCategoryValidator, validateResult, deleteCategory);

export default router;
