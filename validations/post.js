import { body } from "express-validator";

export const createPostValidation = [
	body("title", "Invalid title").isLength({ min: 3 }).isString(),
	body("text", "Invalid text").isLength({ min: 3 }).isString(),
	body("tags", "Invalid tags").optional().isString(),
	body("imageUrl", "Wrong image url").optional().isString(),
];
