import { body, param } from "express-validator";

export const createCategoryValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long")
];

export const updateCategoryValidator = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("Invalid category ID"),
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long")
];

export const deleteCategoryValidator = [
    param("id")
        .isInt({ gt: 0 })
        .withMessage("Invalid category ID")
];
