import { body } from "express-validator";

export const loginValidation = [
	body("email", "Invalid email").isEmail(),
	body(
		"password",
		"Password must be at least 5 characters"
	).isLength({ min: 5 }),
];
export const registerValidation = [
	body("email", "Invalid email").isEmail(),
	body(
		"password",
		"Password must be at least 5 characters"
	).isLength({ min: 5 }),
	body(
		"fullName",
		"Full name must contain at least 3 characters"
	).isLength({ min: 3 }),
	body("avatarUrl", "Wrong avatar url").optional().isURL(),
];
