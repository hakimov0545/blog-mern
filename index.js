import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import { PORT, DB_URL } from "./constants/index.js";
import {
	loginValidation,
	registerValidation,
} from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";
import userController from "./controllers/user.controller.js";
import postController from "./controllers/post.controller.js";
import { createPostValidation } from "./validations/post.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({
	storage,
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post(
	"/auth/login",
	loginValidation,
	handleValidationErrors,
	userController.login
);
app.post(
	"/auth/register",
	registerValidation,
	handleValidationErrors,
	userController.register
);
app.get("/auth/me", checkAuth, userController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/tags", postController.getLastTags);

app.get("/posts", postController.getAll);
app.get("/posts/:id", postController.getById);
app.post(
	"/posts",
	checkAuth,
	createPostValidation,
	handleValidationErrors,
	postController.create
);
app.patch(
	"/posts/:id",
	createPostValidation,
	checkAuth,
	handleValidationErrors,
	postController.update
);
app.delete("/posts/:id", checkAuth, postController.delete);

const starter = async () => {
	try {
		await mongoose.connect(DB_URL).then(() => {
			console.log("DB connected");
		});
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(`Error connecting with DB: ${error}`);
	}
};

starter();
